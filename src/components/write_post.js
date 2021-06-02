import React, {useState, useEffect, Component} from 'react'
import AppNavBar from '../utils/app_bar'
import firebase from '../firebase'
import { useHistory, withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MUIRichTextEditor from 'mui-rte'
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
  imageBox: {
    border: 1,
    width: 790,
    height: 460,
    justifyContent: "center", 
    alignItems: "center",
    position: "relative",
    display: "flex",
  }, 
  textBox : {
    width: 600,
    // justifyContent: "center", 
    justifyContent: "center", 
    alignItems: "center",
    position: "relative",
    align: "center",
    overflowWrap: 'break-word',
  },
  displayImage : {
    justifyContent: "center", 
    alignItems: "center",
    position: "relative",
    align: "center",
    marginTop: 50,
    marginBottom:50,
  },
  displayUser : {
    justifyContent: "left", 
    alignItems: "left",
    position: "relative",
    align: "center",
    // marginLeft: 50,
    margin: 0,
  },
  infoUser : {
    width: 600,
    position: "relative",
  },
  singleImage : {
    height: '100%',
    width: 'auto',
    position: "relative",
    // boxShadow: "2px 3px 1px #9E9E9E"
  },
  post : {
    align: 'center',
    margin: 'auto',
  },
  displayText : {
    justifyContent: "center", 
    alignItems: "center",
    position: "relative",
    align: "center",
    marginBottom: 50
  },
  textArea : {
    justifyContent: "center", 
    alignItems: "center",
    position: "relative",
    align: "center",
  
  },
  inputTextArea : {
    width: 590, borderRadius: 16, fontSize: 16, border: 1, borderStyle: "solid",
    backgroundColor: "#BEC3C9",
    height: 50,
    paddingLeft: 10,
  },
  hashTag : {
    color: "blue",
    textDecoration: "underline",
  },
  grid: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    width: 800,
    height: 1300,
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
    paddingLeft:50,
    paddingRight: 50,
  },
}));


