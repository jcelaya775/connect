import { useEffect, useState } from "react";
import SideNav from "@/components/SideNav";
import EditProfileModal from "@/components/edit-profile-modal";
import Link from "next/link";
import Post from "@/components/post";
import { platformTypes } from "@/types/platform";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useUser from "@/hooks/useUser";
import { GenericPost, IFacebookPost } from "@/types/post";
import { IConnectPost } from "@/models/Post";
import useFriends from "@/hooks/useFriends";
import { PostProps } from "@/components/post";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { IUser } from "@/models/User";
import { getAuthUserFromPage } from "@/lib/auth";

export const ProfilePage = () => {
  const router = useRouter();
  const { uid }: { uid?: string } = router.query;
  const { user, userLoading } = useUser(uid);
  const { friends, friendsLoading, friendsError } = useFriends(uid);
  const [friendModalVisible, setFriendsModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: [`${uid}`, "posts"],
    queryFn: async () => {
      const {
        data: { posts },
      } = await axios.get(`/api/users/${uid}/feed`);

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
                    <div className="card glass lg:card-side text-neutral-content relative">
                      {/* <button className="btn btn-sm absolute top-0 right-0 lg:mt-4 lg:mr-4 sm: mt-72 sm:mr-4 xs: mt-72 xs: mr-4">Add Friend</button> */}
                      <figure className="p-6 relative">
                        <img
                          src="https://picsum.photos/200"
                          alt="Profile Picture"
                          className="rounded-full ml-0 mx-auto border-white border-2"
                        ></img>
                        {/* <!-- Edit Profile Picture Button --> */}
                        <label
                          htmlFor="edit-profile-modal"
                          className="btn-outline btn-square bg-white cursor-pointer absolute bottom-4 right-52 mb-4 mr-4 rounded-full w-8 h-8 flex items-center justify-center lg:absolute lg:bottom-4 lg:right-4"
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
                        {/* <!-- End Edit Profile Picture Button --> */}
                      </figure>
                      <div className="max-w-md card-body">
                        <h2 className="card-title text-3xl font-bold text-gray-900">
                          {user?.name}
                        </h2>
                        <p className="text-gray-700">Connect User Since 2023</p>
                        <p className="text-white-400">
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. At inventore, voluptatem quasi praesentium amet
                          ea! Sit nihil, minus doloremque repudiandae animi
                          delectus repellat mollitia minima enim veritatis
                          placeat consectetur.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4 mt-4 mr-0">
                    <div className="flex flex-col gap-y-4 w-full md:w-3/4">
                      <div className="card w-full bg-base-100 rounded">
                        <div className="card-title p-4">Posts</div>
                      </div>
                      <div className="card w-full bg-base-100 rounded">
                        {isLoading ? (
                          <p>Loading...</p>
                        ) : (
                          (!data || data?.length === 0) && (
                            <p>No posts found.</p>
                          )
                        )}
                        <div className="flex flex-col w-full gap-5">
                          {data &&
                            data.map((post: GenericPost, idx: number) => {
                              const props: Partial<
                                PostProps & { key: string }
                              > = {
                                author: post.author,
                                mainPlatform: post.main_platform,
                              };

                              switch (post.main_platform) {
                                case platformTypes.connect:
                                  props.key = (post as IConnectPost)._id;
                                  props.postId = (post as IConnectPost)._id;
                                  props.platforms = (
                                    post as IConnectPost
                                  ).platforms;
                                  props.platforms.forEach(
                                    (platform: string) => {
                                      switch (platform) {
                                        case platformTypes.facebook:
                                          if (!user?.facebook?.page_token) {
                                            props.platforms =
                                              props.platforms?.filter(
                                                (p) =>
                                                  p !== platformTypes.facebook
                                              );
                                            break;
                                          }

                                          props.facebookId = (
                                            post as IConnectPost
                                          ).facebook_id!;
                                          break;
                                        case platformTypes.instagram:
                                          props.instagramId = (
                                            post as IConnectPost
                                          ).instagram_id!;
                                          break;
                                      }
                                    }
                                  );
                                  props.content = (
                                    post as IConnectPost
                                  ).content;
                                  break;
                                case platformTypes.facebook:
                                  props.key = (post as IFacebookPost).id;
                                  props.facebookId = (post as IFacebookPost).id;
                                  props.platforms = [platformTypes.facebook];
                                  props.content = {
                                    body: (post as IFacebookPost).message,
                                    image: {
                                      signedUrl: (post as IFacebookPost)
                                        .full_picture,
                                    },
                                  };
                                  break;
                              }

                              return (
                                <Post
                                  key={props.key}
                                  {...(props as PostProps)}
                                />
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-4 w-full md:w-1/4">
                      <div className="card w-full bg-base-100 rounded h-min">
                        <div className="card-title p-4">Friends</div>
                      </div>

                      <div className="card bg-base-100 rounded">
                        <div className="card-body">
                          <div className="flex flex-row gap-x-2 lg:gap-x-16 mx-auto">
                            <div className="flex flex-row gap-x-2 lg:flex-col lg:gap-y-4 w-1/2">
                              <div className="avatar">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                  <img src="https://randomuser.me/api/portraits/men/1.jpg" />
                                </div>
                              </div>
                              <h2 className="text-center">John Doe</h2>
                              <div className="avatar">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                  <img src="https://randomuser.me/api/portraits/women/1.jpg" />
                                </div>
                              </div>
                              <h2 className="text-center">Jane Doe</h2>
                            </div>
                            <div className="flex flex-row gap-x-2 lg:flex-col lg:gap-y-4 w-1/2 ">
                              <div className="avatar">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                  <img src="https://randomuser.me/api/portraits/men/2.jpg" />
                                </div>
                              </div>
                              <h2 className="text-center">Bob Smith</h2>
                              <div className="avatar">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                  <img src="https://randomuser.me/api/portraits/women/2.jpg" />
                                </div>
                              </div>
                              <h2 className="text-center">Alice Smith</h2>
                            </div>
                          </div>
                        </div>
                        <Link
                          href="/friends"
                          className="btn btn-primary btn-sm mx-4 my-4"
                        >
                          View Friends
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
    </>
  );
};

ProfilePage.Layout = "LoggedIn";

export default ProfilePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user: IUser | null = await getAuthUserFromPage(context);
  if (!user || !user.is_verified)
    return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
}
