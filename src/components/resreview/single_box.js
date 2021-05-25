import React, {useState, useEffect, Component} from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useHistory, withRouter } from 'react-router-dom';

const singleBox = {
	border: 1,
	borderColor: "black",
	borderStyle: "solid",
	borderRadius: 16,
	width: 450,
	height: 300,
	align: "center",
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	display: "flex",
}
const GridCell = {
	align: "center",
	justifyContent: "center", 
	alignItems: "center",
	position: "absolute",
	display: "flex",
}
const singleImage = {
	height: '100%',
	width: '100%',
	borderRadius:16,
	position: "relative"
}
const userDisplay = {
	border: 1,
	borderBottomColor: "white",
	borderStyle: "solid",
	borderRadius: 16,
	width: 450,
	height: 60,
	bottom: 0,
	margin: 0,
	align: "center",
	position: "absolute",
	backgroundColor: "white"
}

function SingleBox(props){
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
			<div onClick = {moveToSinglePost}>
				<Grid style = {singleBox}>
					<img style = {singleImage} src = {props.BoxProps.val.image} />
					<p  style = {userDisplay}> {props.BoxProps.val.user}</p>
				</Grid>
			</div>
		</Grid>
	)    
}

export default SingleBox;