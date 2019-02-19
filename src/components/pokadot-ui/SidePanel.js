import React from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import SvgIcon from '@material-ui/core/SvgIcon';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

const drawerWidth = 240;

const panelStyle = {
  backgroundColor : '#6068C1'
}

const titleStyle = {
  fontFamily: "Lato",
  fontSize: 30,
  fontWeight: "bold",
}

const labelStyle = {
  fontFamily: "Lato",
  fontSize: 17,
}

const dateStyle = {
  fontFamily: "Lato",
  fontSize: 40,
  color: "#707070",
  fontWeight: "bold",
}

const destinationStyle = {
  color: "#808080",
  fontFamily: "Lato",
  fontSize: 25,
}

const timeStyle = {
  color: "#D2D2D2",
  fontFamily: "Lato",
  fontSize: 20,
}

const rightStyle = {
  paddingLeft: 40,
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  flex: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  card: {
    maxWidth: 745,
  },
  media: {
    ...theme.mixins.gutters(),
    paddingTop: 70,
    paddingBottom: 70,
    width: 300,
    backgroundColor: '#3BCEAC'
  },
  mediaText: {
    align: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: "Lato",
    fontSize: 30,
  }
});

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

function CalendarIcon(props) {
  return(
    <SvgIcon {...props}>
      <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
    </SvgIcon>
  )
}

function HistoryIcon(props) {
  return(
    <SvgIcon {...props}>
      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
    </SvgIcon>
  )
}

function ProfileIcon(props) {
  return(
    <SvgIcon {...props}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </SvgIcon>
  )
}

function MessageIcon(props) {
  return(
    <SvgIcon {...props}>
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </SvgIcon>
  )
}

function MoneyIcon(props) {
  return(
    <SvgIcon {...props}>
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
    </SvgIcon>
  )
}

function SettingsIcon(props) {
  return(
    <SvgIcon {...props}>
      <path d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
    </SvgIcon>
  )
}

function HelpIcon(props) {
  return(
    <SvgIcon {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
    </SvgIcon>
  )
}

class SidePanel extends React.Component {
  render() {
    const { classes } = this.props;
    const content = this.props.content;

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap style={titleStyle} className={classes.flex}>
              Pokadot
            </Typography>
            <Button className={'button'} onClick={() => this.props.history.push('/scheduler')}>Calendar</Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem button onClick={() => this.props.history.push('/schedule')}>
              <ListItemIcon>
                <CalendarIcon className={classes.icon} color="primaty" />
              </ListItemIcon>
              <ListItemText disableTypography primary={<Typography style={labelStyle}>My Schedule</Typography>}/>
            </ListItem>
            <ListItem button onClick={() => this.props.history.push('/profile')}>
              <ListItemIcon>
                <ProfileIcon className={classes.icon} color="primary" />
              </ListItemIcon>
              <ListItemText disableTypography primary={<Typography style={labelStyle}>Profile</Typography>}/>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <HistoryIcon className={classes.icon} color="primary" />
              </ListItemIcon>
              <ListItemText disableTypography primary={<Typography style={labelStyle}>History</Typography>}/>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <MessageIcon className={classes.icon} color="primary" />
              </ListItemIcon>
              <ListItemText disableTypography primary={<Typography style={labelStyle}>Messages</Typography>}/>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <MoneyIcon className={classes.icon} color="primary" />
              </ListItemIcon>
              <ListItemText disableTypography primary={<Typography style={labelStyle}>Earnings</Typography>}/>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon className={classes.icon} color="secondary" />
              </ListItemIcon>
              <ListItemText disableTypography primary={<Typography style={labelStyle}>Settings</Typography>}/>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <HelpIcon className={classes.icon} color="secondary" />
              </ListItemIcon>
              <ListItemText disableTypography primary={<Typography style={labelStyle}>Help</Typography>}/>
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {content}
        </main>
      </div>
    );
  }
}

SidePanel.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.element.isRequired
};

const SidePanelRouter = withRouter(SidePanel)

export default withStyles(styles)(SidePanelRouter);
