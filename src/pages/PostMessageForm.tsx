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
    // Render a form with an input field for the message and a submit button
    <form onSubmit={handleSubmit} className="post-message-form">
      <label htmlFor="message">Post Message:</label>
      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="post-message-textarea"
      />
      <br />
      <button type="submit" className="post-message-button">Post</button>
    </form>
  );
}

export default PostMessageForm;
