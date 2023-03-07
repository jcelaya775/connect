import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

interface MessageData {
  id: string;
  message: string;
  title: string;
}

interface PostMessageRequest {
  message: string;
  title: string;
}

// Define a custom hook for posting a message
const usePostMessage = () => {
  // Get a reference to the query client instance
  const queryClient = useQueryClient();

  // Define a mutation using the useMutation hook
  const postMessageMutation = useMutation<MessageData, unknown, PostMessageRequest>(
    // Define an async function that sends a POST request to the server to create a new message
    async (request) => {
      const response = await axios.post<MessageData>('/api/temp', request);
      // Return the response data
      return response.data;
    },
    {
      // When the mutation succeeds, invalidate the 'messages' query in the query cache
      onSuccess: () => {
        queryClient.invalidateQueries('messages');
      },
    },
  );

  // Return the mutation object
  return postMessageMutation;
};

export default usePostMessage;