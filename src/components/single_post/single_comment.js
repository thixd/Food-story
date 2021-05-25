import React, {useState, useEffect, Component} from 'react'
import AppNavBar from '../../utils/app_bar'
import Grid from '@material-ui/core/Grid';
import firebase from '../../firebase'
import { InfoOutlined, VisibilityRounded } from '@material-ui/icons';

/* --------------------------------------- Style ----------------------------------------*/
const singleComment = {
    border: 1,
	borderColor: "black",
	borderStyle: "solid",
	borderRadius: 16,
	width: 580,
	position: "relative",
	paddingLeft: 10,
	paddingRight: 10,
	paddingBottom: 10,
    
}
const displayText = {
	// marginLeft: 50,
    justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	align: "center",
    marginBottom: 5,
}
/* --------------------------------------- Style ----------------------------------------*/
var ava;
ava = <img width = {30} height = {30} src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fdefault_profile.jpg?alt=media&token=723ea738-6941-41c1-8a1d-4f26b1dbb88c'></img>

function SingleComment(props) {
    return(
        <Grid container style = {displayText}>
            {/* {localState.comments} */}
            <div style = {singleComment}>
                <Grid container><p>{ava}</p><p style = {{marginLeft: 10}}>{props.name}</p></Grid>
                <Grid container >
                    <Grid items md = {12} style = {{overflowWrap: 'break-word',}}>
                        <p style = {{margin: 0}}>{props.text}</p>
                    </Grid>
                </Grid>
            </div>
        </Grid>
    )
}

export default SingleComment;