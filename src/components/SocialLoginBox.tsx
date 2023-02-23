import style from '@/styles/SocialLoginBox.module.css'
import Image from 'next/image'
import fb from '@/images/fb_icon_on.svg'
import insta from '@/images/insta_icon_white_v2.svg'

const SocialBox = () => {
    return (
        <>
            <button className={style.button_social}> <Image className={style.social_icon} src={fb} alt=" "></Image> Login to Facebook</button>
            <button className={style.button_social}> <Image className={style.social_icon} src={insta} alt=" "></Image> Login to Instagram</button>
        </>
    )
};

export default SocialBox