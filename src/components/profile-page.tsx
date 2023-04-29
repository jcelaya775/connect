import { useState } from "react";
import SideNav from "./SideNav";
import ConnectPost from "./ConnectPost";
import SocialPost from "./post";
import FriendsModal from "./friends-list";

export const ProfilePage = () => {
  const router = useRouter();
  const { uid }: { uid?: string } = router.query;
  const { user } = useUser(uid);
  const [friendsModalVisible, setFriendsModalVisible] =
    useState<boolean>(false);

  const { data: relationship, isLoading: relationshipLoading } = useQuery({
    queryKey: ["friendButton", uid],
    queryFn: async () => {
      const {
        data: { relationship },
      } = await axios.get(`/api/users/${uid}/friends`);
      console.log(relationship);

      return relationship;
    },
  });

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
                      <button className="btn btn-sm absolute top-0 right-0 lg:mt-4 lg:mr-4 sm: mt-72 sm:mr-4 xs: mt-72 xs: mr-4">
                        {relationshipLoading
                          ? "Loading..."
                          : relationship === relationshipTypes.friends
                          ? "Remove Friend"
                          : relationship === relationshipTypes.pendingFriend
                          ? "Pending Friend"
                          : relationship === relationshipTypes.friendRequest
                          ? "Accept Request"
                          : "Add Friend"}
                      </button>
                      <figure className="p-6 relative">
                        <Image
                          src="https://picsum.photos/200"
                          width={200}
                          height={200}
                          alt="Profile Picture"
                          unoptimized
                          className="rounded-full ml-0 mx-auto border-white border-2"
                        ></Image>
                      </figure>
                      <div className="max-w-md card-body">
                        <h2 className="card-title text-3xl font-bold text-gray-900">
                          {user?.name}
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
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="col-span-2">
                      <h2 className="text-xl font-bold text-base-content ml-1 mb-0">
                        Posts
                      </h2>
                      <Posts uid={uid} />
                    </div>
                    {/* <!-- Friends Card --> */}
                    <div className="card shadow-md bg-white col-span-1 h-min">
                      <div className="card-body">
                        <h2 className="text-lg font-bold text-gray-700 mb-4">
                          Friends
                        </h2>
                        <label
                          htmlFor="my-modal"
                          className="btn"
                          onClick={() =>
                            setFriendsModalVisible((prev) => !prev)
                          }
                        >
                          View Friends
                        </label>
                        {friendsModalVisible && (
                          <FriendsModal setVisible={setFriendsModalVisible} />
                        )}
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
