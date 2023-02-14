import Image from "next/image";
import Header from "@/components/header";
import style from "@/styles/FormBox.module.css";
import logo from "@/images/link_icon_content.svg";
import Link from "next/link";
import { useState } from "react";
import Feed from "@/components/feed";

export default function Home() {
	const [home, setHome] = useState(false);

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
