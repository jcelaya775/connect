import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { IMessageData } from "../models/Temp";

// TODO: Later, we can use Axios
// const getPostMessages = async () => {
// 	const response = await fetch("/api/temp"); // GET reqeust by default
// 	const data = await response.json();
// 	return data;
// };

const createPostMessage = async (message: IMessageData) => {
	console.log(message);

	const response = await fetch("/api/temp", {
		method: "POST", // this is POST request
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ message }),
	});

	return response;
};

// const updatePostMessage = async (message_id: string, message: IMessageData) => {
// 	const response = await fetch("/api/temp", {
// 		method: "PUT", // this is PUT request
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			id: message_id,
// 			message: message.message,
// 		}), // here's where we specify the json request body
// 	});

// 	const data = await response.json();
// 	console.log(data);

// 	return data;
// };

// Define a custom hook that returns a `useMutation` instance
// for posting a message to the server
function usePostMessage(message: any) {
	const queryClient = useQueryClient();

	const postMessage = useMutation<IMessageData>(
		async (message: any) => {
			// Send a POST request to the server to create a new message
			const response = await createPostMessage(message);

			// Parse the JSON response from the server
			const data = await response.json();

			console.log(data);

			// Return the response data
			return data;
		},
		{
			// When the mutation succeeds, invalidate the 'messages' query in the query cache
			onSuccess: () => {
				queryClient.invalidateQueries("messages");
			},
		}
	);

	return postMessage;
}

function PostMessageForm() {
	// Initialize a state for the message input value
	const [message, setMessage] = useState("");

	// Get the `useMutation` instance for posting a message from the server
	let postMessage = usePostMessage(message);

	useEffect(() => {
		postMessage = usePostMessage(message);
	}, [message]);

	// Define a function to handle the form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Call the `mutate` function to send the message to the server
		postMessage.mutate();

		// Reset the message input value
		setMessage("");
	};

	return (
		<form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
			<label htmlFor="message" style={{ display: "block", marginBottom: 10 }}>
				Post Message:
			</label>
			<textarea
				id="message"
				value={message}
				onChange={(e) => {
					console.log(e.target.value);
					setMessage(e.target.value);
				}}
				style={{
					display: "block",
					marginBottom: 10,
					width: "100%",
					padding: 10,
					borderRadius: 4,
					border: "1px solid #ccc",
				}}
			/>
			<button
				type="submit"
				style={{
					background: "blue",
					color: "#fff",
					border: "none",
					borderRadius: 4,
					padding: "10px 20px",
				}}
			>
				Post
			</button>
		</form>
	);
}

export default PostMessageForm;
