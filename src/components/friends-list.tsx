import { useState } from "react";
import Link from 'next/link'

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
    avatar: "https://randomuser.me/api/portraits/men/8.jpg"
  }
];

const FriendsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingFriends, setPendingFriends] = useState(friends.slice(0, 0));
  const [allFriends, setAllFriends] = useState(friends);

  const handleAddFriend = (friend:any) => {
    const newPendingFriends = [...pendingFriends, friend];
    const newAllFriends = allFriends.filter((f) => f.id !== friend.id);
    setPendingFriends(newPendingFriends);
    setAllFriends(newAllFriends);
  };

  const handleRemoveFriend = (friend:any) => {
    const newPendingFriends = pendingFriends.filter((f) => f.id !== friend.id);
    setPendingFriends(newPendingFriends);
  };

  const handleSearch = (event:any) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filteredFriends = friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setAllFriends(filteredFriends);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="p-4">
        <input
          placeholder="Search friends"
          className="w-full rounded-md h-10 pl-5"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-medium mb-4">Pending friends</h2>
        {pendingFriends.length > 0 ? (
          <div className="card bg-white p-4 max-h-72 overflow-y-scroll">
            <ul className="grid grid-cols-2 gap-4">
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
                    <button
                      className="btn btn-accent"
                      onClick={() => handleRemoveFriend(friend)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center">Nothing to see here.</p>
        )}
      </div>
      <div className="divider"></div>
      <div className="p-4">
        <h2 className="text-xl font-medium mb-4">All friends</h2>
        <div className="card bg-white p-4 max-h-96 overflow-y-scroll">
        <ul className="grid grid-cols-2 gap-4">
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
            <button
              className="btn btn-primary">
              <Link href={`/${friend.name.replace(" ","")}`}>View Profile</Link>
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