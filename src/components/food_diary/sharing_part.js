import React, {useState, useEffect, Component} from 'react';
import Grid from '@material-ui/core/Grid';
import AppNavBar from '../../utils/app_bar'
import firebase from '../../firebase'
import { Redirect, Link } from 'react-router-dom';

const imageBox = {
	border: 1,
	width: 790,
	height: 460,
	justifyContent: "center", 
	alignItems: "center",
	position: "relative",
	display: "flex",
	
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
	width: 690, borderRadius: 16, fontSize: 16, border: 1, borderStyle: "solid",
	backgroundColor: "#BEC3C9",
	height: 50,
	paddingLeft: 10,
}
const hashTag = {
	color: "blue",
	textDecoration: "underline",
}







var curUser = "sample_uid";


class SharingPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            image: this.props.location.state.src,
            text: "",
            user: this.props.location.state.name,
            comments: [{"name": "null", "text": "null"}],
            reaction: [{"0": "null"}],
            isPrivate: false,
            location: "Daejon",
            origin: "Korea",
            lat: 0,
            lng: 0,
            hashtags: {"0": "null"},
            time: "1min",
        }
    }
    uploadPost = (event) => {
        event.preventDefault();
        var uid = this.state.user;
        var feedkey_list = String(firebase.database().ref('Feeds/').push())
        var newHashTag = ["null"]
        var cnt = 1;
        // console.log(newHashTag)
        for(var i = 0; i < this.state.text.length ; i++) {
            if(this.state.text[i] == "#"){
                i++;
                var newStr = ""
                for(;i < this.state.text.length; i++){
                    if(this.state.text[i] == " " || this.state.text[i] == "#" || i == this.state.text.length)
                        break;
                    newStr += this.state.text[i];
                }
                i--;
                if(newStr != ""){
                    newHashTag.push(newStr);
                    cnt++;
                }
            }
        }
        console.log(newHashTag)
        // return;
        feedkey_list = feedkey_list.split('/')
        var feedKey = feedkey_list[feedkey_list.length -1]
        firebase.database().ref('Feeds/' + feedKey).child('image').set(this.state.image)
        firebase.database().ref('Feeds/' + feedKey).child('text').set(this.state.text)
        firebase.database().ref('Feeds/' + feedKey).child('user').set(this.state.user)
        firebase.database().ref('Feeds/' + feedKey).child('comments').set(this.state.comments)
        firebase.database().ref('Feeds/' + feedKey).child('reaction').set(this.state.reaction)
        firebase.database().ref('Feeds/' + feedKey).child('isPrivate').set(this.state.isPrivate)
        firebase.database().ref('Feeds/' + feedKey).child('location').set(this.state.location)
        firebase.database().ref('Feeds/' + feedKey).child('origin').set(this.state.origin)
        firebase.database().ref('Feeds/' + feedKey).child('lat').set(this.state.lat)
        firebase.database().ref('Feeds/' + feedKey).child('lng').set(this.state.lng)
        for(var i = 0; i < newHashTag.length; i++) {
            firebase.database().ref('Feeds/' + feedKey).child('hashtags').push(newHashTag[i])
        }
        firebase.database().ref('Feeds/' + feedKey).child('time').set(this.state.time)
        return <Redirect to = '/sns'/>
    }
    updatePost = (event) => {
		this.setState({text: event.target.value});
	}
	onEnterPress = (e) => {
		if(e.keyCode == 13 && e.shiftKey == false) {
		  e.preventDefault();
		  this.myFormRef.submit();
		}
	}
    render() {
        
        return(
            <>
				<AppNavBar/>
				<Grid>
					<Grid item style = {post}>
						{/*Displaying the Image of the post*/}
						<Grid container style = {displayImage} >
							<Grid item style = {imageBox}>
								<img style = {singleImage} src = {this.props.location.state.src}/>
							</Grid>		
						</Grid>
					</Grid>
                    <Grid container style = {addComment}>
                        <Grid container style = {textArea}>
                            <form onSubmit = {this.uploadPost} ref={el => this.myFormRef = el}>
                                <input id = "userInput" onChange = {this.updatePost} style = {inputTextArea}  type = "text" value = {this.state.userCmt} placeholder = "Write a public post..."/>
                                <br></br>
                                <Link to="/sns">
                                    <button type = "submit">Post</button>
                                </Link>
                            </form>
                        </Grid>
                    </Grid>
				</Grid>
			</>   
        )
    }

}


export default SharingPage;