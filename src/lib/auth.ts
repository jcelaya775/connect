import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import User, { IUser } from "@/models/User";
import { GetServerSidePropsContext } from "next";

export async function getAuthUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<IUser | null> {
  try {
    const session = await getServerSession(req, res, authOptions);
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
