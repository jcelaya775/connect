import React, { useState } from "react";
import { useMutation } from "react-query";

type CreatePostProps = {
  onSuccess: () => void;
};

const CreatePost: React.FC<CreatePostProps> = ({ onSuccess }) => {
  const [visibility, setVisibility] = useState("public");
  const [title, setTitle] = useState("");
  const [community, setCommunity] = useState("");
  const [content, setContent] = useState("");

  const createPostMutation = useMutation(async (postData: any) => {
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
  }, {
    onSuccess: () => {
      onSuccess();
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createPostMutation.mutate({
      visibility,
      title,
      community,
      content: {
        body: content,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Visibility:
        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </label>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Community:
        <input type="text" value={community} onChange={(e) => setCommunity(e.target.value)} />
      </label>
      <label>
        Content:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CreatePost;
