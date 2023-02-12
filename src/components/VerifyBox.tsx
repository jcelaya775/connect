import loginstyle from '@/styles/FormBox.module.css'
import Image from "next/image";
import logo from '@/images/link_icon_content.svg'

const VerifyBox = () => (
    <div className={loginstyle.container}>
            <form action="#" method="post">
                <h1>Connect
                    <Image className={loginstyle.icon} src={logo} alt=""></Image>
                </h1>
                <h3 className={loginstyle.tagline}>
                    The Social Media Hub
                </h3>
                <p className={loginstyle.message}>
                    To complete registration enter your email address and verification code.
                </p>
                <input className={loginstyle.forminput} type="text" placeholder="Email Address"/><br />
                <input className={loginstyle.forminput} type="text" placeholder="Verification Code"/><br />
                <button className={loginstyle.button}>
                    Verify Account
                </button>
            </form>
        </div>
);

export default VerifyBox