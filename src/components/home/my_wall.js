import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import firebase from '../../firebase'
import { useAuth } from '../../contexts/auth_context'
import { Button } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  storyTitle:{
    paddingLeft: 30,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent:'center',
    fontWeight: 'bold'
  },
  storyTitleText:{
    paddingLeft:5,
    fontSize: 20,
  },
  grid: {
    borderRadius: 40,
    paddingTop: 50,
    paddingBottom: 130,
    paddingLeft: 30,
    paddingRight: 0,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent:'center',
    backgroundColor: '#FCECC7',
    width: 1100,
    height: 500,
  },
  textUnderCircle: {
    paddingTop: 7,
    display: 'flex',  
    justifyContent:'center', 
    alignItems:'center'
  },
  textUnderCircleAdd: {
    display: 'flex',  
    justifyContent:'center', 
    alignItems:'center'
  }
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

export default function MyWall(){
  const uid = "sample_uid"
  const classes = useStyles()
  const [urls, setUrls] = useState([])
  const [file, setfile] = useState(null)
  const [progress, setProgress] = useState(0)
  var white_plate = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fwhite_plate.jpg?alt=media&token=4ab38285-4bd3-4ce9-84b8-2c27f295afcc"
  // const { currentUser } = useAuth();
  // const uid = currentUser.uid;
  useEffect(() => {
    firebase.database().ref(uid).on('value', snapshot => {
      const urls_data = Object.keys(snapshot.val()['feeds']).map((key) =>{
          return [snapshot.val()['feeds'][key], key]
      })
      while(urls_data.length < 17){
        urls_data.push(null)
      }
      setUrls(urls_data)
    })
  }, [])
  
  console.log(urls.length)
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
        setUrls([])
        alert("Image has successfully uploaded!")
      })
  }, [file])

  const handleUploadFile = (e) => {
      const file = e.target.files[0]
      setfile(file)
  }

  return(   
    <>
      <div className = {classes.storyTitle}>
        <LockRoundedIcon/>
        <div className = {classes.storyTitleText}>Recent my food diary</div>
        
      </div>
      <br/>
      <div style = {{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <div className = {classes.grid}>
          <Grid container className={classes.root}>
            <Grid item xs={12}>
              <Grid container justify="left" spacing={7} >
                  <Grid key={0} item style={{}}>
                    <Button component="label" style = {{paddingLeft: 18}}>
                      <input type="file" onChange={handleUploadFile} hidden/>
                      <Avatar style={{ height: '90px', width: '90px', backgroundColor: '#E4C281'}}>
                        <AddAPhotoIcon />
                      </Avatar>
                    </Button>
                    <div className = {classes.textUnderCircleAdd} >Add diary</div>
                  </Grid>
                  {urls.map((value) => (
                    <Grid key={value} item>
                       { value === null ? 
                        (
                          <Grid item>
                            <div style = {{display: 'flex',  justifyContent:'center', alignItems:'center', paddingLeft: 15, paddingRight: 15}}>
                              <Avatar style={{ height: '100px', width: '100px' }} alt="" src= {white_plate}/>
                            </div>
                          </Grid>
                        ) 
                        : 
                        (
                          <Grid item>
                          <div className= {classes.textUnderCircle}>
                            <Avatar style={{ height: '90px', width: '90px' }} alt="" src= {value[0]['image']}/>
                          </div>
                          <div className = {classes.textUnderCircle}> {value[0]['createAt']} </div>
                          </Grid>
                        )
                       }
                    </Grid> 
                    ))}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
      <br/>
      <div className={classes.textUnderCircle}>
        { file == null ? (<div></div>) : (
          <LinearProgressWithLabel value={progress} />
        )}
      </div>
    </>
  )
}
