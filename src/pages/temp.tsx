import React from "react";
import axios from "axios";
import { IPost } from "src/models/Post";
import { useLikeStore } from "./like";
import PostComment from "./PostComment";
import { useQuery } from "react-query";
import { FaThumbsUp } from "react-icons/fa";

const PostsList = () => {
	const { likes, incrementLike } = useLikeStore();

	const {
		isLoading,
		isError,
		data: posts,
		error,
	} = useQuery<IPost[]>("posts", async () => {
		const res = await axios.get("/api/posts");
		return res.data.data;
	});

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return (
			<>
				<p>Error: {error}</p>;
			</>
		);
	}

	return (
		<div
			style={{
				backgroundColor: "#fc8d62",
				color: "#fff",
				padding: "2rem",
				fontFamily: "'Caveat', cursive",
			}}
		>
			<h1
				style={{
					fontSize: "3rem",
					marginBottom: "2rem",
					textAlign: "center",
					textShadow: "2px 2px #f64a8a",
				}}
			>
				Connect Posts
			</h1>
			<ul style={{ listStyle: "none", padding: 0 }}>
				{posts?.map((post) => (
					<li
						key={post._id}
						style={{
							backgroundColor: "#f7e7ce",
							border: "5px solid #f64a8a",
							borderRadius: "0.5rem",
							marginBottom: "2rem",
							padding: "2rem",
							boxShadow: "3px 3px #f64a8a",
						}}
					>
						<h2
							style={{
								fontSize: "2rem",
								marginBottom: "1rem",
								textShadow: "1px 1px #f64a8a",
							}}
						>
							{post.title}
						</h2>
						<h3
							style={{
								fontSize: "1.5rem",
								color: "#f64a8a",
								marginBottom: "1rem",
								textShadow: "1px 1px #f7e7ce",
							}}
						>
							By {post.author}
						</h3>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginTop: "1rem",
							}}
						>
							<button
								style={{
									backgroundColor: "#f64a8a",
									color: "#fff",
									borderRadius: "0.5rem",
									padding: "0.5rem 1rem",
									border: "none",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									marginRight: "1rem",
									boxShadow: "2px 2px #fc8d62",
								}}
								onClick={() => incrementLike(post._id)}
							>
								<FaThumbsUp size={20} style={{ marginRight: "0.5rem" }} />
								Like
							</button>
							<span
								style={{
									fontSize: "1.5rem",
									color: "#f64a8a",
									textShadow: "1px 1px #f7e7ce",
								}}
							>
								{likes[post._id] || 0} Likes
							</span>
						</div>
						<PostComment postId={post._id} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default PostsList;
