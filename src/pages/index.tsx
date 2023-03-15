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

export default function Home() {
	const { data: session } = useSession();

	if (!session) {
		return (
			<div>
				<Header />
				<LandingPage />
			</div>
		);
	}

	useEffect(() => {
		// User is authenticated at this point
		console.log(status);
		console.log(session);
	}, [status]);

	return (
		<div>
			<Header />
			<Feed />
		</div>
	);
}

// TODO: Fix decryption error in getServerSession
export async function getServerSideProps(context: GetServerSidePropsContext) {
	return {
		props: {
			session: await getServerSession(context.req, context.res, authOptions),
		},
	};
}
