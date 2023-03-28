import loginstyle from "@/styles/FormBox.module.css";
import Image from "next/image";
import logo from "@/images/link_icon_content.svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SignUpBox = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const formComplete: boolean =
    firstName !== "" &&
    lastName !== "" &&
    username !== "" &&
    email !== "" &&
    password !== "" &&
    confirmPassword !== "";

  const passwordsMatch = password === confirmPassword;

  const signup = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const name = firstName.trim() + " " + lastName.trim();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
      }),
    };

    const res = await fetch("api/auth/signup", options);
    const data = await res.json();

    console.log(data);

    if (data.success) router.push("/verify-email");
    else {
      switch (data.error) {
        case "That email is already taken":
          window.alert("That email is already taken");
          break;
        case "That username is already taken":
          window.alert("That username is already taken");
          break;
        default:
          window.alert("Something went wrong");
      }
    }
  };

  // TODO: Allow for username or email login
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
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br />
        <input
          className={loginstyle.forminput}
          type="text"
          placeholder="Last Name"
          pattern="^[a-z '-]{1,30}+$/i"
          required
          onChange={(e) => setLastName(e.target.value)}
        />
        <br />
        <input
          className={loginstyle.forminput}
          type="text"
          placeholder="Username"
          // TODO: Add validation for username
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          className={loginstyle.forminput}
          type="email"
          placeholder="Email Address"
          pattern="^[\w.]+@([\w-]+.)+[\w-]{2,4}$"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          className={`${loginstyle.forminput} ${
            formComplete &&
            (passwordsMatch ? loginstyle.valid : loginstyle.invalid)
          }`}
          type="password"
          placeholder="Password"
          pattern="^(?=.[0-9])(?=.[a-z])(?=.[A-Z])(?=.[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{8,32}$"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {/* TODO: Give user feedback on password strength */}
        <input
          className={`${loginstyle.forminput} ${
            formComplete &&
            (passwordsMatch ? loginstyle.valid : loginstyle.invalid)
          }`}
          type="password"
          placeholder="Confirm Password"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            onClick={signup}
            disabled={!formComplete || !passwordsMatch}
          >
            Sign Up
          </button>
        </Link>
      </form>
    </div>
  );
};

export default SignUpBox;
