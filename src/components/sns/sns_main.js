import React, { useState, useEffect } from 'react';
import "./sns_main.css";
import AppNavBar from '../../utils/app_bar';
import SnsNew from './components/sns_new';
import SnsFeed from './components/sns_feed';
import firebase from '../../firebase';

export default function SnsMain({history}){
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
    var Key = Object.keys(feeds), Val = Object.values(feeds);
    Key.reverse()
    Val.reverse()

    return (
        <>
            <AppNavBar/>
            <div className="sns_main">
                <SnsNew uid={uid} history={history} />
                {Key.map((feedId) => 
                    <SnsFeed feedId={feedId} feedInfo={feeds[feedId]} history={history} />
                )}
            </div>
        </>
    );
}