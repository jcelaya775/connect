import React from 'react';
import ProfilePage from '@/components/profile-page';
import { MyPage } from "../components/types";
import exp from 'constants';


export default function Profile() {
  return (
    <>
      <ProfilePage />
    </>
  );
};

Profile.Layout = "LoggedIn";