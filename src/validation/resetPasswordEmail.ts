import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "connectsocialmediahub@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: any) {
  const mailOptions = {
    from: "connectsocialmediahub@gmail.com",
    to,
    subject: "Reset your password",
    text: `Click this link to reset your password: `,
    html: `<a href="http://localhost:3000/password-reset">Reset password</a>`,
  };
  await transporter.sendMail(mailOptions);
}
