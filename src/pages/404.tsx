import style from '@/styles/FormBox.module.css';
import Header from '@/components/header';
import Image from 'next/image';
import logo from '@/images/link_icon_content.svg';

export default function NotFound() {
  return (
    <>
      <div className={style.container}>
        <h1>Connect
          <Image className={style.icon} src={logo} alt=""></Image>
          &nbsp;: Page Not Found
        </h1>
      </div>
    </>
  );
}

NotFound.Layout = 'LoggedOut';