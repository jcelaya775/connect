import Layout_Login from "./Layout_In";
import Layout_Logout from "./Layout_Out";
export const Layouts = {
  LoggedIn: Layout_Login,
  LoggedOut: Layout_Logout,
};
export type LayoutKeys = keyof typeof Layouts;
