import { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import SignUpBox from "@/components/signup-box";
import Feed from "@/components/feed";
import { getAuthUserFromPage } from "@/lib/auth";
import { IUser } from "@/models/User";
import Layout_Logout from "@/components/Layout_Out";
import Layout_Login from "@/components/Layout_In";
import connectDB from "@/lib/mongodb";

type HomeProps = { authenticated: boolean };

export default function Home({ authenticated }: HomeProps) {
  if (!authenticated) {
    return (
      <Layout_Logout>
        <SignUpBox />
      </Layout_Logout>
    );
  }

  return (
    <Layout_Login>
      <Feed />
    </Layout_Login>
  );
}

Home.Layout = "LoggedIn";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await connectDB();
  const user: IUser | null = await getAuthUserFromPage(context);
  if (!user || !user.is_verified) return { props: { authenticated: false } };

  return {
    props: {
      authenticated: true,
    },
  };
}
