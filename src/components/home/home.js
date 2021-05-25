import React from 'react';
import AppNavBar from '../../utils/app_bar'
import FriendStory from './friends';
import MyWall from './my_wall'
import { useAuth } from '../../contexts/auth_context'
export default function HomePage(){
  const { currentUser } = useAuth();
  // console.log(currentUser.uid);
  // const uid = currentUser.uid
  return(
    <>
      <AppNavBar/>
      <br/>
      <FriendStory/>
      <div style={{paddingTop: 50}}/>
      <MyWall/>
      <br/>
    </>
  )
}
