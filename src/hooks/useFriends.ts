import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/models/User";
import axios from "axios";
import { relationshipTypes } from "@/types/relationship";
import { ObjectId } from "mongoose";

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
      console.log(data);
      setRelationship(data.relationship);
      return data.friends;
    },
  });

  const searchFriendMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async (searchTerm: string) => {
      let endpoint: string = uid ? `/api/users/${uid}/friends` : "/api/friends";
      endpoint += `?name=${searchTerm}&username=${searchTerm}&email=${searchTerm}`;
      const {
        data: { friends },
      }: { data: { friends: Friend[] } } = await axios.get(endpoint);

      return friends;
    },
    onSuccess: (filteredFriends) => {
      queryClient.setQueryData(queryKey, filteredFriends);
    },
  });

  const {
    data: friendRequests,
    isLoading: friendRequestsLoading,
    error: friendRequestsError,
  } = useQuery({
    queryKey: [...queryKey, "requests"],
    queryFn: async () => {
      const endpoint = uid
        ? `/api/users/${uid}/friends/requests`
        : "/api/friends/requests";
      const {
        data: { friendRequests },
      }: { data: { friendRequests: Friend[] } } = await axios.get(endpoint);

      return friendRequests;
    },
  });

  const friendButtonMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({
      addFriend = undefined,
      userId = undefined,
    }: {
      addFriend?: boolean;
      userId?: ObjectId;
    }) => {
      let data;

      if (addFriend !== undefined) {
        if (addFriend === true)
          data = await axios.post(`/api/users/${userId}/friends`);
        else data = await axios.delete(`/api/users/${userId}/friends`);
      } else {
        switch (relationship) {
          // Remove or cancel friend request
          case relationshipTypes.friends:
          case relationshipTypes.pendingFriend: {
            const res = await axios.delete(`/api/users/${uid}/friends`);
            data = res.data;
            break;
          }
          // Add or accept friend request
          case relationshipTypes.notFriends:
          case relationshipTypes.friendRequest: {
            const res = await axios.post(`/api/users/${uid}/friends`);
            data = res.data;
            break;
          }
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(["friends"]);
    },
  });

  return {
    relationship,
    relationshipLoading: friendsLoading,
    friends,
    friendsLoading,
    searchFriendMutation,
    friendRequests,
    friendRequestsLoading,
    friendButtonMutation,
    friendsError,
  };
}
