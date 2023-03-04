import { useState, useEffect } from "react";

type message = {
	message: string;
};

export default function PostMessages() {
	const [messages, setMessages] = useState<message[]>();

	useEffect(() => {
		const fetchMessages = async () => {
			const response = await fetch("/api/temp");
			const data = await response.json();
			setMessages(data.message);
		};

		fetchMessages().catch((err) => console.log(err));
	}, []);

	return (
		<div>
			<h1>Post Messages</h1>
			{messages &&
				messages.map((message, idx) => <p key={idx}>{message.message}</p>)}
		</div>
	);
}
