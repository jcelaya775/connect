import * as React from "react";
import { useState } from "react";

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
  ];

  
const FriendsList = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: any) => {
      setSearchTerm(e.target.value);
    };
  
    const filteredFriends = friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
    <>
      <div className="card pt-12">
          <div className="card-body">
          <div className="card-title text-2xl text-gray-900 font-bold mx-auto">My Friends</div>
          <input
              type="text"
              placeholder="Search friends..."
              className="w-1/2 border rounded-md p-2 mb-4 mx-auto"
              value={searchTerm}
              onChange={handleSearch}
          />
          <div className="overflow-y-scroll h-60 bg-gray-200 pl-5 w-1/2 pr-5 mx-auto">
          {searchTerm.length > 0
          ? filteredFriends.map((friend) => (
              <div key={friend.id} className="flex items-center my-2">
                  <img
                  src={friend.avatar}
                  alt={`${friend.name} avatar`}
                  className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                  <p className="font-medium">{friend.name}</p>
                  </div>
                  <div className="ml-auto">
                  <button className="btn btn-sm">
                      View Profile
                  </button>
                  </div>
              </div>
              ))
          : friends.map((friend) => (
              <div key={friend.id} className="flex items-center my-2">
                  <img
                  src={friend.avatar}
                  alt={`${friend.name} avatar`}
                  className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                  <p className="font-medium">{friend.name}</p>
                  </div>
                  <div className="ml-auto">
                  <button className="btn btn-sm">
                      View Profile
                  </button>
                  </div>
              </div>
              ))}
          </div>
          </div>
      </div>
    </>
    );
}

export default FriendsList;