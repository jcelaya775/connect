import Header from "./header";
import Image from "next/image";
import Link from "next/link";
import style from "@/styles/FormBox.module.css";
import logo from "@/images/link_icon_content.svg";

const LandingPage = () => {
	return (
		<div>
			<Header />
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
		</div>
	);
};

export default LandingPage;
