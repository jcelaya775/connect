import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { IPost } from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "src/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";

type Props = {};

interface AllPostsPageComponent extends React.FC<Props> {
  Layout: string;
}

const AllPostsPage: AllPostsPageComponent = () => {
  const { isLoading, error, data } = useQuery(["posts"], async () => {
    const response = await fetch("/api/posts");
    const data = await response.json();
    if (!data.success) throw new Error(data.error || "Unknown error");
    return data.data || [];
  });

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    // Add a type assertion for the error object
    const errorMessage = (error as Error).message;
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div>
      {data.length === 0 && <p>No posts found.</p>}
      {data.reverse().map((post: IPost) => (
        <div key={post._id} className="card compact side w-full bg-base-100 shadow-xl">
          <div className="card-body p-4 flex-col items-start lg:flex-row lg:items-center lg:space-x-3 space-y-1 flex-wrap">
            <div className="flex-none">
              <div className="flex flex-row space-x-3">
                <div className="flex-none avatar">
                  <div className="rounded-full w-10 h-10 shadow">
                    {/* Replace this SVG with the profile image */}
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-none w-content">
                  <div className="card-title">{post.author}</div>
                  <div className="text-base-content text-opacity-80">Social Post</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              {post.content.body && <p>{post.content.body}</p>}
            </div>
            <div className="basis-1/6">
            {post.content.image && (
            <Image
            src={`https://${post.content.image.bucket}.s3.amazonaws.com/${post.content.image.key}`}
            alt="Post image"
            width={100}
            height={100}
            className="rounded-xl object-cover"
          />
          )}
        </div>
      </div>
    </div>
  ))}
</div>
);
};

AllPostsPage.Layout = "default";

export default AllPostsPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
const session = await getServerSession(context.req, authOptions);

if (!session) {
return {
redirect: {
destination: "/auth/signin",
permanent: false,
},
};
}

return {
props: {},
};
}
