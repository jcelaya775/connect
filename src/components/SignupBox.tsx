import loginstyle from "@/styles/FormBox.module.css";
import Image from "next/image";
import logo from "@/images/link_icon_content.svg";
import Link from "next/link";
import { useEffect, useState } from "react";

const SignUpBox = () => {
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);

	useEffect(() => {
		comparePasswords();
	}, [password, confirmPassword]);

	const comparePasswords = () => {
		if (password === confirmPassword) {
			setPasswordsMatch(true);
		} else {
			setPasswordsMatch(false);
		}
	};

	return (
		<div className={loginstyle.container}>
			<form action="#" method="post">
				<h1>
					Connect
					<Image className={loginstyle.icon} src={logo} alt=""></Image>
				</h1>
				<h3 className={loginstyle.tagline}>The Social Media Hub</h3>
				<input
					className={loginstyle.forminput}
					type="text"
					placeholder="First Name"
					pattern="^[a-z '-]{1,30}+$/i"
					required
				/>
				<br />
				<input
					className={loginstyle.forminput}
					type="text"
					placeholder="Last Name"
					pattern="^[a-z '-]{1,30}+$/i"
					required
				/>
				<br />
				<input
					className={loginstyle.forminput}
					type="email"
					placeholder="Email Address"
					pattern="^[\w-.]+@([\w-]+.)+[\w-]{2,4}$"
					required
				/>
				<br />
				<input
					className={loginstyle.forminput}
					type="password"
					placeholder="Password"
					pattern="^(?=.[0-9])(?=.[a-z])(?=.[A-Z])(?=.[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{8,32}$"
					required
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<br />
				<input
					className={loginstyle.forminput}
					type="password"
					placeholder="Confirm Password"
					required
					onChange={(e) => {
						setConfirmPassword(e.target.value);
					}}
				/>
				<p className={loginstyle.message}>
					Already have an account?&nbsp;
					<strong>
						<Link href="/login">Login</Link>
					</strong>
				</p>
				<Link href="#">
					<button
						className={loginstyle.button}
						onClick={() => {
							if (passwordsMatch) console.log("Passwords Match");
							else console.log("Passwords Do Not Match");
						}}
					>
						Sign Up
					</button>
				</Link>
			</form>
		</div>
	);
};

export default SignUpBox;