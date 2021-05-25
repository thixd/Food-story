import React, {useState, useEffect, Component} from 'react';
import Grid from '@material-ui/core/Grid';
import SingleBox from './single_box.js';
import AppNavBar from '../../utils/app_bar'
import firebase from '../../firebase'
import { useLocation, withRouter } from 'react-router-dom';
/* --------------------------------------- Style ----------------------------------------*/
const singleRow = {
	height: 350,
	// marginLeft: 20, 
	// marginLeft: 27,
	marginBottom: 20,
	align: "center",
	justifyContent: "center",
	alignItems: "center",
	alignContent: "center",
	position: "relative",
	display: "flex",
}
/* --------------------------------------- Style ----------------------------------------*/


class RestaurantReview extends Component{
	constructor(props){
		console.log(props);
		super(props)
		this.state = {
			finalLink: [],
			lstLink: [],
			newLink: [],
			getData: false,
		}
	}
	crawlData = () => {
		firebase.database().ref("Feeds").once('value').then((snapshot) => {
			var newFinalLink = [];
			var cnt = 0
			var cntReaction = 0;
			var cntComment = 0;
			var newListLink = []
			var resrev = this;
			console.log(resrev)
			snapshot.forEach(function(childSnapShot){  //iterating each feed in the type props.name
				var ok = 0
				var lll = 0;
				childSnapShot.val().hashtags.forEach((hashtags) => {
					lll += 1
					if(hashtags == resrev.props.location.state.name){
						ok = 1;
					}
				});
				if(ok == 0)
					return;
				cntReaction = 0
				cntComment = 0
				// cntComment = childSnapShot.val().comments.length
				// console.log(childSnapShot.val().comments/)
				childSnapShot.forEach((grandSnapShot) =>{ //iterating each parameter of a single feed
					if(grandSnapShot.key == "reaction"){
						grandSnapShot.forEach((grateGrandChildSnapShot)=>{
							cntReaction +=1;
						})
					}
					if(grandSnapShot.key == "comments"){
						grandSnapShot.forEach((grateGrandChildSnapShot)=>{
							cntComment +=1;
						})
					}
				});
				cnt ++;
				newListLink.push({'val' : childSnapShot.val(), 'key': childSnapShot.key, 'feedKey': childSnapShot.key, 'cntReaction': cntReaction, 'cntComment': cntComment});
			});
			newListLink = newListLink.map(link => <SingleBox key = {link.key} BoxProps = {link} cntReaction = {cntReaction} cntComment = {cntComment}/>)
			for(var index = 0; index < newListLink.length; index++) {
				var tmpLink = []
				tmpLink.push(newListLink[index]);
				index++;
				if(index < newListLink.length){
					tmpLink.push(newListLink[index]);
				}
				index++;
				if(index < newListLink.length){
					tmpLink.push(newListLink[index]);
				}
				newFinalLink.push(tmpLink);
			}
			newFinalLink = newFinalLink.map(row => <Grid container style = {singleRow}> {row}</Grid>)
			this.setState({finalLink: newFinalLink,lstLink: newListLink,getData: true})
			
		});
	}

	render() {
		if(this.state.getData == false) {
			this.crawlData();
		}
		return (
			<>
				<AppNavBar />
				<Grid container>
					<Grid item md = {1} style = {{marginLeft: 30}}>
						<p style={{ color: '#F47B0A', fontSize: 27,}} >{this.props.location.state.name}</p>
					</Grid>
				</Grid>
				{this.state.finalLink}
			</>
		)
	}
	

	
}


export default RestaurantReview