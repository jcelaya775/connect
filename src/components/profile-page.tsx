import { useState } from "react";
import SideNav from "./SideNav";
import UserPosts from "./user-posts";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import { relationshipTypes } from "@/types/relationship";
import useFriends, { Friend } from "@/hooks/useFriends";
import Link from "next/link";
import Image from "next/image";
import defaultProfile from "../images/default_profile.jpg";

const friendsList = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 3,
    name: "Bob Smith",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 4,
    name: "Alice Smith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

export const ProfilePage = () => {
  const router = useRouter();
  const { uid }: { uid?: string } = router.query;
  const { user: currentUser } = useUser();
  const { user: targetUser, biography, profilePicture } = useUser(uid);
  const url = process.env.NEXT_PUBLIC_URL;
  const [friendsModalVisible, setFriendsModalVisible] =
    useState<boolean>(false);
  const currentUserPage: boolean = String(currentUser?._id) === uid;

  const {
    relationship,
    relationshipLoading,
    friends,
    friendsLoading,
    friendButtonMutation,
  } = useFriends(uid);

  return (
    <>
      <div className="min-h-screen min-w-full bg-base-200 pt-16 pb-8">
        <span className="hidden sm:block">
          <SideNav />
        </span>
        {/* Main Content Area */}
        <div className="flex-1 bg-base-200 min-h-screen pr-8 pt-6 pl-8 sm:pl-24 w-full lg:pl-48 xl:pr-0">
          <div className="flex flex-row gap-x-10">
            <div className="flex-initial w-full mr-5">
              <div className="flex flex-col w-full gap-5">
                <div className="container mx-auto my-8">
                  {/*  Profile Card  */}
                  <div className="flex items-center w-full px-4 py-10 bg-cover card bg-[url('https://picsum.photos/id/314/1000/300')]">
                    <div className="card glass lg:card-side text-neutral-content">
                      <div className="avatar m-auto pt-6 lg:pl-6 lg:pt-0 w-fit">
                        <div className="w-[200px] h-[200px] rounded-full ring ring-primary">
                          <Image src="https://picsum.photos/200" alt="image" />
                        </div>
                      </div>
                      <div className="max-w-md card-body">
                        <div className="flex flex-col gap-y-2 md:flex-row md:w-full justify-between">
                          <div className="card-title text-3xl font-bold text-gray-900">
                            {targetUser?.name}
                          </div>
                          {!currentUserPage && (
                            <div
                              className="btn btn-small btn-primary w-max justify-end normal-case"
                              onClick={() => friendButtonMutation.mutate({})}
                            >
                              {relationshipLoading
                                ? "Loading..."
                                : relationship === relationshipTypes.friends
                                ? "Remove Friend"
                                : relationship ===
                                  relationshipTypes.pendingFriend
                                ? "Pending Friend"
                                : relationship ===
                                  relationshipTypes.friendRequest
                                ? "Accept Request"
                                : "Add Friend"}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700">Connect User Since 2023</p>
                        <p className="text-black">
                          {biography ?? "No biography yet."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-4 xl:flex-row xl:gap-x-4 mt-4 mr-0">
                    <div className="flex flex-col gap-y-4 w-full xl:w-3/4 order-2 xl:order-1">
                      <div className="card w-full bg-base-100 rounded">
                        <div className="card-title p-4">Posts</div>
                      </div>
                      <UserPosts />
                    </div>
                    <div className="flex flex-col gap-y-4 w-full xl:w-1/4 order-1 xl:order-2">
                      <div className="card w-full bg-base-100 rounded h-min">
                        <div className="card-title p-4">Friends</div>
                      </div>

                      <div className="card bg-base-100 rounded">
                        <div className="card-body">
                          <div className="flex flex-no-wrap w-fit xl:flex-wrap">
                            {friends &&
                              friends.slice(0, 4).map((friend: Friend) => (
                                <div
                                  key={friend._id}
                                  className="w-full xl:w-1/2 p-3"
                                >
                                  <div className="avatar md:px-5 lg:px-10 xl:px-0">
                                    <div className="w-full rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 max-h-36">
                                      <Link href={`/users/${friend._id}`}>
                                        <Image
                                          src={
                                            friend.profile_picture?.signedUrl ??
                                            defaultProfile
                                          }
                                          width={100}
                                          height={100}
                                          alt={friend.name}
                                          unoptimized
                                        />
                                      </Link>
                                    </div>
                                  </div>
                                  <h2 className="text-center text-sm">
                                    {friend.name}
                                  </h2>
                                </div>
                              ))}
                          </div>
                          <Link
                            href={`${url}/users/${uid}/friends`}
                            className="btn btn-primary btn-sm mx-4 my-4 normal-case"
                          >
                            View All Friends
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
