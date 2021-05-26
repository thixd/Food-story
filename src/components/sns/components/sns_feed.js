import React, { useState, useEffect } from "react";
import "./sns_feed.css";
import firebase from "../../../firebase";
import { useHistory, withRouter } from 'react-router-dom';

const hashTag = {
	color: "blue",
	textDecoration: "underline",
}

function HashTags(props) {
	let history = useHistory();
	function movetoResReview() {
		history.push({
			pathname: "/restaurant-review",
			state: props
		})
	}
	return(
		<div onClick = {movetoResReview}><a style = {hashTag}>{"#" + props.name}</a></div>
	)
}

var curUser = "sample_uid";

export default function SnsFeed({history, feedId, feedInfo}){
  // Whether range dropdown is opened
  const [rangeOpened, setRangeOpened] = useState(false);

  // Data
  const [feed, setFeed] = useState(Object.assign({
    comments: [], 
    hashtags: [], 
    image: "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Ffeed_image.png?alt=media&token=89d471dd-382f-460f-8046-c42affa0f40a", 
    lat: 0, 
    lng: 0, 
    location: "", 
    origin: "", 
    reaction: [], 
    text: "", 
    user: "sample_uid", 
    time: "1min", 
    isPrivate: true
  }, feedInfo));
  const [author, setAuthor] = useState({
    profile: 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fdefault_profile.jpg?alt=media&token=723ea738-6941-41c1-8a1d-4f26b1dbb88c',
    nickname: "sample_uid"
  });
  // console.log("this", author)
  // Snapshot setting
  useEffect(() => {
    firebase.database().ref("Feeds/" + feedId).on("value", (snapshot) => {
      setFeed((f) => Object.assign({}, f, snapshot.val()));
    });
  }, []);

  // Load user data
  useEffect(() => {
    firebase.database().ref(feed.user).get().then((snapshot) => {
      if(snapshot.exists()) {
        var authorVal = snapshot.val();
        console.log(authorVal.profile, authorVal.nickname);
        // setAuthor.setState({profile: authorVal.profile, nickname: authorVal.nickname})
        setAuthor(aut => Object.assign({}, aut, { 
          profile: authorVal.profile, 
          nickname: authorVal.nickname 
        }));
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    console.log(feed);
  }, [feed ]);

  // range handler
  function rangeChangeHandler(newRange) {
    // local change
    var newFeed = Object.assign({}, feed, { isPrivate: newRange }); 
    setFeed(newFeed);
    setRangeOpened(!rangeOpened);
    
    // firebase change
    var updates = {};
    updates["Feeds/" + feedId] = newFeed;
    firebase.database().ref().update(updates);
  }

  // reaction handler
  function reactionHandler() {
    // add if not reacted, and remove if reacted
    var reactionKey = Object.keys(feed.reaction).find((r) => feed.reaction[r] === author.nickname);
    if(reactionKey !== undefined) {
      // remove
      firebase.database().ref("Feeds/" + feedId + "/reaction/" + reactionKey).remove();
    } else {
      // add
      firebase.database().ref("Feeds/" + feedId + "/reaction").push(author.nickname);
    }
  }
  // comments handler
  function commentsHandler() {
    history.push({
      pathname: "/single-post", 
      state: {
        BoxProps: {
          feedKey: feedId, 
          val: feed
        }
      }
    });
  }
  // Other images
  const privateIcon = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fprivate_icon.png?alt=media&token=57b523de-f0ae-4877-ae30-5d5374d16cc3";
  const publicIcon = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fpublic_icon.png?alt=media&token=4eb66ae0-36b3-4708-a42e-cad5ed2b32d8";
  const likeIcon = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Flike_icon.png?alt=media&token=9bfe50a4-9d15-4be4-bbca-6a13f920f8af";
  const commentIcon = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fcomment_icon.png?alt=media&token=d47b813b-60c8-4fc2-8e16-aa2798f39fb4";
  // var hashTag = feed.hashtags
  var hashTag = Object.values(feed.hashtags)
  hashTag.reverse()
  hashTag.pop()
  hashTag.reverse()
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
              {feed.user}
            </span>
            <span className="feed_info_time">
              {feed.time}, {feed.origin} food at {feed.location}
            </span>
          </div>
        </div>
        {
          feed.user == curUser
          ? (
            <div className="feed_range">
              {feed.isPrivate === true ? (
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
                    onClick={() => rangeChangeHandler(true)} >
                    <img className="feed_range_image" 
                      src={privateIcon}
                      alt="private"
                    />
                    <span>Private</span>
                  </div>
                  <div className="feed_range_option"
                    onClick={() => rangeChangeHandler(false)} >
                    <img className="feed_range_image" 
                      src={publicIcon}
                      alt="public"
                    />
                    <span>Public</span>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null
        }
      </div>
      <img className="feed_image" 
        src={feed.image}
        alt="feed"
      />
      <span className="feed_text">
        {feed.text}
      </span>
      <div className="feed_reaction">
        <div className={Object.values(feed.reaction).find((v) => v === author.nickname) ? "feed_reaction_like_enabled" : "feed_reaction_like_disabled"}
          onClick={() => reactionHandler()}>
          <span className="feed_reaction_like">{Object.keys(feed.reaction).length - 1}</span>
          <img className="feed_reaction_like_image" 
            src={likeIcon}
            alt="like"
          />
        </div>
        <div className="feed_reaction_comment_container"
          onClick={() => commentsHandler()}>
          <span className="feed_reaction_comment">{Object.keys(feed.comments).length - 1}</span>
          <img className="feed_reaction_comment_image" 
            src={commentIcon}
            alt="comment"
          />
        </div>
        
      </div>
      <span className="feed_hashtags" style = {{marginTop: 0}}>
        { hashTag.map((hashtag) => 
          <HashTags name = {hashtag}/>
        ) }
      </span>
    </div>
  );
}