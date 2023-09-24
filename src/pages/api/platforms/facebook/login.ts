import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios from "axios";
import { getAuthUser } from "@/lib/auth";

type Data = {
  success: boolean;
  userToken?: string;
  pageToken?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();

  const user = await getAuthUser(req, res);
  if (!user || !user.facebook) return res.status(401).json({ success: false });

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { accessToken } = req.body;

        // User token
        const longTermUserTokenResponse = await axios.get(
          `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&
          client_id=${process.env.FACEBOOK_CLIENT_ID}&
          client_secret=${process.env.FACEBOOK_APP_SECRET}&
          fb_exchange_token=${accessToken}`
        );
        const longTermUserToken = longTermUserTokenResponse.data.access_token;
        if (!longTermUserToken) return res.status(500).json({ success: false });

        // Page token
        const shortTermPageTokenResponse = await axios.get(
          `https://graph.facebook.com/v16.0/me/accounts?access_token=${accessToken}`
        );
        const shortTermPageToken =
          shortTermPageTokenResponse.data.data[0].access_token;
        const pageId = shortTermPageTokenResponse.data.data[0].id;
        const pageName = shortTermPageTokenResponse.data.data[0].name;
        const longTermPageTokenResponse = await axios.get(
          `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&
          client_id=${process.env.FACEBOOK_CLIENT_ID}&
          client_secret=${process.env.FACEBOOK_APP_SECRET}&
          fb_exchange_token=${shortTermPageToken}`
        );
        const longTermPageToken = longTermPageTokenResponse.data.access_token;
        if (!longTermPageToken) return res.status(500).json({ success: false });

        const userIdResponse = await axios.get(
          "https://graph.facebook.com/me",
          {
            params: {
              access_token: longTermUserToken,
            },
          }
        );
        const userId = userIdResponse.data.id;

        user.facebook.user_token = longTermUserToken;
        user.facebook.page_token = longTermPageToken;
        user.facebook.user_id = userId;
        user.facebook.page_id = pageId;
        user.facebook.page_name = pageName;
        await user.save();

        res.status(200).json({
          success: true,
          userToken: longTermUserToken,
          pageToken: longTermPageToken,
        });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
