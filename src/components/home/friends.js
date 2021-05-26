import React, {useState, useEffect} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import PublicRoundedIcon from '@material-ui/icons/PublicRounded';
import Badge from '@material-ui/core/Badge';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Button } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import firebase from '../../firebase'
import { Link } from 'react-router-dom';
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
    justifyContent:'center'
  },
  storyTitleText:{
    paddingLeft: 5,
    fontSize: 20,
    fontWeight: 'bold'
  },
  grid: {
    borderRadius: 30,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 50,
    paddingRight: 0,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent:'center',
    // backgroundColor: '#FCECC7',
    width: 1100,
    height: 100,
  },
  textUnderCircle: {
    paddingTop: 13,
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
const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    color: '#E4C281',
    backgroundColor: 'white'
  },
}))(Avatar);

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

export default function FriendStory(){
  const classes = useStyles();
  const [urls, setUrls] = useState([])
  const [file, setfile] = useState(null)
  const [progress, setProgress] = useState(0)
  const uid = "sample_uid"
  // const { currentUser } = useAuth();
  // const uid = currentUser.uid;
  useState(() => {
    firebase.database().ref(uid).get().then((snapshot => {
      const urls_data = snapshot.val()['friends']
      setUrls(urls_data)
    }))
  }, [])

  useEffect(() => {
      if (file == null) 
        return
      const feedkey_list = String(firebase.database().ref('/feeds/').push()).split('/')
      const feedkey = feedkey_list[feedkey_list.length -1]
      const imgref = firebase.storage().ref().child(uid).child('images').child(feedkey)
      var uploadTask = imgref.put(file)
      uploadTask.on('state_changed', function(snapshot){
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      }, function(error) {
        alert("Cannot upload!")
      }, function(){
        var currentdate = new Date();
        firebase.storage().ref().child(uid).child('images').child(feedkey).getDownloadURL().then((value) => {
          firebase.database().ref('/feeds/'+feedkey+'image').set(value)
          firebase.database().ref(uid+'/feeds/'+feedkey+"/image").set(value)
          firebase.database().ref(uid+'/feeds/'+feedkey+"/createAt").set(currentdate.toDateString())
        })
        setProgress(0)
        setfile(null)
        alert("file uploaded")
      })
  }, [file])

  const handleUploadFile = (e) => {
      const file = e.target.files[0]
      setfile(file)
  }

  return(   
    <>
      <div className = {classes.storyTitle}>
        <PublicRoundedIcon/>
        <div className = {classes.storyTitleText}>My friend's story</div>
      </div>
      <br/>
      <div style = {{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <div className = {classes.grid}>
          <Grid container className={classes.root}>
            <Grid item xs={12}>
              <Grid container justify="left" spacing={7} >
                <Grid key={0} item style={{}}>
                  <Link to='/writepost'>
                    <Button component="label">
                      {/* <input type="file" onChange={handleUploadFile} hidden/> */}
                      <Badge
                        overlap="circle"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        badgeContent={<SmallAvatar> <AddCircleIcon/> </SmallAvatar>}
                        >
                            <Avatar style={{ height: '90px', width: '90px' }} alt="" src="" />
                        </Badge>
                    </Button>
                  </Link>
                  
                  <div className = {classes.textUnderCircleAdd}>Your story</div>
                  </Grid>
                  {urls.map((value) => (
                    <Grid key={value} item>
                        <div>
                          <Avatar style={{ height: '90px', width: '90px' }} alt="" src= {value['image']} />
                        </div>
                        <div className = {classes.textUnderCircle}> {value['name']} </div>
                      </Grid>
                  ))}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.textUnderCircle}>
        { file == null ? (<div></div>) : (
          <LinearProgressWithLabel value={progress} />
        )}
      </div>
    </>
  )
}
