import { useEffect, useState } from "react";
import SideNav from "./SideNav";
import EditProfileModal from "./edit-profile-modal";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useUser from "@/hooks/useUser";
import useFriends, { Friend } from "@/hooks/useFriends";
import UserPosts from "./user-posts";
import UserFeed from "./user-feed";
import { useRouter } from "next/router";
import Image from "next/image";
import defaultProfile from "../images/default_profile.jpg";
import { profile } from "console";

const friendsList = [
  {
    _id: 1,
    name: "John Doe",
    profile_picture: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    _id: 2,
    name: "Jane Doe",
    profile_picture: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    _id: 3,
    name: "Bob Smith",
    profile_picture: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    _id: 4,
    name: "Alice Smith",
    profile_picture: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

const UserProfilePage = () => {
  const router = useRouter();
  const { uid }: { uid?: string } = router.query;
  const { user, profilePicture, biography } = useUser();
  const { friends } = useFriends(uid);
  const [friendModalVisible, setFriendsModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);

  return (
    <>
      {editProfileModalVisible && (
        <EditProfileModal setVisible={setEditProfileModalVisible} />
      )}
      <div className="min-h-screen min-w-full bg-base-200 pt-16 pb-8">
        <span className="hidden sm:block">
          <SideNav />
        </span>
        {/* Main Content Area */}
        <div className="flex-1 bg-base-200 min-h-screen pr-8 pt-6 pl-8 sm:pl-24 w-full lg:pl-48 xl:pr-8">
          <div className="flex flex-row gap-x-10">
            <div className="flex-initial w-full">
              <div className="flex flex-col w-full gap-5">
                <div className="container mx-auto my-8">
                  {/*  Profile Card  */}
                  <div className="-mt-7 flex items-center w-full px-4 py-10 bg-cover card bg-[url('https://picsum.photos/id/314/1000/300')]">
                    <div className="card glass lg:card-side text-neutral-content relative">
                      {/* <button className="btn btn-sm absolute top-0 right-0 lg:mt-4 lg:mr-4 sm: mt-72 sm:mr-4 xs: mt-72 xs: mr-4">Add Friend</button> */}
                      <div className="indicator m-auto pt-6 lg:pl-6 lg:pt-0">
                        <div className="avatar w-fit">
                          <div className="w-[200px] h-[200px] rounded-full ring ring-primary">
                            <span className="indicator-item w-10 h-10 indicator-bottom badge border border-transparent bg-transparent transform -translate-x-1/4 -translate-y-1/4">
                              <label
                                htmlFor="edit-profile-modal"
                                className="btn btn-primary btn-square rounded-full cursor-pointer"
                                onClick={() =>
                                  setEditProfileModalVisible((prev) => !prev)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                </svg>
                              </label>
                            </span>
                            <Image
                              src={profilePicture ?? defaultProfile}
                              alt="Profile picture"
                              width={100}
                              height={100}
                              unoptimized
                            />
                          </div>
                        </div>
                      </div>
                      <div className="max-w-md card-body">
                        <h2 className="card-title text-3xl font-bold text-gray-900">
                          {user?.name}
                        </h2>
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
                            href="/friends"
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

export default UserProfilePage;
