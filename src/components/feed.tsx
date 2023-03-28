import React from "react";
import SideNav from "./SideNav";
import ConnectPost from "./ConnectPost";
import SocialPost from "./SocialPost";

export const Feed = () => {
  return (
    <>
      <div className={style.container}>
        <div className={classNames(style.column, style.left, style.centered)}>
          <h2>Social Feeds</h2>
          <p>
            <button
              className={style.button}
              title="Filter Facebook posts"
              onClick={handleClick}
            >
              <div
                className={`${style.social_icon} ${facebookStatus ? style.fb_on : style.fb_off
                  }`}
              />
            </button>
            <button
              className={style.button}
              onClick={() => {
                setInstagramStatus((prev) => !prev);
              }}
              title="Filter Instagram posts"
            >
              <div
                className={classNames(
                  style.social_icon,
                  instagramStatus ? style.insta_on : style.insta_off
                )}
              />
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
					<Comments href="http://www.facebook.com" />
				</div>
				<div className={classNames(style.column, style.right)}>
					<h2>Column 3</h2>
					<p>Some text..</p>
				</div>
			</div>
		</>
	);
}

export default Feed;
