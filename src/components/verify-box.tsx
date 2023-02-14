import loginstyle from "@/styles/FormBox.module.css";
import Image from "next/image";
import logo from "@/images/link_icon_content.svg";
import { useState } from "react";
import { useRouter } from "next/router";

const VerifyBox = () => {
	const router = useRouter();
	const [email, setEmail] = useState<string>("");
	const [verificationCode, setVerificationCode] = useState<string>("");

	const verify = async () => {
		const options = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				code: verificationCode,
			}),
		};

		const res = await fetch("api/users/verify", options);
		const data = await res.json();

		if (data.success) router.push("/index_test");
	};

	return (
		<div className={loginstyle.container}>
			<form action="#" method="post">
				<h1>
					Connect
					<Image className={loginstyle.icon} src={logo} alt=""></Image>
				</h1>
				<h3 className={loginstyle.tagline}>The Social Media Hub</h3>
				<p className={loginstyle.message}>
					To complete registration enter your email address and verification
					code.
				</p>
				<input
					className={loginstyle.forminput}
					type="text"
					placeholder="Email Address"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<br />
				<input
					className={loginstyle.forminput}
					type="text"
					placeholder="Verification Code"
					onChange={(e) => setVerificationCode(e.target.value)}
				/>
				<br />
				<button className={loginstyle.button}>Verify Account</button>
			</form>
		</div>
	);
};

export default VerifyBox;
