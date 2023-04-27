import loginstyle from "@/styles/FormBox.module.css";
import Image from "next/image";
import logo from "@/images/link_icon_content.svg";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

// TODO: Give feedback to uesr if email or verification code is incorrect
const VerifyBox = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");

  const verify = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!email || !verificationCode) {
      window.alert("Please fill out all fields");
      return;
    }

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

    const res = await fetch("api/auth/verify-email", options);
    const data = await res.json();

    if (data.success) {
      signIn("github", { callbackUrl: "/" });
    } else {
      switch (data.error) {
        case "User is already verified":
          window.alert("User is already verified");
          break;
        case "User does not exist":
          window.alert("User does not exist");
          break;
        case "Verification code is incorrect":
          window.alert("Verification code is incorrect");
          break;
        default:
          window.alert("Something went wrong");
      }
    }
  };

  // TODO: Add input validation
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold">
              Connect{" "}
              <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current w-[45px] h-[45px] inline pl-1"
              >
                <path d="M9.26 13a2 2 0 0 1 .01-2.01A3 3 0 0 0 9 5H5a3 3 0 0 0 0 6h.08a6.06 6.06 0 0 0 0 2H5A5 5 0 0 1 5 3h4a5 5 0 0 1 .26 10zm1.48-6a2 2 0 0 1-.01 2.01A3 3 0 0 0 11 15h4a3 3 0 0 0 0-6h-.08a6.06 6.06 0 0 0 0-2H15a5 5 0 0 1 0 10h-4a5 5 0 0 1-.26-10z"></path>
              </svg>
            </h1>
            <p className="py-6">To complete registration enter your email address and verification code.</p>
            <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
              <div className="card-body">
                <form action="#" method="post">
                  <div className="form-control">
                    <input 
                      type="email"
                      placeholder="email"
                      className="input input-bordered mb-4"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <input 
                      type="text"
                      placeholder="verification code"
                      className="input input-bordered"
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary mt-6 normal-case"
                    onClick={verify}
                  >
                    Verify Code
                  </button>
                </form>
              </div>
            </div>
          </div>
          </div>
      </div>
    </>


    // <div className={loginstyle.container}>
    //   <form action="#" method="post">
    //     <h1>
    //       Connect
    //       <Image className={loginstyle.icon} src={logo} alt=""></Image>
    //     </h1>
    //     <h3 className={loginstyle.tagline}>The Social Media Hub</h3>
    //     <p className={loginstyle.message}>
    //       To complete registration enter your email address and verification
    //       code.
    //     </p>
    //     <input
    //       className={loginstyle.forminput}
    //       type="email"
    //       placeholder="Email Address"
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //     <br />
    //     <input
    //       className={loginstyle.forminput}
    //       type="text"
    //       placeholder="Verification Code"
    //       onChange={(e) => setVerificationCode(e.target.value)}
    //     />
    //     <br />
    //     <button className={loginstyle.button} onClick={verify}>
    //       Verify Account
    //     </button>
    //   </form>
    // </div>
  );
};

export default VerifyBox;
