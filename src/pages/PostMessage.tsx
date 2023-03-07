import { useState } from 'react';
import usePostMessage from './PostMessageForm';

// Define the shape of the new message object
interface NewMessage {
  title: string;
  message: string;
}

export default function PostMessageForm() {
  // Set initial state for the new message object
  const [newMessage, setNewMessage] = useState<NewMessage>({ title: '', message: '' });

  // Get the postMessage mutation from the usePostMessage hook
  const postMessageMutation = usePostMessage();

  // Handle changes to the title input
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage({ ...newMessage, title: event.target.value });
  };

  // Handle changes to the message input
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage({ ...newMessage, message: event.target.value });
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Call the postMessage mutation with the new message object
    await postMessageMutation.mutateAsync({
      title: newMessage.title,
      message: newMessage.message,
    });

    // Clear the form inputs by resetting the new message object
    setNewMessage({ title: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={newMessage.title} onChange={handleTitleChange} />
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <input type="text" id="message" value={newMessage.message} onChange={handleMessageChange} />
      </div>
      <button type="submit">Post</button>
    </form>
  );
}
