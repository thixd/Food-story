import React, {useState, useEffect, Component} from 'react'
import AppNavBar from '../utils/app_bar'
import firebase from '../firebase'
import { useHistory, withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MUIRichTextEditor from 'mui-rte'
import Button from '@material-ui/core/Button';
import { convertToRaw } from 'draft-js'

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
    boxShadow: "2px 3px 1px #9E9E9E"
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

export default function WritePost(){
  var ava = <img width = {30} height = {30} src = 'https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fdefault_profile.jpg?alt=media&token=723ea738-6941-41c1-8a1d-4f26b1dbb88c'></img>
  const classes = useStyles();
  var date = new Date().toDateString();
  const [value, setValue] = useState('')
  const onRTEChange = event => {
    const plainText = event.getCurrentContent().getPlainText() // for plain text
    const rteContent = convertToRaw(event.getCurrentContent()) // for rte content with text formating
    setValue(plainText) // store your rteContent to state
  }
  console.log(value)
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
                    <img className={classes.singleImage} src = "https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"/>
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
            </Grid>
        </div>
      </div>
      
    </>
  )
}