import loginstyle from '@/styles/FormBox.module.css'
import Image from "next/image";
import logo from '@/images/link_icon_content.svg'
import Link from 'next/link'

const login_box = () => (
    <div className={loginstyle.container}>
            <form action="#" method="post">
                <h1>Connect
                    <Image className={loginstyle.icon} src={logo} alt=""></Image>
                </h1>
                <h3 className={loginstyle.tagline}>
                    The Social Media Hub
                </h3>
                <input className={loginstyle.forminput} type="text" placeholder="Email Address"/><br />
                <input className={loginstyle.forminput} type="password" placeholder="Password"/>
                <p className={loginstyle.message}>
                    <Link href="#">
                        Forgot Password
                    </Link>
                </p>
                <button className={loginstyle.button}>
                    Login
                </button>
                <Link href="/signup">
                    <button className={loginstyle.button}>
                        Sign Up
                    </button>
                </Link>
            </form>
        </div>
);

export default login_box