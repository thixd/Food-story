import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import PublicRoundedIcon from '@material-ui/icons/PublicRounded';
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
  username: {
    textAlign: 'center',
  },
  storyTitle:{
    paddingLeft: 30,
    fontSize: 22,
  }
}));

export default function FriendStory(){
  const classes = useStyles();
  return(   
    <>
      <div className = {classes.storyTitle}>
        <PublicRoundedIcon/>
        My friends' food stories
      </div>
      <br/>  
      <Grid container className={classes.root} spacing={2} style = {{paddingLeft: 30}}>
        <Grid item xs={12}>
          <Grid container justify="left" spacing={8}>
            {[0, 1, 2, 3].map((value) => (
              <Grid key={value} item>
                <div>
                  <Avatar style={{ height: '70px', width: '70px' }} alt="Remy Sharp" src="" />
                  <div className = {classes.username}> username </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}


