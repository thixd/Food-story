import React, { useState, useEffect } from 'react';
import "./sns_main.css";
import AppNavBar from '../../utils/app_bar';
import SnsNew from './components/sns_new';
import SnsFeed from './components/sns_feed';
import firebase from '../../firebase';

export default function SnsMain(){
    // feeds info
    const [feeds, setFeeds] = useState([]);

    // my info
    const uid = "sample_uid";

    useEffect(() => {
        console.log("useEffect");
        var feedsRef = firebase.database().ref("Feeds");
        feedsRef.on("value", (snapshot) => {
            setFeeds(snapshot.val());
        });
    }, []);

    return (
        <>
            <AppNavBar/>
            <div className="sns_main">
                <SnsNew uid={uid} />
                {Object.keys(feeds).map((feedId) => 
                    <SnsFeed feedId={feedId} feedInfo={feeds[feedId]} />
                )}
            </div>
        </>
    );
}