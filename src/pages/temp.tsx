import React, { useEffect, useState } from "react";
import axios from "axios";
import { IPost } from "src/models/Post";

const PostsList = () => {
	const [posts, setPosts] = useState<IPost[]>();

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await axios.get("/api/posts");
				console.log(res);
				const postsData = res.data.data;
				setPosts(postsData);
			} catch (error) {
				console.log(error);
			}
		};
		fetchPosts();
	}, []);

	return (
		<div>
			<h1>Posts</h1>
			{posts ? (
				<ul>
					{posts.map((post) => (
						<li key={post._id}>
							<h4>{post.title}</h4>
							<h4>{post.author}</h4>
						</li>
					))}
				</ul>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default PostsList;
