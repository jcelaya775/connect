import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useSearch() {
  const queryClient = useQueryClient();
  const url = process.env.NEXT_PUBLIC_URL;
  console.log(url);

  const {
    data: searchResults,
    isLoading: searchResultsLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search", "users"],
    queryFn: async () => {
      const {
        data: { users },
      } = await axios.get(`${url}/api/users`);
      return users;
    },
  });

  const searchMutation = useMutation({
    mutationKey: ["search", "users"],
    mutationFn: async (searchTerm: string) => {
      const {
        data: { users },
      } = await axios.get(
        `${url}/api/users?name=${searchTerm}&username=${searchTerm}&email=${searchTerm}`
      );
      return users;
    },
    onSuccess: (filteredUsers) => {
      queryClient.setQueryData(["search", "users"], filteredUsers);
    },
  });

  return {
    searchResults,
    searchResultsLoading,
    searchMutation,
    searchError,
  };
}
