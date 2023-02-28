import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/connectDB";
import User, { IUser } from "../../../models/User";
import { hashPassword, comparePassword } from "@/validation/passwordHash";
import { userValidationSchema } from "@/validation/userValidation";

type Data = {
  success: boolean;
  status: string;
  data?: IUser;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case "GET":
      try {
        //find user with username matching req
        // const { _id, email, username } = req.query;

        // let identifier = _id || email || username;

        let email = req.body.email;
        const user: IUser | null = await User.findOne({ email });
        if (!user) {
          res.status(404).json({ success: false, status: "Not Found" });
          break;
        }

        //hash the attempted password
        let attemptedPassHash = await hashPassword(req.body.password);
        let userPassHash = user.password;

        //compare the hashes
        let isCorrectPassword = await comparePassword(
          attemptedPassHash,
          userPassHash
        );

        //if the passwords are the same, return the user
        if (isCorrectPassword) {
          res.status(200).json({ success: true, data: user, status: "OK" });
          break;
        } else {
          res.status(403).json({ success: false, status: "Forbidden" });
          break;
        }
      } catch (error) {
        res.status(400).json({ success: false, status: "Bad Request" });
      }
      break;
    case "PUT":
      try {
        const { _email, password, _username } = req.body;
        const { query } = req.query;
        //if they're changing their username, check against password
        if (query === "username") {
          const user = await User.findOne({ _email });

          //User not found
          if (!user) {
            res.status(404).json({ success: false, status: "Not Found" });
            break;
          }

          //hash and compare passwords
          const pass_attempt = await hashPassword(password);
          const isMatch = await comparePassword(pass_attempt, user.password);
          if (!isMatch) {
            res.status(403).json({ success: false, status: "Forbidden" });
            break;
          }

          //change the username
          user.username = _username;
          await user.save();
          //return OK status if password is correct
          res.status(200).json({ success: true, status: "OK" });
        } else if (query === "email") {
        /*
					if they want to change their email, check against username
					this is because the data in req.body.email will be the 
					new email to be updated and vice versa
				*/
          const user = await User.findOne({ _username });
          if (!user) {
            res.status(404).json({ success: false, status: "Not Found" });
            break;
          }

          //hash and compare passwords
          const pass_attempt = await hashPassword(password);
          const isMatch = await comparePassword(pass_attempt, user.password);
          if (!isMatch) {
            res.status(403).json({ success: false, status: "Forbidden" });
            break;
          }

          //change the email
          user.email = _email;
          user.save();
          res.status(200).json({ success: true, status: "OK" });
        }
      } catch (error) {
        res.status(404).json({ success: false, status: "Not Found" });
      }
    case "DELETE":
      try {
        //parse the email and password attempt
        const { email, password } = req.body;

        //grab the user
        const user: IUser | null = await User.findOne({ email });
        if (!user) {
          //not found
          res.status(404).json({ success: false, status: "Not Found" });
          break;
        }
        //hash and compare passwords
        const pass_attempt = await hashPassword(password);
        const isMatch = await comparePassword(pass_attempt, user.password);
        if (!isMatch) {
          //error if the password is incorrect
          res.status(403).json({ success: false, status: "Forbidden" });
          break;
        }
        //delete user after checks
        User.deleteOne(email);
        res.status(200).json({ success: true, status: "OK" });
      } catch (error) {
        res.status(404).json({ success: false, status: "Not Found" });
      }
      break;
    default:
      res.status(500).json({ success: false, status: "Internal Server Error" });
      break;
  }
}
