import AWS from "aws-sdk";
export const sendEmail = (email: string, name: string, code: Number) => {
	return new Promise((resolve, reject) => {
		const emailRegex =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (!emailRegex.test(email)) {
			reject(new Error("Invalid email address"));
		}

		const ses = new AWS.SES({
			// make sure this is the right region
			region: "us-west-2",
		});
		const params = {
			Destination: {
				ToAddresses: [email],
			},
			Message: {
				Body: {
					Html: {
						Charset: "UTF-8",
						Data: `<!DOCTYPE html><html>\
							<head>\
								<style>h1 {color: blue;text-align: center;}\
								</style>\
							</head>\
							<body>\
								<h1>Verification Email</h1>\
								<p>Dear ${name},</p>\
								<p>Thank you for signing up for Connect.</p>\
								<p>Please enter the following code to verify your account:</p>\
								<p><strong>${code}</strong></p>\
								<p>Best regards,</p>\
								<p>Connect: The Social Media Hub</p>\
							</body>\
						</html>`,
					},
				},
				Subject: {
					Data: "Your connect verification code",
				},
			},
			Source: "connectsocialmediahub@gmail.com",
		};

		ses.sendEmail(params, (err: any, data: any) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};
