import React from "react";
import { MyPage } from "../components/types";
import { signIn } from "next-auth/react";

export const LandingPage = () => {
  return (
    <>
      <div data-theme="corporate">
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row z-0">
            <div className="text-center max-w-screen-sm prose lg:text-left lg:w-[500px]">
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
              <p className="py-6 pl-0">
                A new social media experience! Targeted towards content creators
                and businesses to engage with their audiences across multiple
                social media platforms.
              </p>
              <button className="btn bg-primary hover:bg-secondary">
                Sign-up Now!
              </button>
            </div>
            <div className="divider divider-vertical lg:hidden">OR Login</div>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <div className="card-body">
                <h1 className="text-3xl font-bold text-center pb-2">Login</h1>
                <div className="form-control">
                  {/* <label className="label">
						<span className="label-text">Email</span>
						</label> */}
                  <input
                    type="text"
                    placeholder="email"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  {/* <label className="label">
						<span className="label-text">Password</span>
						</label> */}
                  <input
                    type="text"
                    placeholder="password"
                    className="input input-bordered"
                  />
                  <label className="label">
                    <a href="#" className="label-text-alt link link-hover">
                      Forgot password?
                    </a>
                  </label>
                </div>
                <div className="form-control mt-6">
                  <button
                    className="btn bg-primary hover:bg-secondary"
                    onClick={(e) => {
                      e.preventDefault();
											console.log("login")
                      signIn("github", {
                        callbackUrl: "/",
                      });
                    }}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
