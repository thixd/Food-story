import React, {useState, useEffect, Component} from 'react';
import Grid from '@material-ui/core/Grid';
import AppNavBar from '../../utils/app_bar'
import firebase from '../../firebase'
import SingleBox from './single_box.js';
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
				var HashTags = childSnapShot.val().hashtags
				console.log(HashTags); 
				HashTags = Object.values(HashTags)
				for(var i = 0; i < HashTags.length; i++){
					if(HashTags[i] == resrev.props.location.state.name)
					   ok = 1;
					console.log(HashTags[i], resrev.props.location.state.name)
				}
				console.log(childSnapShot.val().isPrivate)
				if(childSnapShot.val().isPrivate == true || ok == 0)
					return;
				cntReaction = 0
				cntComment = 0
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
					<Grid item style = {{marginLeft: 30}}>
						<p style={{ color: '#F47B0A', fontSize: 27,}} >{"Posts about " + this.props.location.state.name}</p>
					</Grid>
				</Grid>
				{this.state.finalLink}
			</>
		)
	}
	

	
}


export default RestaurantReview