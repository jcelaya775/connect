import React from "react";
import UserProfilePage from "@/components/user-profile-page";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";

export default function Profile() {
  const [FriendsModalVisible, setFriendsModalVisible] = React.useState(false);

  return (
    <>
      <UserProfilePage />
    </>
  );
}

Profile.Layout = "LoggedIn";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
