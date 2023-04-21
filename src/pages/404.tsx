import style from "@/styles/FormBox.module.css";
import Header from "@/components/header";
import Image from "next/image";
import logo from "@/images/link_icon_content.svg";
import Link from "next/link"

export default function NotFound() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-gray-100 p-6 m-8 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2">
          <div className="flex flex-col sm:flex-row sm:gap-x-4">
            <div className="flex w-full sm:w-1/4 xl:1/6">
              <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="text-error w-1/3 h-1/3 mx-auto sm:mx-0 sm:w-full sm:h-full"
              >
                <path strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="flex-1 w-full">
              <h1 className="text-2xl text-error font-bold mb-4">404 Error: Page not found</h1>
              <p className="text-gray-600">We apologize for the inconvenience. The page you were looking for doesn't exist or is currently undergoing
                maitenance. Please also double check your URL to make sure there were no errors as this may have also caused this issue.</p>
              <p className="text-primary text-right pt-2">
                <Link href="/" className="hover:underline">
                  Return to Homepage
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

NotFound.Layout = "LoggedOut";
