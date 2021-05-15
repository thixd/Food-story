import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    color: '#F47B0A',
    fontSize: 27,
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
          <Link to="/home" style={{ textDecoration: 'none', flexGrow: 1}}>
            <Typography variant="h6" className={classes.title}>
              Food story
            </Typography>
          </Link>

          <Link to="/home" style={{ textDecoration: 'none'}}>
            <Typography variant="h6" className={classes.titleItem}>
              Home
            </Typography>
          </Link>

          <Link to="/diary" style={{ textDecoration: 'none'}}>
            <Typography variant="h6" className={classes.titleItem}>
              Food diary
            </Typography>
          </Link>

          <Link to="/sns" style={{ textDecoration: 'none'}}>
            <Typography variant="h6" className={classes.titleItem}>
              Social Media
            </Typography>
          </Link>

          <Link to="/user" style={{ textDecoration: 'none'}}>
            <IconButton> 
              <Avatar alt="Remy Sharp" src="https://img-premium.flaticon.com/png/512/236/236831.png?token=exp=1621060191~hmac=921d3a4cda5180a6a4463e3cd05eb691" />
            </IconButton>
          </Link>

        </Toolbar>
      </AppBar>
    </div>
  );
}
