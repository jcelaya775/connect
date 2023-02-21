import Image from "next/image";
import Header from "@/components/Header";
import style from "@/styles/FormBox.module.css";
import logo from "@/images/link_icon_content.svg";
import Link from "next/link";
import { useEffect } from "react";
import Feed from "@/components/Feed";
import { getServerSession } from "next-auth/next";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

export default function Home() {
	const { data: session, status } = useSession();

	useEffect(() => {
		console.log(status);
		console.log(session);
	}, [status]);

	if (!session) {
		return (
			<>
				<Header />
				<div className={style.container}>
					<div>
						<h1>
							Connect
							<Image
								className={style.icon}
								src={logo}
								alt="Connect Logo"
							></Image>
						</h1>

						<h3 className={style.tagline}>The Social Media Hub</h3>

						<Link href="/login">
							<button className={style.button}>Login</button>
						</Link>

						<Link href="/signup">
							<button className={style.button}>Sign Up</button>
						</Link>
					</div>
				</div>
			</>
		);
	}

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
