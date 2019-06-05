import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import BackendManager from '../../singletons/BackendManager.js';


const styles = theme => ({
  root: {
    marginTop: 20,
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
    width: 300,
  },
  paperMobile: {
    textAlign: 'center',
    width: 125,
  },
})

const nameText = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'center',
  padding: 20,
  fontSize: 20,
}

const nameTextMobile = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'center',
  padding: 10,
  fontSize: 17,
}

class StoriesPage extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('scroll', this.onScroll, false);
    this.resize();
    BackendManager.makeQuery('public/stories/feed', JSON.stringify({}))
    .then(data => {
      if (data.success) {
        this.setState({
          podcasts: data.stories,
        });
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  resize() {
    if (window.innerWidth <= 760) {
      this.setState({
        isMobile: true,
      });
    } else {
      this.setState({
        isMobile: false,
      })
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      isMobile: false,
      podcasts: [],
    };

    this.renderGrid = this.renderGrid.bind(this);
    this.renderGridItem = this.renderGridItem.bind(this);
  }

  renderGridItem(item) {
    const { classes } = this.props;
    if (this.state.isMobile) {
      return (
        <div style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/story/' + item.id)}>
          <Grid item style={{margin: 10}}>
            <Paper className={classes.paperMobile}>
              <div style={{width: 125, height: 125, overflow: 'hidden'}}>
                <img style={{width: 125, height: 125, objectFit: 'cover', borderRadius: '5px 5px 0px 0px'}} src={item.profile_picture}/>
              </div>
              <Typography style={nameTextMobile}>
                {item.title}
              </Typography>
            </Paper>
          </Grid>
        </div>
      )
    } else {
      return (
        <div style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/story/' + item.id)}>
          <Grid item style={{margin: 20}}>
            <Paper className={classes.paper}>
              <div style={{width: 300, height: 300, overflow: 'hidden'}}>
                <img style={{width: 300, height: 300, objectFit: 'cover', borderRadius: '5px 5px 0px 0px'}} src={item.profile_picture}/>
              </div>
              <Typography style={nameText}>
                {item.title}
              </Typography>
            </Paper>
          </Grid>
        </div>
      );
    }
  }

  renderGrid() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          {this.state.podcasts.map((item) => {
            return (this.renderGridItem(item))
          })}
        </Grid>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        {this.renderGrid()}
      </div>
    )
  }
}

export default withStyles(styles)(StoriesPage);
