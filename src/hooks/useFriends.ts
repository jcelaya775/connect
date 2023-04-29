import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/models/User";
import axios from "axios";
import { relationshipTypes } from "@/types/relationship";

export type Friend = IUser["_id"] &
  IUser["name"] &
  IUser["email"] &
  IUser["username"] &
  IUser["profile_picture"];

export default function useFriends(uid?: string) {
  const queryClient = useQueryClient();
  const [relationship, setRelationship] = useState<relationshipTypes>();
  const queryKey: string[] = uid ? ["users", uid!, "friends"] : ["friends"];
  const endpoint = uid ? `/api/users/${uid!}/friends` : `/api/friends`;

  const {
    data: friends,
    isLoading: friendsLoading,
    error: friendsError,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axios.get(endpoint);
      setRelationship(data.relationship);
      return data.friends;
    },
  });

  const friendButtonMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async () => {
      console.log(`relationship: ${relationship}`);
      let data;

      switch (relationship) {
        // Remove or cancel friend request
        case relationshipTypes.friends:
        case relationshipTypes.pendingFriend: {
          console.log(`Removing or canceling friend request`);
          const res = await axios.delete(`/api/users/${uid}/friends`);
          data = res.data;
          break;
        }
        // Add or accept friend request
        case relationshipTypes.notFriends:
        case relationshipTypes.friendRequest: {
          console.log(`Adding or accepting friend request`);
          const res = await axios.post(`/api/users/${uid}/friends`);
          data = res.data;
          break;
        }
      }

      console.log(data);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    relationship,
    relationshipLoading: !relationship && !friendsLoading,
    friends,
    friendButtonMutation,
    friendsLoading,
    friendsError,
  };
}
