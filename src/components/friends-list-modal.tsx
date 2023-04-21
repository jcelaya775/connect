import { useState, useEffect } from "react";

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

type FriendsModalProps = {
  setVisible: (visible: boolean) => void;
};

const FriendsModal = ({ setVisible }: FriendsModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if ((e.target as Element)?.classList.contains("modal")) {
        setVisible(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box rounded-lg">
          <div className="card">
            <div className="card-body">
              <div className="card-title text-2xl text-gray-900 font-bold">
                Friends List
              </div>
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full border rounded-md p-2 mb-4"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="overflow-auto h-40 bg-gray-200 pl-5">
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
                          <button className="btn btn-sm">View Profile</button>
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
                          <button className="btn btn-sm">View Profile</button>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendsModal;
