import React from "react";
import { useMutation } from "react-query";
import axios from "axios";

type PostFormData = {
  email: string;
  views: number;
  shared_with: string[];
  title: string;
  author: string;
  community: string;
  password: string;
  jwt: string;
  content: string;
  comments: string[];
  likes: number;
};

const initialFormData: PostFormData = {
  email: "",
  views: 0,
  shared_with: [],
  title: "",
  author: "",
  community: "",
  password: "",
  jwt: "",
  content: "",
  comments: [],
  likes: 0,
};

const PostForm = () => {
  const [formData, setFormData] = React.useState<PostFormData>(initialFormData);

  const mutation = useMutation((formData: PostFormData) =>
    axios.post("/api/posts", formData)
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => ({ ...prevFormData, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await mutation.mutateAsync(formData);
      setFormData(initialFormData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#f7ede2",
        padding: "2rem",
        borderRadius: "0.5rem",
        fontFamily: "Courier New, monospace",
        color: "#544e61",
        fontSize: "1.2rem",
      }}
    >
      <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
        Email:
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.3rem", border: "none", backgroundColor: "#f2d9c4" }}
        required
      />

      <label htmlFor="views" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
        Views:
      </label>
      <input
        type="number"
        name="views"
        value={formData.views}
        onChange={handleChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.3rem", border: "none", backgroundColor: "#f2d9c4" }}
        required
      />

      <label
        htmlFor="shared_with"
        style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
      >
        Shared With:
      </label>
      <input
        type="text"
        name="shared_with"
        value={formData.shared_with}
        onChange={handleChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.3rem", border: "none", backgroundColor: "#f2d9c4" }}
        required
        />  <label htmlFor="title" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
        Title:
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.3rem", border: "none", backgroundColor: "#f2d9c4" }}
        required
      />
    
      <label
        htmlFor="author"
        style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
      >
        Author:
      </label>
      <input
        type="text"
        name="author"
        value={formData.author}
        onChange={handleChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.3rem", border: "none", backgroundColor: "#f2d9c4" }}
        required
      />  
    
      <label
        htmlFor="community"
        style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
      >
        Community:
      </label>
      <input
        type="text"
        name="community"
        value={formData.community}
        onChange={handleChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.3rem", border: "none", backgroundColor: "#f2d9c4" }}
        required
      />
    
      <label
        htmlFor="jwt"
        style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
      >
        JWT:
      </label>
      <input
        type="text"
        name="jwt"
        value={formData.jwt}
        onChange={handleChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.3rem", border: "none", backgroundColor: "#f2d9c4" }}
        required
      />
    
      <label htmlFor="content" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
        Content:
      </label>
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.3rem", border: "none", backgroundColor: "#f2d9c4", minHeight: "10rem" }}
        required
      />
    
      <label htmlFor="image" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
        Image:
      </label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: "1rem" }}
      />
    
      <button
        type="submit"
        style={{
          backgroundColor: "#d8a48f",
          color: "#544e61",
          padding: "0.5rem",
          borderRadius: "0.5rem",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Post Message
      </button>
    </form>
    );
  };
  export default PostForm;