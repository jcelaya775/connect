import Image from "next/image";
import Header from "@/components/Header";
import style from "@/styles/FormBox.module.css";
import logo from "@/images/link_icon_content.svg";
import Link from "next/link";
import { useEffect } from "react";
import Feed from "@/components/Feed";
import { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";

type HomeProps = { authenticated: boolean };

export default function Home({ authenticated }: HomeProps) {
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

  if (!authenticated) {
    return (
      <Layout_Logout>
        <SignUpBox />
      </Layout_Logout>
    );
  }

	useEffect(() => {
		// User is authenticated at this point
		console.log(status);
		console.log(session);
	}, [status]);

	return (
		<>
			<Feed />
		</>
	);
}

// TODO: Fix decryption error in getServerSession
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
