import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { IUser } from "@/models/User";
import Router from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import useSearch from "@/hooks/useSearch";

type Friend = IUser["_id"] &
  IUser["name"] &
  IUser["email"] &
  IUser["username"] &
  IUser["profile_picture"];

const LoggedInNav = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchBarItemsVisible, setSearchBarItemsVisible] =
    useState<boolean>(false);
  const { searchResults, searchResultsLoading, searchMutation } = useSearch();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as Element)?.classList.contains("navbar")) {
        setSearchBarItemsVisible(false);
        setSearchTerm("");
        queryClient.invalidateQueries(["search", "users"]);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchBarItemsVisible(false);
        setSearchTerm("");
        queryClient.invalidateQueries(["search", "users"]);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme)
      document.querySelector("html")?.setAttribute("data-theme", savedTheme);
    else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        document.querySelector("html")?.setAttribute("data-theme", "dark");
      else
        document.querySelector("html")?.setAttribute("data-theme", "corporate");
    }
  }, []);

  return (
    <>
      <div className="navbar bg-base-100 drop-shadow-md fixed z-10 sm:px-4 md:px-8">
        <div className="flex-1">
          <Link
            href="/"
            className="font-semibold normal-case text-2xl cursor-pointer"
          >
            Connect
            <svg
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current w-[25px] h-[25px] inline pl-1"
            >
              <path d="M9.26 13a2 2 0 0 1 .01-2.01A3 3 0 0 0 9 5H5a3 3 0 0 0 0 6h.08a6.06 6.06 0 0 0 0 2H5A5 5 0 0 1 5 3h4a5 5 0 0 1 .26 10zm1.48-6a2 2 0 0 1-.01 2.01A3 3 0 0 0 11 15h4a3 3 0 0 0 0-6h-.08a6.06 6.06 0 0 0 0-2H15a5 5 0 0 1 0 10h-4a5 5 0 0 1-.26-10z"></path>
            </svg>
          </Link>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchBarItemsVisible(true);
                  setSearchTerm(e.target.value);
                  searchMutation.mutate(e.target.value);
                }}
                className="input input-bordered w-44 sm:w-72 rounded-b-none input-sm z-10"
              />
              {searchBarItemsVisible && (
                <div className="absolute top-full z-0 left-0 mt-0 py-2 max-h-80 bg-base-200 rounded-b-lg w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                  <ul className="grid grid-cols-1 gap-y-1 p-2">
                    {searchResults &&
                      searchResults.map((user: Friend) => (
                        <li
                          key={user._id}
                          className="btn btn-accent border-0 px-1 justify-start items-center bg-base-100 shadow-md h-max rounded-md overflow-hidden"
                          onClick={() => Router.push(`/users/${user._id}`)}
                        >
                          <div className="flex items-center">
                            {user.profile_picture ? (
                              <Image
                                src={user.profile_picture}
                                alt={user.name}
                                className="w-4 h-4 rounded-full mr-4"
                              />
                            ) : (
                              <div className="w-6 rounded-full mx-2">
                                <svg
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="fill-current"
                                >
                                  <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z" />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-normal text-xs">
                                {user.name}
                              </h3>
                            </div>
                            {/* <button className="btn btn-primary btn-xs normal-case flex justify-end">
                            <Link href={`users/${user._id}`}>
                              View Profile
                            </Link>
                          </button> */}
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="avatar cursor-pointer pt-1">
              <div className="w-9 rounded-full">
                <svg
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current"
                >
                  <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z" />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="mt-10 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-10 sm:hidden horz:block"
              >
                <li>
                  <Link href="/settings">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                      />
                    </svg>
                    Settings
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => signOut()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                    Logout
                  </Link>
                </li>
              </ul>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoggedInNav;
