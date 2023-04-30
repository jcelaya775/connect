import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/models/User";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import useFriends from "@/hooks/useFriends";
import useUser from "@/hooks/useUser";

type Friend = IUser["_id"] &
  IUser["name"] &
  IUser["email"] &
  IUser["username"] &
  IUser["profile_picture"];

const FriendsPage = () => {
  const router = useRouter();
  const { uid }: { uid?: string } = router.query;
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();
  const { user: targetUser } = useUser(uid);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {
    friends,
    friendsLoading,
    searchFriendMutation,
    friendRequests,
    friendRequestsLoading,
    friendButtonMutation,
  } = useFriends(uid);
  const url = process.env.NEXT_PUBLIC_URL;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="px-8 sm:px-24 lg:px-10 mt-4">
        <input
          placeholder="Search friends"
          className="w-full rounded-md h-10 pl-5"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            searchFriendMutation.mutate(e.target.value);
          }}
        />
      </div>
      {friendRequests && friendRequests.length > 0 && (
        <div className="p-8 sm:px-24 lg:px-10 mt-0">
          <h2 className="text-xl font-medium mb-4">Friend requests</h2>
          <div className="card bg-base-200 p-4 h-max">
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {friendRequests.map((friend: Friend) => (
                <li
                  key={friend._id}
                  className="bg-base-100 shadow-md rounded-md overflow-hidden"
                >
                  <div className="flex items-center p-4">
                    <Link
                      className="flex items-center p-4"
                      href={`${url}/users/${friend._id}`}
                    >
                      {friend.profile_picture ? (
                        <Image
                          src={friend.profile_picture}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                      ) : (
                        <div className="w-9 rounded-full mr-6">
                          <svg
                            viewBox="0 0 512 512"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current"
                          >
                            <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{friend.name}</h3>
                        <p className="text-gray-500">Pending approval</p>
                      </div>
                    </Link>
                    <div
                      className="tooltip tooltip-left z-10"
                      data-tip="Accept"
                    >
                      <button
                        title="Accept"
                        onClick={() =>
                          friendButtonMutation.mutate({
                            addFriend: true,
                            userId: friend._id,
                          })
                        }
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
                    <div className="tooltip tooltip-left z-10" data-tip="Deny">
                      <button
                        title="Decline"
                        onClick={() =>
                          friendButtonMutation.mutate({
                            addFriend: false,
                            userId: friend._id,
                          })
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
      {String(currentUser?._id) === String(targetUser?._id) &&
      friendRequests &&
      friendRequests.length > 0 ? (
        <div className="px-8 sm:px-24 lg:px-10 mt-0 divider"></div>
      ) : (
        <div className="py-2"></div>
      )}
      <div className="px-8 sm:px-24 lg:px-10 mt-0">
        <h2 className="text-xl font-medium mb-4">
          {String(currentUser?._id) === String(targetUser?._id)
            ? "All friends"
            : `${targetUser?.name}'s friends`}
        </h2>
        <div className="card bg-base-200 p-4 h-max">
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
                    {friend.profile_picture ? (
                      <Image
                        src={friend.profile_picture}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                    ) : (
                      <div className="w-9 rounded-full mr-6">
                        <svg
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current"
                        >
                          <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{friend.name}</h3>
                      <p className="text-gray-500">Friend</p>
                    </div>
                    <button className="btn btn-primary btn-sm normal-case">
                      <Link href={`${url}/users/${friend._id}`}>
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
