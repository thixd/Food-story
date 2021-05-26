import React, { useState, useEffect } from "react";
import "./sns_feed.css";
import "./sns_new.css";
import firebase from "../../../firebase";
import WritePost from "../../write_post";

export default function SnsNew({history, uid}){
  const [author, setAuthor] = useState({});

  // Load my info
  useEffect(() => {
    firebase.database().ref(uid).on("value", (snapshot) => {
      setAuthor((aut) => Object.assign({}, aut, snapshot.val()));
    });
  }, []);

  // share handler
  function shareHandler() {
    return <WritePost/>
  }

  return (
    <div className="feed">
      <div className="feed_header">
        <div className="feed_info">
          <img className="feed_info_image" 
            src={author.profile}
            alt="profile"
          />
          <div className="feed_info_text">
            <span className="feed_info_author">
              {uid}
            </span>
            <span className="feed_info_time">
              now, here
            </span>
          </div>
        </div>
      </div>
      <span className="feed_blank"
        onClick={() => shareHandler()}>
        + Share your food!
      </span>      
    </div>
  );
}