import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "connectsocialmediahub@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(to: string, token: Number) {
	const mailOptions = {
		from: "connectsocialmediahub@gmail.com",
		to,
		subject: "Verify your email address",
		text: `your verification code is: ${token}`,
	};
	await transporter.sendMail(mailOptions);
}