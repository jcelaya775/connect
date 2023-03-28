import style from "@/styles/FormBox.module.css";
import Image from "next/image";
import logo from "@/images/link_icon_content.svg";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ResetBox = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const formComplete: boolean =
    email !== "" &&
    verificationCode !== "" &&
    password !== "" &&
    confirmPassword !== "";

  const passwordsMatch = password === confirmPassword;

  return (
    <div className={style.container}>
      <form action="#" method="post">
        <h1>
          Connect
          <Image className={style.icon} src={logo} alt=""></Image>
        </h1>
        <h3 className={style.tagline}>The Social Media Hub</h3>
        <p className={style.message}>
          To reset your password complete the information below.
        </p>
        <input
          className={style.forminput}
          type="email"
          placeholder="Email Address"
          pattern="^[\w.]+@([\w-]+.)+[\w-]{2,4}$"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          className={style.forminput}
          type="text"
          placeholder="Verification Code"
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <br />
        <input
          className={`${style.forminput} ${
            formComplete && (passwordsMatch ? style.valid : style.invalid)
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
          className={`${style.forminput} ${
            formComplete && (passwordsMatch ? style.valid : style.invalid)
          }`}
          type="password"
          placeholder="Confirm Password"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <button className={style.button}>Reset Password</button>
      </form>
    </div>
  );
};

export default ResetBox;
