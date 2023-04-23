import { useState } from "react";
import Link from "next/link";

const pendFriends = [
  {
    id: 11,
    name: "Babe Ruth",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    id: 12,
    name: "Serena Williams",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 13,
    name: "Hillary Clinton",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 14,
    name: "Donald Trump",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];
const friends = [
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
  {
    id: 5,
    name: "David Johnson",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 6,
    name: "Jorge Celaya",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 7,
    name: "Joshua Czajka",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 8,
    name: "Zach Belles",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 9,
    name: "Joe Fleming",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: 10,
    name: "Braedon Fyock",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },
];

const FriendsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingFriends, setPendingFriends] = useState(pendFriends.slice(0, 4));
  const [allFriends, setAllFriends] = useState(friends);

  const handleAddFriend = (friend: any) => {
    const newPendingFriends = pendingFriends.filter((f) => f.id !== friend.id);
    const newAllFriends = [...allFriends, friend];
    setPendingFriends(newPendingFriends);
    setAllFriends(newAllFriends);
  };

  const handleRemoveFriend = (friend: any) => {
    const newPendingFriends = pendingFriends.filter((f) => f.id !== friend.id);
    setPendingFriends(newPendingFriends);
  };

  const handleSearch = (event: any) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filteredFriends = friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setAllFriends(filteredFriends);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="px-8 sm:px-24 lg:px-10 mt-4">
        <input
          placeholder="Search friends"
          className="w-full rounded-md h-10 pl-5"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {pendingFriends.length > 0 ? (
        <div className="p-8 sm:px-24 lg:px-10 mt-0">
          <h2 className="text-xl font-medium mb-4">Pending friends</h2>

          <div className="card bg-white p-4 h-max overflow-y-scroll">
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingFriends.map((friend) => (
                <li
                  key={friend.id}
                  className="bg-white shadow-md rounded-md overflow-hidden"
                >
                  <div className="flex items-center p-4">
                    <img
                      src={friend.avatar}
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
                        onClick={() => handleAddFriend(friend)}
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
                        onClick={() => handleRemoveFriend(friend)}
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
      ) : (
        <></>
      )}
      <div className="px-8 sm:px-24 lg:px-10 mt-0 divider"></div>
      <div className="px-8 sm:px-24 lg:px-10 mt-0">
        <h2 className="text-xl font-medium mb-4">All friends</h2>
        <div className="card bg-white p-4 h-max">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allFriends.map((friend) => (
              <li
                key={friend.id}
                className="bg-white shadow-md rounded-md overflow-hidden"
              >
                <div className="flex items-center p-4">
                  <img
                    src={friend.avatar}
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
