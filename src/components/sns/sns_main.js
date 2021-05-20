import React from 'react';
import "./sns_main.css";
import AppNavBar from '../../utils/app_bar';
import SnsFeed from './components/sns_feed';

export default function SnsMain(){
    return (
        <>
            <AppNavBar/>
            <div div className="sns_main">
                <SnsFeed feed={{}} />
                <SnsFeed feed={{}} />
            </div>
        </>
    );
}