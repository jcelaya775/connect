import style from "@/styles/Header.module.css";
import logo from "@/images/link_icon.svg";
import Link from "next/link";
import Image from "next/image";

const Header = () => (
  <>
    <div className={style.header}>
      <Link className={style.home_link} href="/">
        <h2 className={style.logo}>
          Connect
          <Image className={style.logo_icon} src={logo} alt="" />
        </h2>
      </Link>
    </div>
  </>
);

export default Header;
