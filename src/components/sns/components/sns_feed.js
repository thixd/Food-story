import React, { useState, useEffect } from "react";
import "./sns_feed.css";

export default function SnsFeed({feed}){
  // Whether range dropdown is opened
  const [rangeOpened, setRangeOpened] = useState(false);

  // Data
  const [feedInfo, setFeedInfo] = useState(feed);

  // Default feed data
  const defaultFeed = {
    profile: "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fdefault_profile.jpg?alt=media&token=723ea738-6941-41c1-8a1d-4f26b1dbb88c",
    nickname: "author",
    time: "1min",
    isPrivate: true,
    image: "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Ffeed_image.png?alt=media&token=89d471dd-382f-460f-8046-c42affa0f40a", 
    like: 105,
    comment: 142,
    hashtag: "#hashtag1 #hashtag2 #hashtag3"
  };

  // Other images
  const privateIcon = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fprivate_icon.png?alt=media&token=57b523de-f0ae-4877-ae30-5d5374d16cc3";
  const publicIcon = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fpublic_icon.png?alt=media&token=4eb66ae0-36b3-4708-a42e-cad5ed2b32d8";
  const likeIcon = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Flike_icon.png?alt=media&token=9bfe50a4-9d15-4be4-bbca-6a13f920f8af";
  const commentIcon = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fcomment_icon.png?alt=media&token=d47b813b-60c8-4fc2-8e16-aa2798f39fb4";

  useEffect(() => {
    console.log("rangeOpened");
    console.log(rangeOpened);
    console.log("feedInfo");
    console.log(feedInfo);
  }, [feedInfo]);

  return (
    <div className="feed">
      <div className="feed_header">
        <div className="feed_info">
          <img className="feed_info_image" 
            src={feedInfo.profile ? feedInfo.profile : defaultFeed.profile}
            alt="profile"
          />
          <div className="feed_info_text">
            <span className="feed_info_author">
              {feedInfo.nickname ? feedInfo.nickname : defaultFeed.nickname}
            </span>
            <span className="feed_info_time">
              {feedInfo.time ? feedInfo.time : defaultFeed.time}
            </span>
          </div>
        </div>
        <div className="feed_range">
          {(feedInfo.isPrivate !== undefined ? feedInfo.isPrivate : defaultFeed.isPrivate) ? (
            <div className="feed_range_selected"
              onClick={() => setRangeOpened(!rangeOpened)} >
              <img className="feed_range_image" 
                src={privateIcon}
                alt="private"
              />
              <span>Private</span>
              <span>{rangeOpened ? "▲" : "▼"}</span>
            </div>
          ) : (
            <div className="feed_range_selected"
              onClick={() => setRangeOpened(!rangeOpened)} >
              <img className="feed_range_image" 
                src={publicIcon}
                alt="public"
              />
              <span>Public</span>
              <span>{rangeOpened ? "▲" : "▼"}</span>
            </div>
          )}
          {rangeOpened ? (
            <div className="feed_range_option_list">
              <div className="feed_range_option"
                onClick={() => {setRangeOpened(!rangeOpened); var newFeed = Object.assign({}, feedInfo); newFeed.isPrivate = true; setFeedInfo(newFeed)}} >
                <img className="feed_range_image" 
                  src={privateIcon}
                  alt="private"
                />
                <span>Private</span>
              </div>
              <div className="feed_range_option"
                onClick={() => {setRangeOpened(!rangeOpened); var newFeed = Object.assign({}, feedInfo); newFeed.isPrivate = false; setFeedInfo(newFeed)}} >
                <img className="feed_range_image" 
                  src={publicIcon}
                  alt="public"
                />
                <span>Public</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <img className="feed_image" 
        src={feedInfo.image ? feedInfo.image : defaultFeed.image}
        alt="feed"
      />
      <div className="feed_reaction">
        <span className="feed_reaction_like">105</span>
        <img className="feed_reaction_like_image" 
          src={likeIcon}
          alt="like"
        />
        <span className="feed_reaction_comment">142</span>
        <img className="feed_reaction_comment_image" 
          src={commentIcon}
          alt="comment"
        />
      </div>
      <span className="feed_hashtag">
        {feedInfo.hashtag ? feedInfo.hashtag : defaultFeed.hashtag}
      </span>
    </div>
  );
}