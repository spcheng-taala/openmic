// Comment.js
import React from 'react';
import Comments from './Comments';
import { Row, Col } from 'react-grid-system';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const smallSvgStyle = {
  width: 60,
  height: 60,
}

const mediumSvgStyle = {
  width: 70,
  height: 70,
}

const bigSvgStyle = {
  width: 80,
  height: 80,
}

const superBigSvgStyle = {
  width: 100,
  height: 100,
}

const tier1DivStyle = {
  margin: 0,
  marginTop: -20,
  alignItems: 'center',
}

const tier1NameStyle = {
  fontWeight: 'bold',
  marginLeft: 10,
  color: "#E1BE62",
  fontSize: 22,
}

const tier1DonationStyle = {
  fontWeight: 'bold',
  marginLeft: 10,
  color: "#E1BE62",
  marginTop: -20,
  fontSize: 18,
}

const tier0NameStyle = {
  fontWeight: 'bold',
  marginLeft: 0,
  color: "#222225",
  fontSize: 17,
}

const commentStyle = {
  marginLeft: 70,
  marginTop: 0,
}

const tier1Style = {
  color: "#222225",
  font: "Lato",
  marginTop: 10,
}

const tier0Style = {
  color: "#222225",
  font: "Lato",
  marginTop: 10,
  borderWidth: 0,
}

const centerVertical = {
  margin: 0,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
}

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReplying: false,
      reply: "",
      parentId: null,
    };

    this.renderComment = this.renderComment.bind(this);
    this.handleReplyClick = this.handleReplyClick.bind(this);
    this.renderReply = this.renderReply.bind(this);
    this.handleReplyChange = this.handleReplyChange.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.renderSvg = this.renderSvg.bind(this);
    this.handleHeartClick = this.handleHeartClick.bind(this);
  }

  handleReplyClick(isReplying) {
    this.setState({
      isReplying: isReplying,
    });
  }

  handleHeartClick() {
    var hasLiked = false;
    for (var i = 0; i < this.props.likedComments.length; i++) {
      if (this.props.likedComments[i].comment_id == this.props.comment.id) {
        hasLiked = true;
      }
    }
    var reaction = 1;
    if (hasLiked) {
      reaction = 0;
    }
    this.props.handleCommentHeartClick(this.props.comment.id, reaction);
  }

  renderReply() {
    if (!this.props.isChild) {
      if (this.state.isReplying) {
        return (
          <div style={commentStyle}>
            <TextField
              id="outlined-adornment-amount"
              label="Reply"
              value={this.state.reply}
              onChange={this.handleReplyChange}
              fullWidth
            />
            <Row style={commentStyle}>
              <button className='button-purple' onClick={() => this.handleReplyClick(false)}>
                {"Cancel"}
              </button>
              <button className='button-green' onClick={() => this.handleSendClick()}>
                {"Post"}
              </button>
            </Row>
          </div>
        );
      } else {
        return (
          <div style={{marginTop: 10}}>
            <button onClick={() => this.handleReplyClick(true)}>
              {"Reply"}
            </button>
          </div>
        );
      }
    }
  }

  renderSvg(donation) {
    if (donation < 100) {
      return (
        <img style={smallSvgStyle} src={"../../../../../../images/coin2.svg"}/>
      )
    } else if (donation < 1000) {
      return (
        <img style={mediumSvgStyle} src={"../../../../../../images/coin1.svg"}/>
      );
    } else if (donation < 5000) {
      return (
        <img style={bigSvgStyle} src={"../../../../../../images/coin3.svg"}/>
      );
    } else {
      return (
        <img style={superBigSvgStyle} src={"../../../../../../images/ruby.svg"}/>
      );
    }
  }

  renderHeart() {
    var hasLiked = false;    
    for (var i = 0; i < this.props.likedComments.length; i++) {
      if (this.props.likedComments[i].comment_id == this.props.comment.id) {
        hasLiked = true;
      }
    }

    if (hasLiked) {
      return (
        <img style={{width: 30, height: 30}} src='../../../../../images/heart_purple.png'/>
      )
    } else {
      return (
        <img style={{width: 30, height: 30}} src='../../../../../images/heart_purple_empty.png'/>
      );
    }
  }

  renderComment() {
    var comment = this.props.comment;
    return (
      <div style={tier0Style}>
        <Row>
          <Avatar src={comment.profile_picture} style={{marginBottom: 10, marginLeft: 30, marginTop: 10, width: 30, height: 30, display: 'inline-block'}} />
          <Col>
            <div style={centerVertical}>
              <Typography style={tier0NameStyle}>
                {comment.username}
              </Typography>
            </div>
          </Col>
        </Row>
        <p style={{marginLeft: 30, marginTop: 0}}>{comment.comment}</p>
        <Row>
          <div style={{marginLeft: 40, marginRight: 10}}>
            <div style={{width: 30, margin: 0, cursor: 'pointer'}} onClick={() => this.handleHeartClick()}>
              <img style={{width: 30, height: 30}} src='../../../../../images/heart_purple_empty.png'/>
              <p style={{margin: 0, fontSize: 10, textAlign: 'center'}}>{comment.sum}</p>
            </div>
          </div>
          {this.renderReply()}
        </Row>
        <Comments isChild={true} comments={comment.children} sendReply={this.props.sendReply}/>
      </div>
    );
  }

  handleReplyChange(e) {
    this.setState({
      reply: e.target.value
    });
  }

  handleSendClick() {
    this.props.sendReply(this.state.reply, this.props.comment.id, this.props.comment.email);
    this.setState({
      isReplying: false,
      reply: "",
    });
  }

  render() {
    return (
      <div>
        {this.renderComment()}
      </div>
    );
  }
}

export default Comment;
