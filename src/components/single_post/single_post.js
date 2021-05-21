import React, {useState, useEffect, Component} from 'react'
import AppNavBar from '../../utils/app_bar'
import Grid from '@material-ui/core/Grid';
import { render } from '@testing-library/react';
import { useLocation, withRouter } from 'react-router-dom';
const imageBox = {
	border: 1,
	borderColor: "black",
	borderStyle: "solid",
	borderRadius: 16,
	width: 600,
	height: 300,
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	display: "flex",
}
const textBox = {
	width: 850,
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	display: "flex",
}

const displayImage = {
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	align: "center",
	marginTop: 75,
	marginBottom:70,
}
const singleImage = {
	height: '100%',
	width: '100%',
	borderRadius:16,
	position: "relative"
}

const post = {
	align: 'center',
	margin: 'auto',
}
const displayText = {
	marginLeft: 50,
}



function SinglePostView(){
	// var postProps = 
	let location = useLocation()
	// console.log(location.state.BoxProps)
	const props = location.state.BoxProps
	console.log(props)
	return (
		<>
			<AppNavBar/>
			<Grid>
				<Grid item md = {6} style = {post}>
					<Grid container style = {displayImage} >
						<Grid item style = {imageBox}>
							<img style = {singleImage} src = {props.val.image}/>
						</Grid>		
					</Grid>
					<p>{props.val.user}</p>
					<Grid container style = {displayText}>
						<Grid item style = {textBox}>
							<p>{props.val.text}</p>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default SinglePostView