import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import User, { IUser } from "@/models/User";
import { GetServerSidePropsContext } from "next";

export default async function getAuthUser(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<IUser | void> {
	try {
		const session = await getServerSession(req, res, authOptions);
		if (!session) return res.status(401).json({ success: false });

		// Find user
		const user: IUser | null = await User.findOne<IUser>({
			email: session.user!.email!,
		});

    if (!user) return res.status(404).json({ success: false });

		return user;
	} catch (error) {
		console.log(error);
	}
}

export async function getAuthUserFromPage(
  context: GetServerSidePropsContext
): Promise<IUser | null> {
  try {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
    if (!session) return null;

    // Find user
    const user: IUser | null = await User.findOne<IUser>({
      email: session.user!.email!,
    });
    if (!user) return null;

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
