import { useEffect, useState } from "react";
import SideNav from "./SideNav";
import EditProfileModal from "./edit-profile-modal";
import Link from "next/link";
import Post, { PostProps } from "./post";
import { platformTypes } from "@/types/platform";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useUser from "@/hooks/useUser";
import { GenericPost, IFacebookPost } from "@/types/post";
import { IConnectPost } from "@/models/Post";
import useFriends, { Friend } from "@/hooks/useFriends";
import Posts from "./posts";
import Image from "next/image";

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
const UserProfilePage = () => {
  const { user, userLoading } = useUser();
  const { friends, friendsLoading, friendsError } = useFriends();
  const [friendModalVisible, setFriendsModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: [`${user?._id}`, "posts"],
    queryFn: async () => {
      const {
        data: { posts },
      } = await axios.get(`/api/feed`);

      return posts;
    },
    refetchOnWindowFocus: false,
    enabled: !userLoading,
  });

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
                    <div className="card glass lg:card-side text-neutral-content">
                      <figure className="p-6 relative">
                        <img
                          src="https://picsum.photos/200"
                          alt="Profile Picture"
                          className="rounded-full ml-0 mx-auto border-white border-2"
                        >
                        </img>
                        {/* <!-- Edit Profile Picture Button --> */}
                        <label
                          htmlFor="edit-profile-modal"
                          className="btn-outline btn-square bg-white cursor-pointer absolute bottom-8 right-8 rounded-full w-8 h-8 flex items-center justify-center"
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
                            <img src="https://picsum.photos/200" />
                          </div>
                        </div>
                      </div>
                      <div className="max-w-md card-body">
                        <h2 className="card-title text-3xl font-bold text-gray-900">
                          John Doe
                        </h2>
                        <p className="text-gray-700">Connect User Since 2023</p>
                        <p className="text-white-400">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Unde laudantium enim ab doloremque quod velit
                          tenetur delectus hic labore aliquam, soluta id magni
                          praesentium facere quos rem facilis numquam dolore.{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                  </div>
                  <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4 mt-4 mr-0">
                    <div className="flex flex-col gap-y-4 w-full md:w-3/4">
                      <div className="card w-full bg-base-100 rounded">
                        <div className="card-title p-4">Posts</div>
                      </div>
                      <Posts uid={user?._id} />
                    </div>
                    <div className="flex flex-col gap-y-4 w-full xl:w-1/4 order-1 xl:order-2">
                      <div className="card w-full bg-base-100 rounded h-min">
                        <div className="card-title p-4">Friends</div>
                      </div>

                      <div className="card bg-base-100 rounded">
                        <div className="card-body">
                          <div className="flex flex-no-wrap w-fit xl:flex-wrap">
                            {friendsList.slice(0, 3).map((friend) => (
                              <div key={friend.id} className="w-full xl:w-1/2 p-3">
                                <div className="avatar md:px-5 lg:px-10 xl:px-0">
                                  <div className="w-full rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={friend.avatar} alt={friend.name} />
                                  </div>
                                </div>
                                <h2 className="text-center text-sm">{friend.name}</h2>
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
{/*             <div className=" flex-2 pr-6 w-1/4 hidden xl:block box-border text-center">
              <div className="card bg-white">
                <div className="text-3xl card-title justify-center text-gray-900 border-b-2 border-gray-100">
                  My Goals
                </div>
                <div className="stats stats-vertical shadow text-center">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block w-8 h-8 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </div>
                    <div className="stat-title">Total Likes</div>
                    <div className="stat-value text-primary">25.6K</div>
                    <div className="stat-desc">21% more than last month</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block w-8 h-8 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                    </div>
                    <div className="stat-title">Page Views</div>
                    <div className="stat-value text-secondary">2.6M</div>
                    <div className="stat-desc">21% more than last month</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="lightgreen"
                        className="w-8 h-8"
                      >
                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                      </svg>
                    </div>
                    <div className="stat-value">100%</div>
                    <div className="stat-title">Weekly Goals Achieved</div>
                  </div>
                    {/* <!-- Analytics Card --> */}
                    <div className="card shadow-md bg-white">
                      <div className="card-body">
                        <a href="#" className="btn btn-primary">
                          Create/Edit Goals
                        </a>
                      </div>
                    </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
