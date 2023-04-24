import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsResult } from "next";
import { GetServerSidePropsContext } from "next";

// NOT WORKING

type WrappedGetServerSideProps = (
  context: any
) => GetServerSidePropsResult<any> | Promise<GetServerSidePropsResult<any>>;

export default function withServerSideAuth(
  getServerSidePropsFunc: (context: any) => any
): WrappedGetServerSideProps {
  const wrappedGetServerSideProps = (context: GetServerSidePropsContext) => {
    const { req, res } = context;

    const session = getServerSession(req, res, authOptions);

    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const originalProps = getServerSidePropsFunc(context);
    return {
      props: {
        ...originalProps,
        session,
      },
    };
  };

  return wrappedGetServerSideProps;
}
