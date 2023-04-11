/* eslint-disable @next/next/no-img-element */
import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { IPost } from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";

type Props = {};

const AllPostsPage = () => {
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
    <div style={{ paddingTop: "90px" }}>
      <h1>All Posts</h1>
      {data.length === 0 && <p>No posts found.</p>}
      {data.map((post: IPost) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.author}</p>
          {post.content.body && <p>{post.content.body}</p>}
          {post.content.image && !("children" in post.content.image) && (
            <Image
              src={post.content.image.location!}
              alt={post.title}
              width="200"
            />
          )} */}
        </div>
      ))}
    </div>
  );
};

AllPostsPage.Layout = "LoggedIn";

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
