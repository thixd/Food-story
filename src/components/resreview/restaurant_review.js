import React, {useState, useEffect, Component} from 'react';
import Grid from '@material-ui/core/Grid';
import SingleBox from './single_box.js';
import AppNavBar from '../../utils/app_bar'
import firebase from '../../firebase'
// import { HeaderBackButton } from 'react-navigation';
const singleRow = {
	height: 350,
	marginLeft: 100,
	// marginLeft: 27,
	marginBottom: 20,
	align: "center",
	justifyContent: "center",
	alignItems: "center",
	alignContent: "center",
	position: "relative",
	display: "flex",
}

var lstLink = [];
var newLink = [];
const db = firebase.database();
var finalLink = [];


class RestaurantReview extends Component{
	constructor(props){
		super(props)
		this.state = {
			getData: false
		}
	}
	crawlData = () => {
		firebase.database().ref("Feeds").once('value').then((snapshot) => {
			var cnt = 0
			snapshot.forEach(function(childSnapShot){
				lstLink.push({'val' : childSnapShot.val(), 'key': cnt, 'feedKey': childSnapShot.key});
				cnt ++;
			});
			// console.log('this ->', lstLink)
			newLink = lstLink.map(link => <SingleBox key = {link.key} BoxProps = {link}/>)
			for(var index = 0; index < lstLink.length; index++) {
				var tmpLink = []
				tmpLink.push(newLink[index]);
				index++;
				if(index < lstLink.length){
					tmpLink.push(newLink[index]);
				}
				index++;
				if(index < lstLink.length){
					tmpLink.push(newLink[index]);
				}
				finalLink.push(tmpLink);
			}
			// console.log('this is the previous version of final link ', finalLink)
			finalLink = finalLink.map(row => <Grid container style = {singleRow}> {row}</Grid>)
			// console.log('this is final link', finalLink)
			this.setState((prevState) => ({getData: true}));
		});
	}

	render() {
		if(this.state.getData == false) {
			// console.log('cac')
			this.crawlData()
		}
		// console.log('caca',finalLink)
		return (
			<>
				<AppNavBar />
				<Grid container>
					<p>{this.props.name}</p>
				</Grid>
				{finalLink}
			</>
		)
	}
	

	
}

export default RestaurantReview