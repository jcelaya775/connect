import loginstyle from "@/styles/FormBox.module.css";
import Image from "next/image";
import logo from "@/images/link_icon_content.svg";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

const LoginBox = () => {
	const router = useRouter();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const login = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (!email || !password) {
			window.alert("Please fill out all fields");
			return;
		}

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		};

		const res = await fetch("api/users/login", options);
		const data = await res.json();

		console.log(data);

		if (data.success) router.push("/index_test");
		else {
			switch (data.error) {
				case "User is not yet verified":
					window.alert("User is not verified");
					break;
				case "User not found":
				case "Incorrect password":
					window.alert("Username or email is incorrect");
					break;
				default:
					window.alert("Something went wrong");
			}
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
					type="email"
					placeholder="Email Address"
					pattern="^[\w-.]+@([\w-]+.)+[\w-]{2,4}$"
					required
					onChange={(e) => setEmail(e.target.value)}
				/>
				<br />
				<input
					className={loginstyle.forminput}
					type="password"
					placeholder="Password"
					pattern="^(?=.[0-9])(?=.[a-z])(?=.[A-Z])(?=.[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{8,32}$"
					required
					onChange={(e) => setPassword(e.target.value)}
				/>
				<p className={loginstyle.message}>
					<a href="#" className={loginstyle.link}>
						Forgot Password
					</a>
				</p>
				<button className={loginstyle.button} onClick={login}>
					Login
				</button>
				<Link href="/signup">
					<button className={loginstyle.button}>Sign Up</button>
				</Link>
			</form>
		</div>
	);
};

export default LoginBox;
