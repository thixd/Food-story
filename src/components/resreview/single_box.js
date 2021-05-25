import React, {useState, useEffect, Component} from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useHistory, withRouter } from 'react-router-dom';
import firebase from '../../firebase'

/* --------------------------------------- Style ----------------------------------------*/
const singleBox = {
	border: 1,
	borderRadius: 16,
	width: 450,
	height: 300,
	align: "center",
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	display: "flex",
	boxShadow: "2px 2px 1px #9E9E9E",
}
const GridCell = {
	// direction:"column",
	justify: "center",
	position: "relative",
	display: "flex",
}
const singleImage = {
	height: '100%',
	width: '100%',
	borderRadius:16,
	position: "relative"
}
const userBox = {
	border: 1,

	borderRadius: 16,
	width: 450,
	height: 60,
	bottom: 0,
	margin: 0,
	// align: "left",
	textAlign: 'left',
	position: "absolute",
	backgroundColor: "white"
}
const userDisplay = {
	// position: "relative",
	margin: 0,
	marginLeft: 10
}
const ftDisplay = {
	marginLeft: 10,

}
/* --------------------------------------- Style ----------------------------------------*/
var icnLiked, icnComment;
icnLiked = <img  width =  {20}  height = {20}  src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Flike_icon_new.png?alt=media&token=0caa33ca-f069-4a37-a405-5aad7d86b5b6'/>;
icnComment = <img width =  {20}  height = {20} src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fcomment_icon_new.png?alt=media&token=bb9deb74-7333-49c5-ac5b-5652a2976973'/>;
var ava;
ava = <img width = {20} height = {20} src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fdefault_profile.jpg?alt=media&token=723ea738-6941-41c1-8a1d-4f26b1dbb88c'></img>

function SingleBox(props){
	var cntReaction = 0, cntComment = 0;
	const [getData, getDataState] = useState(0);
	let history = useHistory();
	function moveToSinglePost() {
		history.push({
			pathname: "/single-post",
			state: props
		})
	}
	return(
		// <></>
		<Grid item md = {4} css = {GridCell}>
			<div onClick = {moveToSinglePost} align = "center">
				<Grid style = {singleBox}>
					<img style = {singleImage} src = {props.BoxProps.val.image} />
					<div style = {userBox}>
						<Grid container style = {{paddingLeft: 10, paddingTop: 5}}>
							{ava}
							<p style = {userDisplay}>{props.BoxProps.val.user} </p>
						 </Grid>
						 <Grid container width = {100} height = {20}>
						 	 <Grid item style = {ftDisplay}> {props.BoxProps.cntReaction - 1}</Grid>
							 <Grid item style = {ftDisplay}> {icnLiked}</Grid>
							 <Grid item style = {ftDisplay}> {props.BoxProps.cntComment -1}</Grid>
							 <Grid item style = {ftDisplay}> {icnComment}</Grid>
						 </Grid>
					</div>
				</Grid>
			</div>
		</Grid>
	)    
}

export default SingleBox;