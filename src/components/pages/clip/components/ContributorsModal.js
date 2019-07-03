import React, { Component } from 'react';
import Modal from 'react-modal';
import { Container, Row, Col } from 'react-grid-system';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import BackendManager from '../../../singletons/BackendManager.js';
import UserManager from '../../../singletons/UserManager.js';
import UtilsManager from '../../../singletons/UtilsManager.js';

const gemIconStyle = {
  marginLeft: 5,
  height: 30,
  width: 30
}

const gemLabelStyle1 = {
  fontWeight: 'bold',
  color:'#9A9B9C',
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const gemLabelStyle2 = {
  fontWeight: 'bold',
  color:'#229CD2',
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const gemLabelStyle3 = {
  fontWeight: 'bold',
  color:'#FF0081',
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const gemLabelStyle4 = {
  fontWeight: 'bold',
  color:'#974BFF',
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const gemLabelStyle5 = {
  fontWeight: 'bold',
  color:'#95D601',
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const gemLabelStyle6 = {
  fontWeight: 'bold',
  color:'#FFC842',
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const titleStyle = {
  fontWeight: 'bold',
  color: "#DAD8DE",
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const centerVertical = {
  position: 'relative',
  top: '50%',
  transform: 'translateY(-50%)',
}

class ContributorsModal extends Component {

  componentDidMount() {
    BackendManager.makeQuery('clips/comments/gem/contributors', JSON.stringify({
      comment_id: this.props.commentId,
    }))
    .then(data => {
      if (data.success) {
        console.log(data);
        this.setState({
          users: data.users,
        });
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      users: [],
    }
    this.renderUserItem = this.renderUserItem.bind(this);
    this.renderGemIcon = this.renderGemIcon.bind(this);
    this.renderBadge = this.renderBadge.bind(this);
  }

  renderBadge(i) {
    if (i == 0) {
      return (
        <img style={{marginBottom: 10, marginLeft: 10, marginTop: 10, width: 50, height: 50, display: 'inline-block'}} src={"../../../../../../images/gold-medal.svg"}/>
      );
    } else if (i == 1) {
      return (
        <img style={{marginBottom: 10, marginLeft: 10, marginTop: 10, width: 50, height: 50, display: 'inline-block'}} src={"../../../../../../images/silver-medal.svg"}/>
      );
    } else if (i == 2) {
      return (
        <img style={{marginBottom: 10, marginLeft: 10, marginTop: 10, width: 50, height: 50, display: 'inline-block'}} src={"../../../../../../images/bronze-medal.svg"}/>
      );
    }
  }

  renderUserItem(user, i) {
    return (
      <div>
        <div style={{height: 1, width: '100%'}} />
        <Container style={{marginTop: 10}}>
          <Row>
            {this.renderBadge(i)}
            <Avatar src={user.profile_picture} style={{marginBottom: 10, marginLeft: 10, marginTop: 10, width: 50, height: 50, display: 'inline-block'}} />
            <Col>
              <div style={centerVertical}>
                <Typography style={titleStyle}>
                  {user.username}
                </Typography>
              </div>
            </Col>
            <div style={{float: 'right', marginRight: 10}}>
              <div style={centerVertical}>
                {this.renderGemIcon(user.gems)}
              </div>
            </div>
          </Row>
        </Container>
      </div>
    );
  }

  renderGemIcon(gems) {
    var style = gemLabelStyle1;
    var src = '../../../../../../images/gem_1_10x.png';
    if (gems < 100) {
      style = gemLabelStyle1;
      src = '../../../../../../images/gem_1_10x.png';
    } else if (gems < 1000) {
      style = gemLabelStyle2;
      src = '../../../../../../images/gem_2_10x.png';
    } else if (gems < 5000) {
      style = gemLabelStyle3;
      src = '../../../../../../images/gem_3_10x.png';
    } else if (gems < 10000) {
      style = gemLabelStyle4;
      src = '../../../../../../images/gem_4_10x.png';
    } else if (gems < 25000) {
      style = gemLabelStyle5;
      src = '../../../../../../images/gem_5_10x.png';
    } else if (gems >= 25000) {
      style = gemLabelStyle6;
      src = '../../../../../../images/gem_6_10x.png';
    }

    return (
      <Row>
        <Typography style={style}>
          {UtilsManager.convertToCommaString(gems)}
        </Typography>
        <img
          style={gemIconStyle}
          src={src}/>
      </Row>
    );
  }

  render() {
		return (
      <div style={{padding: 0}}>
        <ul style={{margin: 0, padding: 0}}>
          {this.state.users.map((item, i) => {
            return (this.renderUserItem(item, i))
          })}
        </ul>
      </div>
    )
  }
}

export default ContributorsModal;
