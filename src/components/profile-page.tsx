import React from "react";
import SideNav from "./SideNav";

export const ProfilePage = () => {
  return (
    <>
      <div className="min-h-screen min-w-full bg-base-200 pt-16 pb-8">
        <span className="hidden sm:block">
          <SideNav />
        </span>
        {/* Main Content Area */}
        <div className="flex-1 bg-base-200 min-h-screen pr-8 pt-6 pl-8 sm:pl-24 w-full lg:pl-48 xl:pr-0">
          {/* Page content to be built here */}
        </div>
      </div>
    </>
  )
};

export default ProfilePage;