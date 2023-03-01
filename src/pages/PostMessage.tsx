import { useState } from 'react';
import usePostMessage from './PostMessageForm';

// Define a form component for posting messages
const PostMessageForm = () => {
  // Initialize a state for the message input value
  const [message, setMessage] = useState('');
  
  // Get the `useMutation` instance for posting a message from the server
  const postMessageMutation = usePostMessage();

  // Define a function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the message is not empty or only whitespace
    if (message.trim() !== '') {
      // Call the `mutateAsync` function to send the message to the server
      await postMessageMutation.mutateAsync({ message });
      // Reset the message input value
      setMessage('');
    }
  };

  // Render the form with the message input and a submit button
  return (
    <form onSubmit={handleSubmit}>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PostMessageForm;