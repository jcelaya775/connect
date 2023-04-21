import React, { useEffect } from "react";
import SideNav from "@/components/SideNav";
import BtmNav from "@/components/bottom-nav";
import Image from "next/image";
import FB from "../images/fb_logo.png";
import IG from "../images/IG_logo.png";
import TikTok from "../images/TikTok_logo.png";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";
import useUser from "@/hooks/useUser";

export default function Setting() {
  const user = useUser();

  return (
    <>
      <div className="min-h-screen min-w-full bg-base-200 pt-16 pb-20">
        <span className="hidden sm:block horz:hidden">
          <SideNav />
        </span>
        <span className="sm:hidden horz:block">
          <BtmNav />
        </span>
        <div className="flex-1 bg-base-200 min-h-screen pr-8 pt-6 pl-8 sm:pl-24 w-full lg:pl-48 xl:pr-0 horz:pl-8">
            <div className="flex flex-row gap-x-10">
              <div className="flex-initial w-full pr-0 xl:pr-8">
                <div className="flex flex-col w-full gap-5">
                  <div className="card w-full bg-base-100 shadow-xl">
                    <div className="card-body p-4 flex-row justify-between">
                      <div className="card-title">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                          />
                        </svg>
                        Settings
                      </div>
                    </div>
                    <div className="card w-full rounded-xl border-2 shadow-xl bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#FF7A00] via-[#FF0069] to-[#D300C5]">
                      <div className="card-body p-4 flex-col justify-between">
                        <div className='flex flex-row w-full justify-between'>
                          <div className="card-title pb-0 mb-0 text-white">
                            <Image src={IG} alt="Instagram Logo" className="w-7"></Image>
                            Instagram
                          </div>
                          <div className='card-actions justify-end'>
                            <label className='btn btn-sm bg-white border-white text-[#FF0069] px-6 normal-case shadow-xl'>Login</label>
                          </div>
                        </div>  
                        <div className='divider basis-full pt-0 mt-0 before:bg-white after:bg-white'></div>
                        <div className="text-white">
                          Default Post:
                          <input type="checkbox" className="toggle toggle-sm checked:bg-[#FF0069] mx-2 rounded-full inline-block align-text-bottom" />
                        </div>
                        <div className="text-white">
                          Default Audience:
                          <select className="select select-xs text-black border-gray-400 w-1/2 max-w-xs rounded-full ml-5">
                            <option disabled selected>-- Choose Audience --</option>
                            <option>Public</option>
                            <option>Friends Only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="card w-full bg-black rounded-xl border-2 shadow-xl">
                      <div className="card-body p-4 flex-col justify-between">
                        <div className='flex flex-row w-full justify-between'>
                          <div className="card-title pb-0 mb-0 text-white">
                            <Image src={TikTok} alt="TikTok Logo" className="w-6"></Image>
                            TikTok
                          </div>
                          <div className='card-actions justify-end'>
                            <label className='btn btn-sm bg-white border-white text-black hover:bg-[#00f2ea] px-6 normal-case shadow-xl'>Login</label>
                          </div>
                        </div>  
                        <div className='divider basis-full pt-0 mt-0 before:bg-white after:bg-white'></div>
                        <div className="text-white">
                          Default Post:
                          <input type="checkbox" className="toggle toggle-sm checked:bg-[#00f2ea] mx-2 rounded-full inline-block align-text-bottom" />
                        </div>
                        <div className="text-white">
                            Default Audience:
                            <select className="select select-xs text-black border-gray-400 w-1/2 max-w-xs rounded-full ml-5">
                              <option disabled selected>
                                -- Choose Audience --
                              </option>
                              <option>Public</option>
                              <option>Friends Only</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="card w-full md:w-1/3 rounded-xl border-2 shadow-xl bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#FF7A00] via-[#FF0069] to-[#D300C5]">
                        <div className="card-body p-4 flex-col justify-between">
                          <div className="flex flex-row w-full justify-between">
                            <div className="card-title pb-0 mb-0 text-white">
                              <Image
                                src={IG}
                                alt="Instagram Logo"
                                className="w-7"
                              ></Image>
                              Instagram
                            </div>
                            <div className="card-actions justify-end">
                              <label className="btn btn-sm bg-white border-white text-[#FF0069] px-6 normal-case shadow-xl">
                                Login
                              </label>
                            </div>
                          </div>
                          <div className="divider basis-full pt-0 mt-0 before:bg-white after:bg-white"></div>
                          <div className="text-white">
                            Default Post:
                            <input
                              type="checkbox"
                              className="toggle toggle-sm checked:bg-[#FF0069] mx-2 rounded-full inline-block align-text-bottom"
                            />
                          </div>
                          <div className="text-white">
                            Default Audience:
                            <select className="select select-xs text-black border-gray-400 w-1/2 max-w-xs rounded-full ml-5">
                              <option disabled selected>
                                -- Choose Audience --
                              </option>
                              <option>Public</option>
                              <option>Friends Only</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="card w-full md:w-1/3 bg-black rounded-xl border-2 shadow-xl">
                        <div className="card-body p-4 flex-col justify-between">
                          <div className="flex flex-row w-full justify-between">
                            <div className="card-title pb-0 mb-0 text-white">
                              <Image
                                src={TikTok}
                                alt="TikTok Logo"
                                className="w-6"
                              ></Image>
                              TikTok
                            </div>
                            <div className="card-actions justify-end">
                              <label className="btn btn-sm bg-white border-white text-black hover:bg-[#00f2ea] px-6 normal-case shadow-xl">
                                Login
                              </label>
                            </div>
                          </div>
                          <div className="divider basis-full pt-0 mt-0 before:bg-white after:bg-white"></div>
                          <div className="text-white">
                            Default Post:
                            <input
                              type="checkbox"
                              className="toggle toggle-sm checked:bg-[#00f2ea] mx-2 rounded-full inline-block align-text-bottom"
                            />
                          </div>
                          <div className="text-white">
                            Default Audience:
                            <select className="select select-xs text-black border-gray-400 w-1/2 max-w-xs rounded-full ml-5">
                              <option disabled selected>
                                -- Choose Audience --
                              </option>
                              <option>Public</option>
                              <option>Private</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div> */}






       <div className="flex-1 bg-base-200 min-h-screen pr-8 pt-6 pl-8 sm:pl-24 w-full lg:pl-48 xl:pr-0 horz:pl-8">
          <div className="flex flex-row gap-x-10">
            <div className="flex-initial w-full pr-0 xl:pr-8">
              <div className="flex flex-col w-full gap-5">
                <div className="card w-full bg-base-100 shadow-xl">
                  <div className="card-body p-4 flex-row justify-between">
                    <div className="card-title">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                        />
                      </svg>
                      Settings
                    </div>
                  </div>
                </div>
                <div className='w-full flex flex-col gap-y-4 justify-between'>
                <div className="card w-full md:w-3/4 bg-base-100 shadow-xl">
                  <div className="card-body p-4 flex-col justify-between">
                    <div className="card-title pb-0 mb-0">
                      Account
                    </div>
                    <div className='divider basis-full pt-0 mt-0'></div>
                    <div>Username:</div>
                    <div>Email:</div>
                    <div>Password:</div>
                  </div>
                </div>
                <div className="card w-3/4 bg-base-100 shadow-xl">
                  <div className="card-body p-4 flex-col justify-between">
                    <div className="card-title pb-0 mb-0">
                      Social Media
                    </div>
                    <div className='divider basis-full pt-0 mt-0'></div>
                    <div className="flex w-full flex-col gap-y-4 xl:w-full xl:gap-x-4">
                    <div className="card w-full bg-[#1877F2] rounded-xl shadow-xl">
                      <div className="card-body p-4 flex-col justify-between">
                        <div className='flex flex-row w-full justify-between'>
                          <div className="card-title pb-0 mb-0 text-white">
                            <Image src={FB} alt="Facebook Logo" className="w-7"></Image>  
                            Facebook
                          </div>
                          <div className='card-actions justify-end'>
                            <label className='btn btn-sm bg-white border-white text-[#1877F2] px-6 normal-case shadow-xl'>Login</label>
                          </div>
                        </div>
                        <div className='divider basis-full pt-0 mt-0 before:bg-white after:bg-white'></div>
                        <div className="text-white">
                          Default Post:
                          <input type="checkbox" className="toggle toggle-sm checked:bg-[#1877F2] mx-2 rounded-full inline-block align-text-bottom" />
                        </div>
                        <div className="text-white">
                          Default Audience:
                          <select className="select select-xs text-black border-gray-400 w-1/2 max-w-xs rounded-full ml-5">
                            <option disabled selected>-- Choose Audience --</option>
                            <option>Public</option>
                            <option>Friends Only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="card w-full rounded-xl border-2 shadow-xl bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#FF7A00] via-[#FF0069] to-[#D300C5]">
                      <div className="card-body p-4 flex-col justify-between">
                        <div className='flex flex-row w-full justify-between'>
                          <div className="card-title pb-0 mb-0 text-white">
                            <Image src={IG} alt="Instagram Logo" className="w-7"></Image>
                            Instagram
                          </div>
                          <div className='card-actions justify-end'>
                            <label className='btn btn-sm bg-white border-white text-[#FF0069] px-6 normal-case shadow-xl'>Login</label>
                          </div>
                        </div>  
                        <div className='divider basis-full pt-0 mt-0 before:bg-white after:bg-white'></div>
                        <div className="text-white">
                          Default Post:
                          <input type="checkbox" className="toggle toggle-sm checked:bg-[#FF0069] mx-2 rounded-full inline-block align-text-bottom" />
                        </div>
                        <div className="text-white">
                          Default Audience:
                          <select className="select select-xs text-black border-gray-400 w-1/2 max-w-xs rounded-full ml-5">
                            <option disabled selected>-- Choose Audience --</option>
                            <option>Public</option>
                            <option>Friends Only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="card w-full bg-black rounded-xl border-2 shadow-xl">
                      <div className="card-body p-4 flex-col justify-between">
                        <div className='flex flex-row w-full justify-between'>
                          <div className="card-title pb-0 mb-0 text-white">
                            <Image src={TikTok} alt="TikTok Logo" className="w-6"></Image>
                            TikTok
                          </div>
                          <div className='card-actions justify-end'>
                            <label className='btn btn-sm bg-white border-white text-black hover:bg-[#00f2ea] px-6 normal-case shadow-xl'>Login</label>
                          </div>
                        </div>  
                        <div className='divider basis-full pt-0 mt-0 before:bg-white after:bg-white'></div>
                        <div className="text-white">
                          Default Post:
                          <input type="checkbox" className="toggle toggle-sm checked:bg-[#00f2ea] mx-2 rounded-full inline-block align-text-bottom" />
                        </div>
                        <div className="text-white">
                            Default Audience:
                            <select className="select select-xs text-black border-gray-400 w-1/2 max-w-xs rounded-full ml-5">
                              <option disabled selected>
                                -- Choose Audience --
                              </option>
                              <option>Public</option>
                              <option>Friends Only</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  <div className="card w-1/4 bg-base-100 shadow-xl">
                    <div className="card-body p-4 flex-col">
                      <div className="card-title pb-0 mb-0">Social Media</div>
                      <div className="divider basis-full pt-0 mt-0"></div>
                      <div className="flex flex-col gap-y-4">
                        <div className="card w-full bg-[#1877F2] rounded-xl shadow-xl">
                          <div className="card-body p-4 flex-col justify-between">
                            <div className="flex flex-row w-full justify-between">
                              <div className="card-title pb-0 mb-0 text-white">
                                <Image
                                  src={FB}
                                  alt="Facebook Logo"
                                  className="w-7"
                                ></Image>
                                Facebook
                              </div>
                              <div className="card-actions justify-end">
                                <label
                                  className="btn btn-xs bg-white border-white text-[#1877F2] px-6 normal-case shadow-xl"
                                  onClick={facebookStatus ? fbLogout : fbLogin}
                                >
                                  {facebookStatus ? "Logout" : "Login"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card w-full rounded-xl border-2 shadow-xl bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#FF7A00] via-[#FF0069] to-[#D300C5]">
                          <div className="card-body p-4 flex-col justify-between">
                            <div className="flex flex-row w-full justify-between">
                              <div className="card-title pb-0 mb-0 text-white">
                                <Image
                                  src={IG}
                                  alt="Instagram Logo"
                                  className="w-7"
                                ></Image>
                                  Instagram
                                </div>
                                
                              <div className="card-actions justify-end">
                                <label className="btn btn-xs bg-white border-white text-[#FF0069] px-6 normal-case shadow-xl">
                                  Login
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card w-full bg-black rounded-xl border-2 shadow-xl">
                          <div className="card-body p-4 flex-col justify-between">
                            <div className="flex flex-row w-full justify-between">
                              <div className="card-title pb-0 mb-0 text-white">
                                <Image
                                  src={TikTok}
                                  alt="TikTok Logo"
                                  className="w-6"
                                ></Image>
                                TikTok
                              </div>
                              <div className="card-actions justify-end">
                                <label className="btn btn-xs bg-white border-white text-black hover:bg-[#00f2ea] px-6 normal-case shadow-xl">
                                  Login
                                </label>
                              </div>
                            </div>
                            {/* <div className="divider basis-full pt-0 mt-0 before:bg-white after:bg-white"></div>
                            <div className="text-white">
                              Default Post:
                              <input
                                type="checkbox"
                                className="toggle toggle-sm checked:bg-[#00f2ea] mx-2 rounded-full inline-block align-text-bottom"
                              />
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                    </div>
                  </div>
                  </div>
              </div>
          </div>
        </div> */}
      </div>
    </>
  );
}

Setting.Layout = "LoggedIn";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
