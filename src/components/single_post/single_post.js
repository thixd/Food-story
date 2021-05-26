import React, {useState, useEffect, Component} from 'react'
import AppNavBar from '../../utils/app_bar'
import Grid from '@material-ui/core/Grid';
import firebase from '../../firebase'
import SingleComment from './single_comment'
import { useHistory, withRouter } from 'react-router-dom';
import { useAuth } from '../../contexts/auth_context'
/* --------------------------------------- Style ----------------------------------------*/
const imageBox = {
	border: 1,
	width: 790,
	height: 460,
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	display: "flex",
	overflow: "hidden"
}
const textBox = {
	width: 600,
	// justifyContent: "center", 
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	align: "center",
	overflowWrap: 'break-word',
}
const displayImage = {
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	align: "center",
	marginTop: 75,
	marginBottom:70,
}
const displayUser = {
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	align: "center",
	// marginLeft: 50,
	margin: 0,
}
const infoUser = {
	width: 600,
	position: "relative",
}
const singleImage = {
	height: '100%',
	width: 'auto',
	position: "relative",
	boxShadow: "2px 3px 1px #9E9E9E"
}
const post = {
	align: 'center',
	margin: 'auto',
}
const displayText = {
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	align: "center",
	marginBottom: 50
}
const textArea = {
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	align: "center",

}
const addComment = {
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	align: "center",
	// marginLeft: 50,
	margin: 0,

}
const inputTextArea = {
	width: 590, borderRadius: 16, fontSize: 16, border: 1, borderStyle: "solid",
	backgroundColor: "#BEC3C9",
	height: 50,
	paddingLeft: 10,
}
const hashTag = {
	color: "blue",
	textDecoration: "underline",
}
/* --------------------------------------- Style ----------------------------------------*/


function HashTags(props) {
	let history = useHistory();
	function movetoResReview() {
		history.push({
			pathname: "/restaurant-review",
			state: props
		})
	}
	return(
		<div onClick = {movetoResReview}><a style = {hashTag}>{"#" + props.name}</a></div>
	)
}

// export default HashTags;
//TODO: need to change curUser

var pending = "Write a public comment...";
var unliked, liked, icnComment;
var ava;
// const { currentUser } = useAuth();
var curUser = "sample_uid";
ava = <img width = {30} height = {30} src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fdefault_profile.jpg?alt=media&token=723ea738-6941-41c1-8a1d-4f26b1dbb88c'></img>
liked = <img  width =  {20}  height = {20}  src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Flike_icon_new.png?alt=media&token=0caa33ca-f069-4a37-a405-5aad7d86b5b6'/>;
icnComment = <img width =  {20}  height = {20} src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fcomment_icon_new.png?alt=media&token=bb9deb74-7333-49c5-ac5b-5652a2976973'/>;
unliked = <img  width =  {20}  height = {20}  src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Funliked.png?alt=media&token=5d66e3b6-13c5-4fcd-83c7-67a8f26d3166' />;
class SinglePostView extends Component{

	constructor(props) {
		super(props)
		console.log(this.props)
		this.state = {
			BoxProps: this.props.location.state.BoxProps,
			getData: false,
			reaction: [],
			comments: [],
			reacted: 0,
			userCmt: "",
			hashtag: [],
			time: "",
			location: "",
		}
	}
	crawlData = () => {
		var post = this;
		firebase.database().ref("Feeds/" + post.state.BoxProps.feedKey).once('value').then((snapshot) => {
			post.setState({reaction: snapshot.val().reaction});
			post.setState({time: snapshot.val().time})
			post.setState({location: snapshot.val().location})
			firebase.database().ref("Feeds/" + post.state.BoxProps.feedKey + "/comments").once('value').then((cmtSnapShot) => {
				var newComments = [];
				cmtSnapShot.forEach((childSnapShot) => {
					//this.state.comments.push({'key': childSnapShot.key, 'val': childSnapShot.val()})
					newComments.push({'key': childSnapShot.key, 'val': childSnapShot.val()})
				});
				newComments.reverse();
				newComments.pop();
				newComments = newComments.map(comment => <SingleComment key = {comment.key} name = {comment.val.name} text = {comment.val.text}/>)
				post.setState({comments: newComments})
			});
			post.setState({getData :true});
			firebase.database().ref("Feeds/" + post.state.BoxProps.feedKey + "/reaction").once('value').then((reactionSnapShot) => {
				var newReaction = []
				reactionSnapShot.forEach((childSnapShot) =>{
					if(curUser == childSnapShot.val()) {
						this.setState({reacted: 1});
					}
					newReaction.push(childSnapShot.val());
				});
				post.setState({reaction: newReaction});
			});
			var newHashtags = []
			// console.log(snapshot.child('hashtags').val())
			var cnt = 0
			snapshot.child('hashtags').forEach((childSnapShot) =>{
				cnt++
				if(cnt==1)
					return;
				newHashtags.push(childSnapShot.val());
			});
			console.log(newHashtags)
			newHashtags = newHashtags.map(hashtag => <HashTags name = {hashtag}/>)
			post.setState({hashtags: newHashtags});
		});
	} 
	updateReaction = () => {
		var newReaction = [];
		if(this.state.reacted == "0"){
			newReaction = this.state.reaction.slice();
			newReaction.push(curUser);
			firebase.database().ref("Feeds/" + this.state.BoxProps.feedKey + "/reaction").push(curUser).then((snapshot) =>{
				this.setState({reaction: newReaction, reacted: 1 - this.state.reacted})
			});
		}
		else{
			newReaction = [];
			for(var i = 0; i < this.state.reaction.length; i++){
				if(this.state.reaction[i] == curUser){
					continue;
				}
				else{
					newReaction.push(this.state.reaction[i]);
				}
			}
			firebase.database().ref("Feeds/" + this.state.BoxProps.feedKey + "/reaction").once('value').then((snapshot) => {
				snapshot.forEach((childSnapShot) => {
					if(childSnapShot.val() == curUser){
						firebase.database().ref("Feeds/" + this.state.BoxProps.feedKey + "/reaction/" + childSnapShot.key).remove();
					}
				});
				this.setState({reaction: newReaction, reacted: 1 - this.state.reacted})
			});
			
		}
		
	}

