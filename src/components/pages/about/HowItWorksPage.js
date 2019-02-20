import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Header from '../../ui/Header.js';
import MidTitle from '../../ui/MidTitle.js';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';

const tileData = [
    {
      img: './images/sean.jpg',
      title: 'Sean Cheng',
    },
    {
      img: './images/houston.jpg',
      title: 'Houston Downes',
    },
    {
      img: './images/moki.jpg',
      title: 'Moki',
    },
 ];

 const root = {
   paddingTop: 30,
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'space-around',
   overflow: 'hidden',
 }

 const gridList = {
   width: 500,
   height: 450,
 }

 const icon = {
   color: 'rgba(255, 255, 255, 0.54)'
 }

class HowItWorksPage extends Component {

  render() {
    const { classes } = this.props;
		return (
      <div className="landing-page">
        <div className="about-bg">
          <Header
            title={"How It Works"} subtitle={""}
          />
          <MidTitle midtitle={"Our app and website are a blend of produced content and off-the-cuff clips recorded directly into our app. We have everything from podcasts to comedy bits to individual stories."}/>
          <MidTitle midtitle={"Most importantly, we make it easy to give creators cash tips their work, discover new content through our short-form audio discover page, and get social through comments and sharing."}/>
          <MidTitle midtitle={"We want to be the best platform available for content creators. Whether you’re new to audio or a professional podcaster, we want to make your posts easy monetize and discover."}/>
          <MidTitle midtitle={"And we want to create the best audio experience for listeners in the process."}/>
          <Header
            title={"Who We Are"} subtitle={""}
          />
          <div style={root}>
            <GridList cellHeight={180} style={gridList} cols={3}>
              {tileData.map(tile => (
                <GridListTile key={tile.img}>
                  <img src={tile.img} alt={tile.title} />
                  <GridListTileBar
                    title={tile.title}
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </div>
      </div>
    )
  }
}

export default HowItWorksPage;
