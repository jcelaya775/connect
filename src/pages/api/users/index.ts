import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../connectDB";
import User, { IUser } from "../../../models/User";
import { hashPassword, comparePassword } from "@/validation/passwordHash";
import { userValidationSchema } from "@/validation/userValidation";

type Data = {
  name?: string;
  success: boolean;
  data?: IUser[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await connectDB();
  
  switch (method) {
    case "GET":
      
      //make sure the username follows conventions
      const validationResult = userValidationSchema.validate(req.body.username);
      if (validationResult.error) {
        return res.status(400).json({ success: false });
      }
      try {
        //find user with username matching req
        let username = req.body.username
        let thisUser = await User.findOne({ username });
        
        //hash the attempted password
        let attemptedPassHash = await hashPassword(req.body.password);
        let userPassHash = thisUser.pass_hash;

        //compare the hashes
        let isCorrectPassword = await comparePassword(attemptedPassHash, userPassHash);

        //if the passwords are the same, return the user
        if (isCorrectPassword) {
          res.status(200).json({ success: true, data: thisUser });
        } 
        else {
          //unsure what error status to return upon failed password verification
          res.status(401).json({ success: false });
        }
      } 
      catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      // try {
      //   const validationResult = userValidationSchema.validate(req.body.username);
      //   if (validationResult.error) {
      //     return res.status(400).json({ success: false });
      //   }
      //   const { name, email, password, username } = req.body; 
      //   const hashedPassword = await hashPassword(req.body.password);
      //   const user = new User({
      //     username: req.body.username,
      //     email: req.body.email,
      //     password: hashedPassword,
      //   });
      //   await user.save();
      //   res.status(201).json({ success: true });
      // } catch (error) {
      //   res.status(400).json({ success: false });
      // }
      // break;
    case "PUT":
      break;
    case "DELETE":
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
