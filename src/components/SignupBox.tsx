import loginstyle from '@/styles/FormBox.module.css'
import Image from "next/image";
import logo from '@/images/link_icon_content.svg'
import Link from 'next/link'

const LoginBox = () => (
    <div className={loginstyle.container}>
            <form action="#" method="post">
                <h1>Connect
                    <Image className={loginstyle.icon} src={logo} alt=""></Image>
                </h1>
                <h3 className={loginstyle.tagline}>
                    The Social Media Hub
                </h3>
                <input className={loginstyle.forminput} type="text" placeholder="First Name"/><br />
                <input className={loginstyle.forminput} type="text" placeholder="Last Name"/><br />
                <input className={loginstyle.forminput} type="text" placeholder="Email Address"/><br />
                <input className={loginstyle.forminput} type="password" placeholder="Password"/><br />
                <input className={loginstyle.forminput} type="password" placeholder="Confirm Password"/>
                <p className={loginstyle.message}>
                    Already have an account?&nbsp;
                    <strong>
                        <Link href="/login">
                            Login
                        </Link>
                    </strong>
                </p>
                <Link href="#">
                    <button className={loginstyle.button}>
                        Sign Up
                    </button>
                </Link>
            </form>
        </div>
);

export default LoginBox