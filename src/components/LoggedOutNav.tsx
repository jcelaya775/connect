import React from "react";

const LoggedOutNav = () => (
  <>
    <div className="navbar bg-base-100 drop-shadow-md fixed z-10">
      <div className="flex-1">
        <a href="/" className="normal-case text-2xl cursor-pointer">
          Connect
          <svg
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current w-[25px] h-[25px] inline pl-1"
          >
            <path d="M9.26 13a2 2 0 0 1 .01-2.01A3 3 0 0 0 9 5H5a3 3 0 0 0 0 6h.08a6.06 6.06 0 0 0 0 2H5A5 5 0 0 1 5 3h4a5 5 0 0 1 .26 10zm1.48-6a2 2 0 0 1-.01 2.01A3 3 0 0 0 11 15h4a3 3 0 0 0 0-6h-.08a6.06 6.06 0 0 0 0-2H15a5 5 0 0 1 0 10h-4a5 5 0 0 1-.26-10z"></path>
          </svg>
        </a>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-hover dropdown-end">
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
              className="mt-10 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-10"
            >
              <li>
                <a>
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 fill-current"
                  >
                    <g>
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z" />
                    </g>
                  </svg>
                  Login
                </a>
              </li>
              <li>
                <a>
                  <svg
                    className="h-5 w-5 stroke-current"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect height="4" rx="1" ry="1" width="8" x="8" y="2" />
                  </svg>
                  Sign up
                </a>
              </li>
            </ul>
          </label>
        </div>
      </div>
    </div>
  </>
);

export default LoggedOutNav;
