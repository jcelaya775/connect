import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../connectDB";
import User, { IUser } from "../../../models/User";
import { hashPassword, comparePassword } from "@/validation/passwordHash";
import { userValidationSchema } from "@/validation/userValidation";

type Data = {
  name?: string;
  success: boolean;
  message: string;
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
        return res.status(400).json({ success: false, message: "Data doesnt follow conventions" });
      }
      try {
        //find user with username matching req
        let email = req.body.email
        let thisUser = await User.findOne({ email });
        
        //hash the attempted password
        let attemptedPassHash = await hashPassword(req.body.password);
        let userPassHash = thisUser.pass_hash;

        //compare the hashes
        let isCorrectPassword = await comparePassword(attemptedPassHash, userPassHash);

        //if the passwords are the same, return the user
        if (isCorrectPassword) {
          res.status(200).json({ success: true, data: thisUser, message: "User found"});
        } 
        else {
          //unsure what error status to return upon failed password verification
          res.status(401).json({ success: false, message: "Incorrect username or password"});
        }
      } 
      catch (error) {
        res.status(400).json({ success: false, message: "Something went wrong"});
      }
      break;
    case "POST":
      try {
        const validationResult = userValidationSchema.validate(req.body.username);
        if (validationResult.error) {
          return res.status(400).json({ success: false, message: "Incorrect username or password"});
        }
        // add code to check if email already exists
        const hashedPassword = await hashPassword(req.body.password);
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          verified: false
        });
        await user.save();
        res.status(201).json({ success: true, message: "User created"});
      } catch (error) {
        res.status(400).json({ success: false, message: "Something went wrong"});
      }
      break;
    case "PUT":
      try {
        const { _id, ...updateData } = req.body;
        const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
          new: true, //returns the updated user
        });
  
        if (!updatedUser) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
  
        return res.status(200).json(updatedUser);
      } 
      catch (error) {
        return res.status(500).json({ success: false, message: "something went wrong" });
      }
    
      break;
    case "DELETE":
      try {
        const { _id } = req.query;
    
        await User.findByIdAndDelete(_id);
    
        // Return a success response
        res.status(200).json({ success: true, message: 'User deleted successfully' });
      } catch (error) {
        // Return an error response
        res.status(500).json({ success: false, message: "User not Found" });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Method not allowed"});
      break;
  }
}
