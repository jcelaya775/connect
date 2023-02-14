import loginstyle from "@/styles/FormBox.module.css";
import Image from "next/image";
import logo from "@/images/link_icon_content.svg";
import Link from 'next/link'

const LoginBox = () => (
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
			/>
			<br />
			<input
				className={loginstyle.forminput}
				type="password"
				placeholder="Password"
				pattern="^(?=.[0-9])(?=.[a-z])(?=.[A-Z])(?=.[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{8,32}$"
				required
			/>
			<p className={loginstyle.message}>
				<a href="#" className={loginstyle.link}>
					Forgot Password
				</a>
			</p>
			<button className={loginstyle.button}>Login</button>
			<Link href="/signup">
				<button className={loginstyle.button}>Sign Up</button>
			</Link>
		</form>
	</div>
);

export default LoginBox;
