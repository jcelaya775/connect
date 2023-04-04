import React, { useState } from "react";
import { useMutation } from "react-query";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";

type CreatePostProps = {
  onSuccess: () => void;
};

export default function CreatePost({ onSuccess }: CreatePostProps) {
  const [visibility, setVisibility] = useState("public");
  const [title, setTitle] = useState("");
  const [community, setCommunity] = useState("");
  const [content, setContent] = useState("");

  const createPostMutation = useMutation(
    async (postData: any) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Error creating post");
      }
    },
    {
      onSuccess: () => {
        onSuccess();
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const visibilityValue = visibility === "public" ? 1 : 2;
  
    createPostMutation.mutate({
      visibility: visibilityValue,
      title,
      community,
      content: {
        body: content,
      },
    });
  };
  

  return (
    <div className="pt-64">
      <form onSubmit={handleSubmit}>
        <label>
          Visibility:
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Community:
          <input
            type="text"
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
          />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

CreatePost.Layout = "LoggedIn";

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
