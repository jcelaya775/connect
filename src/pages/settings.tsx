import React, { useEffect } from "react";
import { GetServerSidePropsContext } from "next/types";
import useUser from "@/hooks/useUser";
import { useFacebook } from "react-facebook";
import axios from "axios";
import { IUser } from "@/models/User";
import SideNav from "@/components/SideNav";
import BtmNav from "@/components/bottom-nav";
import Image from "next/image";
import FB from "../images/fb_logo.png";
import IG from "../images/IG_logo.png";
import TikTok from "../images/TikTok_logo.png";
import { getAuthUserFromPage } from "@/lib/auth";

export default function Settings() {
  const { user, userLoading } = useUser();
  const [facebookStatus, setFacebookStatus] = React.useState(false);
  const { isLoading, init, error } = useFacebook();
  const [theme, setTheme] = React.useState<string>("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
    // TODO: Or user has a theme saved in their account
  }, []);

  useEffect(() => {
    const html = document.querySelector("html");
    html?.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  //  // Check login status on page load
  useEffect(() => {
    const checkLoginStatus = async () => {
      await userLoading;
      setFacebookStatus(user!.facebook ? true : false);
    };
    checkLoginStatus().catch((err) => console.log(err));
  }, [user, userLoading]);

  const fbLogin = async () => {
    await userLoading;
    const loggedIn = user!.facebook ? true : false;

    if (!loggedIn) {
      const api = await init();
      const res: any = await api?.login({
        scope:
          "user_events, email, user_managed_groups, groups_show_list, pages_manage_cta, pages_manage_instant_articles, pages_show_list, read_page_mailboxes, ads_management, ads_read, business_management, pages_messaging, pages_messaging_phone_number, pages_messaging_subscriptions, publish_to_groups, groups_access_member_info, attribution_read, page_events, pages_read_engagement, pages_manage_metadata, pages_read_user_content, pages_manage_ads, pages_manage_posts, pages_manage_engagement",
        returnScopes: true,
      });

      const accessToken = res.authResponse?.accessToken;
      await axios.post("/api/platforms/facebook/login", {
        accessToken,
      });

      setFacebookStatus(res.status === "connected" ? true : false);
    }
  };

  const fbLogout = async () => {
    await axios.post("/api/platforms/facebook/logout");

    const api = await init();
    const FB = await api?.getFB();

    const handleSessionResponse = async (response: any) => {
      if (!response.session) return;
      FB.logout(response);
    };
    await FB.getLoginStatus(handleSessionResponse);

    setFacebookStatus(false);
  };

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
                </div>
                <div className="flex flex-col gap-y-4 lg:flex-row lg:gap-x-4">
                  <div className="card flex-1 w-full lg:w-3/4 bg-base-100 shadow-xl align-top">
                    <div className="card-body p-4 flex-col h-max align-top">
                      <div className="card-title pb-0 mb-0">Account</div>
                      <div className="divider w-full pb-4 m-0 h-min"></div>
                      <div>Full Name: {user?.name}</div>
                      <div>Username: {user?.username}</div>
                      <div>Email: {user?.email}</div>
                      <div>Password: **********</div>

                      <div className="card-title pt-2 pb-0 mb-0">
                        Appearance
                      </div>
                      <div className="divider w-full pb-2 m-0 h-min"></div>
                      <div className="flex items-center">
                        <span className="mr-2">Theme:</span>
                        {/* TODO: Add functionality to select dropdown */}
                        <select
                          className="px-2 py-1 border rounded"
                          value={theme}
                          defaultValue={theme}
                          onChange={(e) => setTheme(e.target.value)}
                        >
                          <option value="corporate">Corporate</option>
                          <option value="business">Business</option>
                          <option value="dark">Dark</option>
                          <option value="garden">Garden</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="card flex-none w-full lg:w-1/4 bg-base-100 shadow-xl">
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
      </div>
    </>
  );
}

Settings.Layout = "LoggedIn";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user: IUser | null = await getAuthUserFromPage(context);
  if (!user || !user.is_verified)
    return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
}
