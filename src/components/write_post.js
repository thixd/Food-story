import React, {useState, useEffect, Component} from 'react'
import AppNavBar from '../utils/app_bar'
import firebase from '../firebase'
import { useHistory, withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MUIRichTextEditor from 'mui-rte'
import Button from '@material-ui/core/Button';
import { convertToRaw } from 'draft-js'
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

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
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent:'center',
    // backgroundColor: '#FCECC7',
    // alignItems:'center',
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

function LinearProgressWithLabel(props) {
  return (
    <Box style = {{width : 1050}} display="flex" justifyContent="center">
      <Box width="100%" mr={1}>
        <LinearProgress 
          variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function WritePost(){
  const uid = 'sample uid'
  var ava = <img width = {30} height = {30} src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fdefault_profile.jpg?alt=media&token=723ea738-6941-41c1-8a1d-4f26b1dbb88c'></img>
  const classes = useStyles();
  var date = new Date().toDateString();
  const [value, setValue] = useState('')
  const [file, setfile] = useState(null)
  const [progress, setProgress] = useState(0)
  const onRTEChange = event => {
    const plainText = event.getCurrentContent().getPlainText()
    setValue(plainText) // store your rteContent to state
  }
  var white_plate = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2F41743.jpg?alt=media&token=a149adac-57e7-4a82-afa4-19af9ffa65f6"

  function handleSubmit(){

  }
  console.log(value)
  useEffect(() => {
    if (file == null) 
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
        firebase.database().ref('/feeds/'+feedkey+'image').set(value)
        firebase.database().ref(uid+'/feeds/'+feedkey+"/image").set(value)
        firebase.database().ref(uid+'/feeds/'+feedkey+"/createAt").set(currentdate.toDateString())
        firebase.database().ref(uid+'/feeds/'+feedkey+"/origin").set("Korea")
        firebase.database().ref(uid+'/feeds/'+feedkey+"/location").set("Daejeon")
        //auto position
        firebase.database().ref(uid+'/locations/Daejeon/'+feedkey).set(value)
      })
      setProgress(0)
      setfile(null)
      alert("Image has successfully uploaded!")
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
                            <Button component="label">
                              <input type="file" onChange={handleUploadFile} hidden/>
                              <img className={classes.singleImage} src = {white_plate}/>
                            </Button>
                          //    <Button component="label" style = {{paddingLeft: 18}}>
                          //    <input type="file" onChange={handleUploadFile} hidden/>
                          //    <Avatar style={{ height: '90px', width: '90px', backgroundColor: '#E4C281'}}>
                          //      <AddAPhotoIcon />
                          //    </Avatar>
                          //  </Button>
                        )
                      : 
                        (<img className={classes.singleImage} src = {file}/>) 
                    }
                  </Grid>
                  <div className={classes.textUnderCircle}>
                    { file == null ? (<div></div>) : (
                      <LinearProgressWithLabel value={progress} />
                    )}
                  </div>		
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