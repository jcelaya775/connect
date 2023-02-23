import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface MessageData {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

function usePostMessage() {
  const queryClient = useQueryClient();

  const postMessage = useMutation<MessageData>(
    async (message) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      const data = await response.json();
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('messages');
      },
    }
  );

  return postMessage;
}

function PostMessageForm() {
  const postMessage = usePostMessage();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postMessage.mutate({ message }, {}); // passing an object with a `message` property
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="message">Post Message:</label>
      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Post</button>
    </form>
  );
}

export default PostMessageForm;
