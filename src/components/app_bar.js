import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: '#F47B0A',
    fontSize: 30
  },
  titleItem:{
    color: 'black',
    padding: 20
  }
}));

export default function AppNavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static"  style={{ background: 'transparent'}} >
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color='black' aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Food story
          </Typography>
          <Typography variant="h6" className={classes.titleItem}>
            Food diary
          </Typography>
          <Typography variant="h6" className={classes.titleItem}>
            Social Media
          </Typography>
          <IconButton> 
            <AccountCircleRoundedIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
