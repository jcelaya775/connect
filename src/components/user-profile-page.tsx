import { useState } from "react";
import SideNav from "./SideNav";
import EditProfileModal from "./edit-profile-modal";
import Post from "./post";
import { platformTypes } from "@/types/platform";
import cityImage from "../images/cityscape.jpg";
import Image from "next/image";
import FriendsModal from "./friends-list-modal";

export const UserProfilePage = () => {
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
        <div className="flex-1 bg-base-200 min-h-screen pr-8 pt-6 pl-8 sm:pl-24 w-full lg:pl-48 xl:pr-0">
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
                        {/* <!-- End Edit Profile Picture Button --> */}
                      </figure>
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
                  <div className="w-full">
                  <div className="my-4">
                        <label
                          htmlFor="my-modal"
                          className="btn btn-primary btn-sm"
                          onClick={() => setFriendsModalVisible(prev => !prev)}
                        >
                          View Friends
                        </label>
                        {friendModalVisible && (
                          <FriendsModal setVisible={setFriendsModalVisible} />
                        )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4">
                    <div className="card w-full md:w-3/4 bg-base-100 rounded">
                      <div className="card-title p-4">
                        Posts
                      </div>
                      <div className="card-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In iaculis nunc sed augue lacus viverra vitae. Auctor urna nunc id cursus. Diam quam nulla porttitor massa. Ullamcorper malesuada proin libero nunc consequat interdum varius. Sagittis nisl rhoncus mattis rhoncus urna neque viverra. Viverra orci sagittis eu volutpat odio facilisis. Proin libero nunc consequat interdum varius. Feugiat nisl pretium fusce id velit ut tortor. Et ligula ullamcorper malesuada proin libero nunc consequat interdum varius. Convallis convallis tellus id interdum velit. Et ultrices neque ornare aenean euismod elementum nisi quis eleifend. Gravida arcu ac tortor dignissim convallis aenean et tortor at. Sit amet dictum sit amet justo donec enim diam vulputate. Ac tortor dignissim convallis aenean et tortor at risus viverra. In pellentesque massa placerat duis ultricies lacus sed. Amet justo donec enim diam vulputate ut. Nibh sit amet commodo nulla facilisi nullam. Ut venenatis tellus in metus vulputate eu scelerisque felis imperdiet. Scelerisque eleifend donec pretium vulputate sapien nec sagittis.

Integer malesuada nunc vel risus commodo viverra maecenas accumsan lacus. Senectus et netus et malesuada fames ac turpis. Suscipit tellus mauris a diam maecenas sed. Tincidunt eget nullam non nisi est sit amet facilisis magna. Mi quis hendrerit dolor magna. Urna nec tincidunt praesent semper feugiat. Malesuada fames ac turpis egestas maecenas. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Sit amet volutpat consequat mauris nunc congue nisi. Egestas maecenas pharetra convallis posuere. Habitant morbi tristique senectus et netus et malesuada. Cras tincidunt lobortis feugiat vivamus at augue. Ultrices vitae auctor eu augue. Tristique senectus et netus et malesuada fames ac turpis egestas. Consequat mauris nunc congue nisi vitae suscipit tellus mauris a. Tincidunt augue interdum velit euismod in pellentesque massa. Tincidunt nunc pulvinar sapien et ligula ullamcorper. Eget nunc scelerisque viverra mauris in aliquam sem fringilla ut. Id aliquet risus feugiat in ante metus dictum at. Morbi quis commodo odio aenean.

Accumsan sit amet nulla facilisi morbi tempus iaculis urna. Purus sit amet volutpat consequat mauris. Tellus mauris a diam maecenas sed. Platea dictumst quisque sagittis purus sit amet volutpat. Senectus et netus et malesuada fames ac. Aenean pharetra magna ac placerat. Volutpat est velit egestas dui id ornare arcu. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Hac habitasse platea dictumst vestibulum. Mattis enim ut tellus elementum sagittis vitae et leo duis. In ante metus dictum at tempor commodo ullamcorper. Enim ut sem viverra aliquet eget sit. Elementum nisi quis eleifend quam adipiscing vitae proin sagittis.

Massa sed elementum tempus egestas. Commodo ullamcorper a lacus vestibulum. Aenean vel elit scelerisque mauris pellentesque. Aliquam ut porttitor leo a diam sollicitudin. Volutpat sed cras ornare arcu dui vivamus arcu felis bibendum. Tristique senectus et netus et malesuada fames ac. Id velit ut tortor pretium viverra suspendisse. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Morbi tincidunt ornare massa eget egestas purus viverra. Sodales ut eu sem integer. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Gravida arcu ac tortor dignissim convallis aenean et. Tempus egestas sed sed risus pretium quam vulputate dignissim. Morbi tristique senectus et netus et malesuada fames ac turpis. Adipiscing tristique risus nec feugiat in fermentum posuere. Viverra maecenas accumsan lacus vel facilisis volutpat.

Eu scelerisque felis imperdiet proin fermentum leo. Tortor consequat id porta nibh venenatis cras sed. Massa sed elementum tempus egestas sed. Nullam non nisi est sit amet facilisis magna. Nulla facilisi etiam dignissim diam quis. Dis parturient montes nascetur ridiculus mus mauris vitae. Enim praesent elementum facilisis leo. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt. Integer eget aliquet nibh praesent. Viverra aliquet eget sit amet tellus cras. Aliquet nec ullamcorper sit amet risus nullam eget felis. Sem viverra aliquet eget sit amet tellus. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Sagittis purus sit amet volutpat consequat mauris nunc congue nisi. Tempus urna et pharetra pharetra massa massa. Ipsum consequat nisl vel pretium lectus quam id leo in.
                      </div>
                    </div>
                    <div className="card w-full md:w-1/4 bg-base-100 rounded h-min">
                      <div className="card-title p-4">
                        Friends
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