	addComment = (event) => {
		event.preventDefault();
		firebase.database().ref("Feeds/" + this.state.BoxProps.feedKey + "/comments").push({
			'name': curUser,
			'text': this.state.userCmt
		}).then(() => {
			var newComment = this.state.comments.slice();
			firebase.database().ref("Feeds/" + this.state.BoxProps.feedKey + "/comments").orderByKey().limitToLast(1).once("value").then((childSnapShot) => {
				newComment.reverse();
				childSnapShot.forEach((grandSnapShot)=>{
					newComment.push(<SingleComment key = {grandSnapShot.key} name = {grandSnapShot.val().name} text = {grandSnapShot.val().text}/>)
					// console.log(grandSnapShot.key, grandSnapShot.val())
				})
				newComment.reverse()
				this.setState({userCmt: "",comments: newComment})
			})
		})


		
		
		// this.userInput.value = ""
	}
	updateComment = (event) => {
		this.setState({userCmt: event.target.value});
	}
	onEnterPress = (e) => {
		if(e.keyCode == 13 && e.shiftKey == false) {
		  e.preventDefault();
		  this.myFormRef.submit();
		}
	}
	render(){
		// console.log(this.state.hashtags);
		if(this.state.getData == false) {		
			this.crawlData()
		}
		var localState = this.state;
		return (
			<>
				<AppNavBar/>
				<Grid>
					<Grid item style = {post}>
						{/*Displaying the Image of the post*/}
						<Grid container style = {displayImage} >
							<Grid item style = {imageBox}>
								<img style = {singleImage} src = {localState.BoxProps.val.image}/>
							</Grid>		
						</Grid>
						{/*Displayign user ID, reaction count, comment count*/}
						<Grid container style = {displayUser}>
							<Grid container style = {infoUser}>
								<Grid item md = {1}> <div>{ava}</div></Grid>
								<Grid item md = {8}>
									 <div><p style = {{margin: 0, fontWeight: "bold", fontSize: 18}}>{localState.BoxProps.val.user}</p></div> 
									 <div>{this.state.time + ", " + this.state.location}</div>
								</Grid>
								<Grid item> <div>{localState.reaction.length - 1}</div></Grid>
								<Grid item md = {1} style = {{marginLeft: 10}}> <div  onClick = {this.updateReaction}>
									{localState.reacted == 1 ? liked : unliked}
								</div></Grid>
								<Grid item> <div>{localState.comments.length}</div> </Grid>
								<Grid item md = {1} style = {{marginLeft: 10}}> <div>{icnComment}</div> </Grid>
							</Grid>
						</Grid>
						<hr/>
						{/*Displaying text from the user*/}
						<Grid container style = {displayText}>
							<Grid item style = {textBox}>
								<p>{localState.BoxProps.val.text}</p>
							</Grid>
						</Grid>
						{/*Displaying hashtag from the user*/}
						<Grid container style = {displayText}>
							<Grid item style = {textBox}>
							<p style = {{fontWeight: "bold"}}>Hashtags</p>
								<p>{localState.hashtags}</p>
							</Grid>
						</Grid>

						{/*Displaying comment text box*/}
						<Grid container style = {addComment}>
							<Grid container style = {textArea}>
							    <form onSubmit = {this.addComment} ref={el => this.myFormRef = el}>
									<input id = "userInput" onChange = {this.updateComment} style = {inputTextArea}  type = "text" value = {this.state.userCmt} placeholder = "Write a public comment..."/>
									{/* <button type = "submit">Write</button> */}
								</form>
							</Grid>
						</Grid>
						<br></br>
						
						
						{/*Displaying comment from users*/}
						{localState.comments}
					</Grid>
				</Grid>
			</>
		)
	}
}

export default SinglePostView