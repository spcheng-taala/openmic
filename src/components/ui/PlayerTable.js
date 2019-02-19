import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const style = {
  fontFamily: "Lato",
}

const nameStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'normal',
}

const plusStyle = {
  color: '#57BE91',
  fontSize: 20,
}

const closeStyle = {
  color: '#e74c3c',
  fontSize: 20,
}

var freeAgents = [
  {
    name: 'Kirk Cousins',
    faType: 'UFA',
    estCapHit: 24000000,
  },
  {
    name: 'Sam Bradford',
    faType: 'UFA',
    estCapHit: 17500000,
  },
  {
    name: 'Jay Cutler',
    faType: 'UFA',
    estCapHit: 10000000,
  },
  {
    name: 'Josh McCown',
    faType: 'UFA',
    estCapHit: 6000000,
  },
  {
    name: 'Chad Henne',
    faType: 'UFA',
    estCapHit: 3500000,
  },
  {
    name: 'Drew Stanton',
    faType: 'UFA',
    estCapHit: 3250000,
  }
];

var currentRoster = [
  {
    name: 'Trevor Siemian',
    yearsLeft: 1,
    estCapHit: 705000,
  },
  {
    name: 'Paxton Lynch',
    yearsLeft: 3,
    estCapHit: 1311482,
  },
  {
    name: 'Chad Kelly',
    yearsLeft: 3,
    estCapHit: 555000,
  },
]

var qbDraft = [
  {
    name: 'Josh Rosen',
    school: 'UCLA',
    estRound: '1',
  },
  {
    name: 'Sam Darnold',
    school: 'USC',
    estRound: '1',
  },
  {
    name: 'Baker Mayfield',
    school: 'Oklahoma',
    estRound: '1',
  },
  {
    name: 'Lamar Jackson',
    school: 'Louiseville',
    estRound: '1',
  },
  {
    name: 'Josh Allen',
    school: 'Wyoming',
    estRound: '1-2',
  },
]

var draft = [
  {
    name: 'Saquon Barkley',
    team: 'CLE',
    pick: 1,
    position: 'RB',
  }
]

var drafted = [
  {
    name: 'Quenton Nelson',
    team: 'DEN',
    pick: 4,
    position: 'OG',
  }
]

var roster = [
  {
    first: 'Trevor Siemian',
    second: 'Paxton Lynch',
    third: 'Chad Kelly',
    position: 'QB',
  },
  {
    first: 'CJ Anderson',
    second: 'Jamaal Charles',
    third: 'DeVontae Booker',
    position: 'RB',
  }
]

class PlayerTable extends Component {
  constructor(props) {
    super(props);

    this.getInfoTable = this.getInfoTable.bind(this);
  }

  getInfoTable() {
    if (this.props.tableType == 0) {
      return this.props.data.map( (row, index) => (
        <TableRow style={style} key={index}>
          <TableRowColumn style={nameStyle}>{row.first_name + ' ' + row.last_name}</TableRowColumn>
          <TableRowColumn>{row.type}</TableRowColumn>
          <TableRowColumn>{'$' + row.est_cap_hit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</TableRowColumn>
          <TableRowColumn style={plusStyle}>+</TableRowColumn>
        </TableRow>
      ));
    } else if (this.props.tableType == 1) {
      return this.props.data.map( (row, index) => (
        <TableRow style={style} key={index}>
          <TableRowColumn style={nameStyle}>{row.first_name + ' ' + row.last_name}</TableRowColumn>
          <TableRowColumn>{row.years_remaining}</TableRowColumn>
          <TableRowColumn>{'$' + row.est_cap_hit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</TableRowColumn>
          <TableRowColumn style={closeStyle}>x</TableRowColumn>
        </TableRow>
      ));
    } else if (this.props.tableType == 2) {
      return this.props.data.map( (row, index) => (
        <TableRow style={style} key={index}>
          <TableRowColumn style={nameStyle}>{row.first_name + ' ' + row.last_name}</TableRowColumn>
          <TableRowColumn>{row.position}</TableRowColumn>
          <TableRowColumn>{row.estRound}</TableRowColumn>
          <TableRowColumn style={plusStyle}>+</TableRowColumn>
        </TableRow>
      ));
    } else if (this.props.tableType == 3) {
      return this.props.data.map( (row, index) => (
        <TableRow style={style} key={index}>
          <TableRowColumn>{row.pick}</TableRowColumn>
          <TableRowColumn>{row.team}</TableRowColumn>
          <TableRowColumn>{row.position}</TableRowColumn>
          <TableRowColumn style={nameStyle}>{row.first_name + ' ' + row.last_name}</TableRowColumn>
        </TableRow>
      ));
    } else if (this.props.tableType == 4) {
      return this.props.data.map( (row, index) => (
        <TableRow style={style} key={index}>
          <TableRowColumn>{row.pick}</TableRowColumn>
          <TableRowColumn>{row.team}</TableRowColumn>
          <TableRowColumn>{row.position}</TableRowColumn>
          <TableRowColumn style={nameStyle}>{row.first_name + ' ' + row.last_name}</TableRowColumn>
        </TableRow>
      ));
    } else if (this.props.tableType == 5) {
      return this.props.data.map( (row, index) => (
        <TableRow style={style} key={index}>
          <TableRowColumn>{row.position.toUpperCase()}</TableRowColumn>
          <TableRowColumn style={nameStyle}>{row.first_name + ' ' + row.last_name}</TableRowColumn>
          <TableRowColumn style={nameStyle}>{row.years_remaining}</TableRowColumn>
          <TableRowColumn style={nameStyle}>{'$' + row.est_cap_hit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</TableRowColumn>
        </TableRow>
      ));
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <Table height='300px' onCellClick={row => this.props.deleteRow(this.props.tableType, row)}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow style={style}>
              <TableHeaderColumn>{this.props.row0}</TableHeaderColumn>
              <TableHeaderColumn>{this.props.row1}</TableHeaderColumn>
              <TableHeaderColumn>{this.props.row2}</TableHeaderColumn>
              <TableHeaderColumn>{this.props.row3}</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.getInfoTable()}
          </TableBody>
        </Table>
      </MuiThemeProvider>
    )
  }
}

export default PlayerTable;
