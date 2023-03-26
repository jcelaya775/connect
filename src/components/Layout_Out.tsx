// components/common/AdminLayout.tsx
import React, { PropsWithChildren } from "react";
import LoggedOutNav from "./LoggedOutNav";

const Layout_Logout = (props: PropsWithChildren) => {
  return (
    <>
      <LoggedOutNav />
      {props.children}
    </>
  );
};
export default Layout_Logout;
