import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

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
      // Send a POST request to the server to create a new message
      const response = await axios.post('/api/messages', message);

      // Return the response data
      return response.data;
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
  const postMessage = usePostMessage();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    postMessage.mutate( );
  
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