export default function WritePost(props){
  console.log(props.location.state.src);
  const uid = 'Foodie'
  var ava = <img width = {30} height = {30} src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fdefault_profile.jpg?alt=media&token=723ea738-6941-41c1-8a1d-4f26b1dbb88c'></img>
  const classes = useStyles();
  var date = new Date().toDateString();
  const [value, setValue] = useState('')
  const [file, setfile] = useState(null);
  const [progress, setProgress] = useState(0)
  const [getData, setGetData] = useState(null)
  const onRTEChange = event => {
    const plainText = event.getCurrentContent().getPlainText()
    setValue(plainText) // store your rteContent to state
  }
  var history = useHistory();
  var url = null;
  var white_plate = props.location.state.src == null ? "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2F41743.jpg?alt=media&token=a149adac-57e7-4a82-afa4-19af9ffa65f6" : props.location.state.src;

  function handleSubmit(){
      var info = {
        image: props.location.state.src == null ? file : props.location.state.src ,
        text: value,
        user: uid,
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
    var newHashTags = ["null"];
    for(var i = 0; i < info.text.length; i++) {
      if(info.text[i] == "#"){
        i++;
        var singleHashTag = "";
        while(true){
          if(info.text[i] == " " || info.text[i] == "#" || i == info.text.length){
              break;
          }
          singleHashTag += info.text[i];
          i++
        }
        i--;
        newHashTags.push(singleHashTag);
      }
    }
    var feedkey_list = String(firebase.database().ref('Feeds/').push())
    feedkey_list = feedkey_list.split('/')
    var feedKey = feedkey_list[feedkey_list.length -1]
    firebase.database().ref('Feeds/' + feedKey).child('image').set(info.image)
    firebase.database().ref('Feeds/' + feedKey).child('text').set(value)
    firebase.database().ref('Feeds/' + feedKey).child('user').set(uid)
    firebase.database().ref('Feeds/' + feedKey).child('comments').set(info.comments)
    firebase.database().ref('Feeds/' + feedKey).child('reaction').set(info.reaction)
    firebase.database().ref('Feeds/' + feedKey).child('isPrivate').set(info.isPrivate)
    firebase.database().ref('Feeds/' + feedKey).child('location').set(info.location)
    firebase.database().ref('Feeds/' + feedKey).child('origin').set(info.origin)
    firebase.database().ref('Feeds/' + feedKey).child('lat').set(info.lat)
    firebase.database().ref('Feeds/' + feedKey).child('lng').set(info.lng)
    firebase.database().ref('Feeds/' + feedKey).child('hashtags').set(newHashTags)
    history.push("/sns");
  }
  console.log(value)
  useEffect(() => {
    console.log(file, getData)
    if (file == null || getData == 1) 
      return
    const feedkey_list = String(firebase.database().ref('/feeds/').push()).split('/')
    const feedkey = feedkey_list[feedkey_list.length -1]
    const imgref = firebase.storage().ref().child(uid).child('images').child(feedkey)
    var uploadTask = imgref.put(file)
    uploadTask.on('state_changed', function(snapshot){
      var curProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(curProgress);
      setProgress(curProgress);
    }, function(error) {
      alert("Cannot upload!")
    }, function(){
      var currentdate = new Date();
      firebase.storage().ref().child(uid).child('images').child(feedkey).getDownloadURL().then((value) => {
        firebase.database().ref('/feeds/'+feedkey+'/image').set(value)
        firebase.database().ref(uid+'/feeds/'+feedkey+"/image").set(value)
        firebase.database().ref(uid+'/feeds/'+feedkey+"/createAt").set(currentdate.toDateString())
        firebase.database().ref(uid+'/feeds/'+feedkey+"/origin").set("Korea")
        firebase.database().ref(uid+'/feeds/'+feedkey+"/location").set("Daejeon")
        //auto position
        firebase.database().ref(uid+'/locations/Daejeon/'+feedkey).set(value)
        console.log(value);
        setGetData(value)
        console.log(url)
        // setGetData(1)
      })
    })
}, [file])

const handleUploadFile = (e) => {
    const file = e.target.files[0]
    setfile(file)
}
  return(
    <>
      <AppNavBar/>
      {/* <div style = {{display: 'flex',  justifyContent:'center', alignItems:'center', paddingTop: 30, borderStyle:'solid'}}> */}
      <div style = {{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
      <div className = {classes.grid}>
          <Grid>
              <Grid item className={classes.post}>
                {/*Displaying the Image of the post*/}
                <Grid container className={classes.displayImage}>
                  <Grid item className={classes.imageBox}>
                    {file == null 
                      ? 
                        (
                            <Button component="label" style = {{width: 400, height: 400, borderRadius: 50}}>
                              <input type="file" onChange={handleUploadFile} hidden/>
                              <img  style = {{width: 400, height: 400, position: "relative",}} src = {white_plate}/>
                            </Button>
                        )
                      : 
                        (<img className={classes.singleImage} src = {getData}/>) 
                    }
                  </Grid>
                </Grid>
                {/*Displayign user ID, reaction count, comment count*/}
                <Grid container className={classes.displayUser}>
                  <Grid container className={classes.infoUser}>
                    <Grid item md = {1}> <div>{ava}</div></Grid>
                    <Grid item md = {8}>
                      <div><p style = {{margin: 0, fontWeight: "bold", fontSize: 18}}>Foodie</p></div> 
                      <div>{ date}, Daejeon</div>
                    </Grid>
                  </Grid>
                </Grid>
                <hr/>
                <MUIRichTextEditor
                  label="Type to start sharing ..."
                  controls={['title', 'bold', 'italic']}
                  onChange={onRTEChange}
                />,
              </Grid>
              <div style ={{paddingTop: 50}}> 
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  // color="primary"
                  className={classes.submit}
                  onClick = {handleSubmit}
                  style = {{color: 'white', background: '#F47B0A'}}
                >Share</Button>
              </div>
              
            </Grid>
        </div>
    </div>
      
    </>
  )
}