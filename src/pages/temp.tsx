import { useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import create from 'zustand';

// Define the shape of a message
type Message = {
  id: number;
  title: string;
  message: string;
  likes: number;
};

// Define the shape of the state for the useMessageStore
type State = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addLike: (id: number) => void;
};

// Create the useMessageStore
const useMessageStore = create<State>((set) => ({
  messages: [], // Initial empty array of messages
  setMessages: (messages) => set({ messages }), // Update messages array in state
  addLike: (id) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, likes: message.likes + 1 } : message // Increment likes count for selected message
      ),
    })),
}));

export default function PostMessages() {
  const { messages } = useMessageStore(); // Get messages from the store

  // Fetch messages from server using react-query
  const { isLoading, error } = useQuery<Message[]>(
    'messages', // Cache key
    async () => {
      const response = await fetch('/api/temp'); // Fetch data from server
      const data = await response.json(); // Parse response as JSON
      const parsedMessages = data.message.map(
        (message: { title: string; message: string }, idx: number) => ({
          id: idx,
          title: message.title,
          message: message.message,
          likes: 0, // Initialize likes count to 0
        })
      );
      useMessageStore.getState().setMessages(parsedMessages); // Set messages in the store
      return parsedMessages; // Return parsed messages
    }
  );

  // Display loading message if data is still loading
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Display error message if there is an error
  if (error) {
    return <p>Oops! Something went wrong.</p>;
  }

  // Render the list of messages
  return (
    <div>
      <h1>Post Messages</h1>
      {messages &&
        messages.map((message) => (
          <div key={message.id}>
            <h2>
              <a
                href={`/messages/${message.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`Message ${message.id}`}
              </a>
            </h2>
            <p>{message.message}</p>
            <p>Likes: {message.likes}</p>
            <button
              onClick={() => useMessageStore.getState().addLike(message.id)} // Add like to selected message
            >
              Like
            </button>
          </div>
        ))}
      <ReactQueryDevtools position="bottom-right" />
    </div>
  );
}
