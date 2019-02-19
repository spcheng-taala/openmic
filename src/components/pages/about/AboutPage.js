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

const aboutText = "Founded in 2008, Airbnb exists to create a world where anyone can belong anywhere, providing healthy travel that is local, authentic, diverse, inclusive and sustainable. Airbnb uniquely leverages technology to economically empower millions of people around the world to unlock and monetize their spaces, passions and talents to become hospitality entrepreneurs. Airbnb’s accommodation marketplace provides access to 5+ million unique places to stay in more than 81,000 cities and 191 countries. With Experiences, Airbnb offers unprecedented access to local communities and interests through 15,000+ unique, handcrafted activities run by hosts across 1,000+ markets around the world. Airbnb’s people-to-people platform benefits all its stakeholders, including hosts, guests, employees and the communities in which it operates."

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

class AboutPage extends Component {

  render() {
    const { classes } = this.props;
		return (
      <div className="landing-page">
        <div className="about-bg">
          <Header
            title={"About Us"} subtitle={""}
          />
          <MidTitle midtitle={aboutText}/>
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

export default AboutPage;
