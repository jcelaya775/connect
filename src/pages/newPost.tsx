import React from "react";
import { useQuery } from "react-query";
import { IPost } from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";
type Props = {};

const AllPostsPage: React.FC<Props> = () => {
  const { isLoading, error, data } = useQuery("posts", async () => {
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
      <h1>All Posts</h1>
      {data.length === 0 && <p>No posts found.</p>}
      {data.map((post: IPost) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.author}</p>
          {post.content.body && <p>{post.content.body}</p>}
          {post.content.image && typeof post.content.image !== "string" && (
            // Add a type guard for the image content property
            <img
              src={post.content.image.location}
              alt={post.title}
              width="200"
            />
          )}
        </div>
      ))}
    </div>
  );
};
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
export default AllPostsPage;
