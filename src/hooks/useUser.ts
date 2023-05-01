import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/models/User";
import axios from "axios";

export default function useUser(uid?: string) {
  const queryClient = useQueryClient();
  const queryKey: string[] = uid ? ["users", uid!] : ["users", "me"];
  const endpoint: string = uid ? `/api/users/${uid}` : `/api/auth`;

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<IUser>({
    queryKey,
    queryFn: async () => {
      const { data } = await axios.get(endpoint);
      return data.user;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 60 * 1, // 1 hour
  });

  return user;
}
