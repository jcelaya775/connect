import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/models/User";
import axios from "axios";

export type Friend = IUser["_id"] &
  IUser["name"] &
  IUser["email"] &
  IUser["username"] &
  IUser["profile_picture"];

export default function useFriends(uid?: string) {
  const queryKey: string[] = uid ? ["users", uid!, "friends"] : ["friends"];
  const endpoint = uid ? `/api/users/${uid!}/friends` : `/api/friends`;

  const {
    data: friends,
    isLoading: friendsLoading,
    error: friendsError,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const {
        data: { friends },
      }: { data: { friends: Friend[] } } = await axios.get(endpoint);

      return friends;
    },
  });

  return { friends, friendsLoading, friendsError };
}
