import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface MessageData {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Define a custom hook that returns a `useMutation` instance
// for posting a message to the server
function usePostMessage() {
  const queryClient = useQueryClient();

  const postMessage = useMutation<MessageData>(
    async (message) => {
      // Send a POST request to the server to create a new message
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      // Parse the JSON response from the server
      const data = await response.json();

      // Return the response data
      return data;
    },
    {
      // When the mutation succeeds, invalidate the 'messages' query in the query cache
      onSuccess: () => {
        queryClient.invalidateQueries('messages');
      },
    }
  );

  return postMessage;
}

function PostMessageForm() {
  // Get the `useMutation` instance for posting a message from the server
  const postMessage = usePostMessage();

  // Initialize a state for the message input value
  const [message, setMessage] = useState('');

  // Define a function to handle the form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the `mutate` function to send the message to the server
    postMessage.mutate({ message }, {});

    // Reset the message input value
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <label htmlFor="message" style={{ display: 'block', marginBottom: 10 }}>
        Post Message:
      </label>
      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ display: 'block', marginBottom: 10, width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <button type="submit" style={{ background: 'blue', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 20px' }}>
        Post
      </button>
    </form>
  );

}

export default PostMessageForm;

