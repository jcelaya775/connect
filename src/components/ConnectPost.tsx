import React from "react";
import Image from "next/image";
import landscape from "../images/landscape.jpg"

const ConnectPost = () => {
  return (
    <>
      <div className="card compact side w-full bg-base-100 shadow-xl">
                  <div className="card-body p-4 flex-col items-start lg:flex-row lg:items-center lg:space-x-3 space-y-1 flex-wrap">
                    <div className="flex-none">
                      <div className="flex flex-row space-x-3">
                        <div className="flex-none avatar">
                          <div className="rounded-full w-10 h-10 shadow">
                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="fill-current"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"/></svg>
                          </div>
                        </div>
                        <div className="flex-none w-content">
                          <div className="card-title">John Doe</div>
                          <div className="text-base-content text-opacity-80">Connect Post</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa tempor nec feugiat nisl. Ut tristique et egestas quis ipsum suspendisse ultrices. Fringilla urna porttitor rhoncus dolor purus non enim praesent.</p>
                    </div>
                    <div className="basis-1/6">
                      <Image className="w-full h-full" src={landscape} alt="post image"></Image>
                    </div>
                    <div className="basis-full">
                      <div className="flex flex-row space-x-3 justify-start">
                        <div className="flex-none w-content lg:-ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                        </div>
                        <div className="flex-none w-content">
                          5,222 Likes
                        </div>
                        <div className="flex-none w-content">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                        </div>
                        <div className="flex-none w-content">
                          100 Comments
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    </>
  )
}

export default ConnectPost;