import Image from "next/image";
import Header from "@/components/header";
import style from "@/styles/FormBox.module.css";
import logo from "@/images/link_icon_content.svg";
import Link from "next/link";
import { useState, useEffect } from "react";
import Feed from "@/components/Feed";
import { NextPageContext } from "next";
import axios, { AxiosResponse } from "axios";
import { IUser } from "@/models/User";

export const getServerSideProps = async (context: NextPageContext) => {
	const { req } = context;
	const token: string | undefined = req?.headers.cookie
		?.split("=")[1]
		?.split("%20")[1];

	if (!token) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	const data = await axios.post("http://localhost:3000/api/auth", {
		token,
	});

	const user = data?.data?.user;

	if (!user) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	return {
		props: { user },
	};
};

export default function Home({ user }: { user: IUser }) {
	const [home, setHome] = useState(false);
	// TODO: Check if the user is logged via an API and redirect to the feed if they are

	useEffect(() => {
		console.log(user);
	}, []);

	return (
		<>
			<Header />
			{home ? <Buttons /> : <Feed />}
		</>
	);
}

function Buttons() {
	return (
		<>
			<div className={style.container}>
				<div>
					<h1>
						Connect
						<Image className={style.icon} src={logo} alt="Connect Logo"></Image>
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
