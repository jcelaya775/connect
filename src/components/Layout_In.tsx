// components/common/MainLayout.tsx
import React, { PropsWithChildren } from "react";
import LoggedInNav from "./LoggedInNav";

const Layout_Login = ({ children }: PropsWithChildren) => {
  return (
    <>
      <LoggedInNav />
      <main>{children}</main>
    </>
  );
};
export default Layout_Login;
