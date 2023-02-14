import style from '@/styles/Feed.module.css'
import classNames from 'classNames'
import { useState } from 'react'

export default function Feed () {

const [facebook, setFacebook] = useState(false)
const [instagram, setInstagram] = useState(false)
const [tiktok, setTikTok] = useState(false)
const [twitter, setTwitter] = useState(false)

    return (
        <>
        <div className={style.container}>
            <div className={classNames(style.column, style.left, style.centered)}>
                <h2>Social Feeds</h2>
                <p>
                    <button className={style.button}
                        onClick={() => {setFacebook(prev => !prev)}}
                        title="Filter Facebook posts">
                            <div className={classNames(style.social_icon, facebook ? style.fb_on : style.fb_off)} />
                    </button>
                    <button className={style.button}
                        onClick={() => {setInstagram(prev => !prev)}}
                        title="Filter Instagram posts">
                            <div className={classNames(style.social_icon, instagram ? style.insta_on : style.insta_off)} />
                    </button>
                    {/* <button className={style.button}
                        onClick={() => {setTikTok(prev => !prev)}}>
                            <div className={classNames(style.social_icon, tiktok ? style.tik_on : style.tik_off)} />
                    </button>
                    <button className={style.button}
                        onClick={() => {setTwitter(prev => !prev)}}>
                            <div className={classNames(style.social_icon, twitter ? style.twit_on : style.twit_off)} />
                    </button> */}
                </p>
            </div>
            <div className={classNames(style.column, style.center)}>
                <h2>Column 2</h2>
                <p>Some text..</p>
            </div>
            <div className={classNames(style.column, style.right)}>
                <h2>Column 3</h2>
                <p>Some text..</p>
            </div>
        </div>
        </>
    )
}