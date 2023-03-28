import React from 'react'
import ProfilePage from '@/components/profile-page'
import { MyPage } from "../components/types";
import exp from 'constants';


const Profile: MyPage = () => {
  return (
    <>
      <ProfilePage />
    </>
  )
};

export default Profile;
Profile.Layout = "LoggedIn"