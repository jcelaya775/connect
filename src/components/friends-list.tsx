import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/models/User";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

type Friend = IUser["_id"] & IUser["name"] & IUser["email"] & IUser["username"];

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: pendingFriends,
    isLoading: pendingFriendsLoading,
    error: pendingFriendsError,
  } = useQuery({
    queryKey: ["users", "me", "friends", "pending"],
    queryFn: async () => {
      const {
        data: { pendingFriends },
      }: { data: { pendingFriends: Friend[] } } = await axios.get(
        "/api/users/me/friends/pending"
      );

      console.log(pendingFriends);

      return pendingFriends;
    },
  });

  const {
    data: friends,
    isLoading: friendsLoading,
    error: friendsError,
  } = useQuery({
    queryKey: ["users", "me", "friends"],
    queryFn: async () => {
      const {
        data: { friends },
      } = await axios.get("/api/users/me/friends");

      return friends;
    },
  });

  const addFriendMutation = useMutation({
    mutationKey: ["users", "me", "friends", "add"],
    mutationFn: async (userId: string) => {
      const {
        data: { friend },
      } = await axios.post(`/api/users/${userId}/friends`);

      return friend;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users", "me", "friends"]);
    },
  });

  const declineFriendRequestMutation = useMutation({
    mutationKey: ["users", "me", "friends", "delete"],
    mutationFn: async (userId: string) => {
      const {
        data: { friend },
      } = await axios.delete(`/api/users/${userId}/friends`);

      return friend;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users", "me", "friends"]);
    },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="px-8 sm:px-24 lg:px-10 mt-4">
        <input
          placeholder="Search friends"
          className="w-full rounded-md h-10 pl-5"
          value={searchTerm}
        />
      </div>
      {!pendingFriends ||
        (pendingFriends.length === 0 && (
          <p className="text-center p-10">No pending friends</p>
        ))}
      {pendingFriends && pendingFriends.length > 0 && (
        <div className="p-8 sm:px-24 lg:px-10 mt-0">
          <h2 className="text-xl font-medium mb-4">Pending friends</h2>

          <div className="card bg-base-100 p-4 h-max overflow-y-scroll">
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingFriends.map((friend: Friend) => (
                <li
                  key={friend._id}
                  className="bg-base-100 shadow-md rounded-md overflow-hidden"
                >
                  <div className="flex items-center p-4">
                    <Image
                      src={friend.profilePicture}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{friend.name}</h3>
                      <p className="text-gray-500">Pending approval</p>
                    </div>
                    <div className="tooltip tooltip-left" data-tip="Accept">
                      <button
                        title="Accept"
                        onClick={() => addFriendMutation.mutate(friend._id)}
                        className="inline-flex items-center px-0 py-0 mr-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    {/* <div className="md:divider md:divider-horizontal"></div> */}
                    <div className="tooltip tooltip-left" data-tip="Deny">
                      <button
                        title="Decline"
                        onClick={() =>
                          declineFriendRequestMutation.mutate(friend._id)
                        }
                        className="inline-flex items-center px-0 py-0 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="px-8 sm:px-24 lg:px-10 mt-0 divider"></div>
      <div className="px-8 sm:px-24 lg:px-10 mt-0">
        <h2 className="text-xl font-medium mb-4">All friends</h2>
        <div className="card bg-base-100 p-4 h-max">
          {!friends ||
            (friends.length === 0 && (
              <p className="text-center p-10">No friends</p>
            ))}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends &&
              friends.map((friend: Friend) => (
                <li
                  key={friend._id}
                  className="bg-base-100 shadow-md rounded-md overflow-hidden"
                >
                  <div className="flex items-center p-4">
                    <Image
                      src={friend.profilePicture}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{friend.name}</h3>
                      <p className="text-gray-500">Friend</p>
                    </div>
                    <button className="btn btn-primary btn-sm normal-case">
                      <Link href={`/${friend.name.replace(" ", "")}`}>
                        View Profile
                      </Link>
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
