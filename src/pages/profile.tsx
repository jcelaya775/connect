import React from "react";
import UserProfilePage from "@/components/user-profile-page";
import { GetServerSidePropsContext } from "next/types";
import { IUser } from "@/models/User";
import { getAuthUserFromPage } from "@/lib/auth";

export default function Profile() {
  return (
    <>
      <UserProfilePage />
    </>
  );
}

Profile.Layout = "LoggedIn";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user: IUser | null = await getAuthUserFromPage(context);
  if (!user || !user.is_verified)
    return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
}
