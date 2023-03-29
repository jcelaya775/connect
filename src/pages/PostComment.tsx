import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";

interface Props {
  postId: string;
}

interface CommentFormData {
  postId: string;
  comment: string;
}

const PostComment: React.FC<Props> = ({ postId }) => {
  const [formData, setFormData] = useState<CommentFormData>({
    postId: postId,
    comment: "",
  });

  const mutation = useMutation((formData: CommentFormData) =>
    axios.post("/api/posts", formData)
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await mutation.mutateAsync(formData);
      setFormData((prevFormData) => ({ ...prevFormData, comment: "" }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#f0f0f0",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <label
        htmlFor="comment"
        style={{ display: "block", marginBottom: "0.5rem" }}
      >
        Comment:
      </label>
      <textarea
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
        required
      />

      <button
        type="submit"
        style={{
          backgroundColor: "#008080",
          color: "white",
          padding: "0.5rem",
          borderRadius: "0.5rem",
          border: "none",
          cursor: "pointer",
        }}
      >
        Post Comment
      </button>
    </form>
  );
};

export default PostComment;
