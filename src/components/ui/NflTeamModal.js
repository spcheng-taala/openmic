import React, { Component } from 'react';
import Modal from 'react-modal';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MidTitle from './MidTitle.js';
import Button from './Button.js';
import {GridList, GridTile} from 'material-ui/GridList';
import UserManager from '../singletons/UserManager.js';
import BackendManager from '../singletons/BackendManager.js';
import Notifications, {notify} from 'react-notify-toast';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: 'auto',
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: "Lato",
    color: '#FFFFFF',
    marginRight: 16,
    textAlign: "center",
  },
  team: {
    width: 125,
    height: "auto",
    verticalAlign: "middle"
  }
}

const teams = [
  {
    id: 1,
    name: "49ers",
    logo_url: "./images/49ers.png"
  },
  {
    id: 2,
    name: "Bears",
    logo_url: "./images/bears.png"
  },
  {
    id: 3,
    name: "Bengals",
    logo_url: "./images/bengals.png"
  },
  {
    id: 4,
    name: "Bills",
    logo_url: "./images/bills.png"
  },
  {
    id: 5,
    name: "Broncos",
    logo_url: "./images/broncos.png"
  },
  {
    id: 6,
    name: "Browns",
    logo_url: "./images/browns.png"
  },
  {
    id: 7,
    name: "Buccaneers",
    logo_url: "./images/buccaneers.png"
  },
  {
    id: 8,
    name: "Cardinals",
    logo_url: "./images/cardinals.png"
  },
  {
    id: 9,
    name: "Chargers",
    logo_url: "./images/chargers.png"
  },
  {
    id: 10,
    name: "Chiefs",
    logo_url: "./images/chiefs.png"
  },
  {
    id: 11,
    name: "Colts",
    logo_url: "./images/colts.png"
  },
  {
    id: 12,
    name: "Cowboys",
    logo_url: "./images/cowboys.png"
  },
  {
    id: 13,
    name: "Dolphins",
    logo_url: "./images/dolphins.png"
  },
  {
    id: 14,
    name: "Eagles",
    logo_url: "./images/eagles.png"
  },
  {
    id: 15,
    name: "Falcons",
    logo_url: "./images/falcons.png"
  },
  {
    id: 16,
    name: "Giants",
    logo_url: "./images/giants.png"
  },
  {
    id: 17,
    name: "Jaguars",
    logo_url: "./images/jaguars.png"
  },
  {
    id: 18,
    name: "Jets",
    logo_url: "./images/jets.png"
  },
  {
    id: 19,
    name: "Lions",
    logo_url: "./images/lions.png"
  },
  {
    id: 20,
    name: "Packers",
    logo_url: "./images/packers.png"
  },
  {
    id: 21,
    name: "Panthers",
    logo_url: "./images/panthers.png"
  },
  {
    id: 22,
    name: "Patriots",
    logo_url: "./images/patriots.png"
  },
  {
    id: 23,
    name: "Raiders",
    logo_url: "./images/raiders.png"
  },
  {
    id: 24,
    name: "Rams",
    logo_url: "./images/rams.png"
  },
  {
    id: 25,
    name: "Ravens",
    logo_url: "./images/ravens.png"
  },
  {
    id: 26,
    name: "Redskins",
    logo_url: "./images/redskins.png"
  },
  {
    id: 27,
    name: "Saints",
    logo_url: "./images/saints.png"
  },
  {
    id: 28,
    name: "Seahawks",
    logo_url: "./images/seahawks.png"
  },
  {
    id: 29,
    name: "Steelers",
    logo_url: "./images/steelers.png"
  },
  {
    id: 30,
    name: "Texans",
    logo_url: "./images/texans.png"
  },
  {
    id: 31,
    name: "Titans",
    logo_url: "./images/49ers.png"
  },
  {
    id: 32,
    name: "Vikings",
    logo_url: "./images/vikings.png"
  },
]

class NflTeamModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      favoriteTeamId: 0,
    }

    this.selectTeam = this.selectTeam.bind(this);
    this.doneClicked = this.doneClicked.bind(this);
  };

  selectTeam(id) {
    console.log(id);
    this.setState({favoriteTeamId: id});
  }

  doneClicked() {
    if (this.state.favoriteTeamId == 0) {
      let myColor = { background: '#D9534F', text: "#FFFFFF" };
      notify.show("Oops! Looks like you forgot to select a team", "custom", 3000, myColor);
    }
  }

  componentDidMount() {
    if (BackendManager.isExpired()) {
      BackendManager.refreshToken()
      .then(
        BackendManager.makeQuery('http://localhost:8080/nfl-teams/all')
        .then(data => {
          this.setState({
            teams: data
          })
        })
      );
    } else {
      BackendManager.makeQuery('http://localhost:8080/nfl-teams/all')
      .then(data => {
        this.setState({
          teams: data
        })
      });
    }
  }

  render() {
		return (
      <div>
        <MidTitle midtitle={'Select your favorite team'}/>
        <MuiThemeProvider>
          <div>
            <GridList
              cellHeight={150}
              cols={4}
              style={styles.gridList}>
              {teams.map((team) => (
                <GridTile
                  key={team.id}
                  title={team.name}
                  onClick={() => this.selectTeam(team.id)}
                  titleBackground={team.id==this.state.favoriteTeamId ? 'rgba(96,106,191,0.8)':'rgba(0,0,0,0.7)'}
                  titleStyle={styles.title}
                  style={styles.gridItem}>
                    <img style={styles.team} src={team.logo_url} />
                </GridTile>
              ))}
            </GridList>
          </div>
        </MuiThemeProvider>
        <button className="button" onClick={this.doneClicked}>
          Done
        </button>

      </div>
    )
  }
}

export default NflTeamModal;
