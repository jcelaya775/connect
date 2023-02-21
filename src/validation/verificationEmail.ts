import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: "connectsocialmediahub@gmail.com",
		pass: process.env.ZACH_LINUX_APP_PASS,
	},
});

export async function sendVerificationEmail(to: any, token: any) {
	const mailOptions = {
		from: "connectsocialmediahub@gmail.com",
		to,
		subject: "Verify your email address",
		text: `your verification code is: ${token}`,
		html: `<p>your verification code is: ${token}</p>`,
	};
	await transporter.sendMail(mailOptions);
}
