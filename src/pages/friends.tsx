import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";
import FriendsList from "@/components/friends-list";
import SideNav from "@/components/SideNav";
import BtmNav from "@/components/bottom-nav";
import { IUser } from "@/models/User";
import { getAuthUserFromPage } from "@/lib/auth";

export default function Friends() {
  return (
    <>
      <div className="min-h-screen min-w-full bg-base-200 pt-16 pb-20">
        <span className="hidden sm:block horz:hidden">
          <SideNav />
        </span>
        <span className="sm:hidden horz:block">
          <BtmNav />
        </span>
        <FriendsList />
      </div>
    </>
  );
}

Friends.Layout = "LoggedIn";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user: IUser | null = await getAuthUserFromPage(context);
  if (!user || !user.is_verified)
    return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
}
