import React, { useState, useEffect } from 'react';
import "./sns_main.css";
import AppNavBar from '../../utils/app_bar';
import SnsNew from './components/sns_new';
import SnsFeed from './components/sns_feed';
import firebase from '../../firebase';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

export default function SnsMain({history}){
    // feeds info
    const [feeds, setFeeds] = useState([]);
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    // my info
    const uid = "sample_uid";

    useEffect(() => {
        console.log("useEffect");
        
        // visibility of scroll-to-top
        window.addEventListener("scroll", setVisibilityScrollToTop);
        
        // get feeds
        var feedsRef = firebase.database().ref("Feeds");
        feedsRef.on("value", (snapshot) => {
            setFeeds(snapshot.val());
        });
    }, []);
    var Key = Object.keys(feeds), Val = Object.values(feeds);
    Key.reverse()
    Val.reverse()

    function setVisibilityScrollToTop() {
        // set visibility according to height
        if(window.pageYOffset > 500) {
            setShowScrollToTop(true);
        } else {
            setShowScrollToTop(false);
        }
    }

    function scrollToTop() {
        // scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <>
            <AppNavBar/>
            <div className="sns_main">
                <SnsNew uid={uid} history={history} />
                {Key.map((feedId) => 
                    <SnsFeed key={feedId} feedId={feedId} feedInfo={feeds[feedId]} history={history} />
                )}
                <label className={showScrollToTop ? "sns_scroll_to_top_enabled" : "sns_scroll_to_top_disabled"}
                    for="sns_scroll_to_top" >
                    <ArrowUpwardIcon className="sns_arrow_up_icon" />
                    TOP
                </label>
                <input id="sns_scroll_to_top" 
                    className="sns_scroll_to_top"
                    type="button" 
                    onClick={scrollToTop} />
            </div>
        </>
    );
}