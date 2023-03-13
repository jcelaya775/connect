import React, { useState } from "react";
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
	const [formData, setFormData] = useState<PostFormData>(initialFormData);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await axios.post("/api/posts", formData);
			console.log(response.data);
			setFormData(initialFormData);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="email">Email:</label>
			<input type="email" name="email" value={formData.email} onChange={handleChange} required />

			<label htmlFor="views">Views:</label>
			<input type="number" name="views" value={formData.views} onChange={handleChange} required />

			<label htmlFor="shared_with">Shared With:</label>
			<input
				type="text"
				name="shared_with"
				value={formData.shared_with}
				onChange={handleChange}
				required
			/>

			<label htmlFor="title">Title:</label>
			<input type="text" name="title" value={formData.title} onChange={handleChange} required />

			<label htmlFor="author">Author:</label>
			<input type="text" name="author" value={formData.author} onChange={handleChange} required />

			<label htmlFor="community">Community:</label>
			<input
				type="text"
				name="community"
				value={formData.community}
				onChange={handleChange}
				required
			/>

			<label htmlFor="password">Password:</label>
			<input
				type="password"
				name="password"
				value={formData.password}
				onChange={handleChange}
				required
			/>

			<label htmlFor="jwt">JWT:</label>
			<input type="text" name="jwt" value={formData.jwt} onChange={handleChange} required />

			<label htmlFor="content">Content:</label>
			<textarea name="content" value={formData.content} onChange={handleChange} required />

			<button type="submit">Post Message</button>
		</form>
	);
};

export default PostForm;
