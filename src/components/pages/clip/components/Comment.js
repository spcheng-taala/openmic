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
  marginTop: 10,
  marginLeft: 30,
  color: "#525252",
  fontSize: 13,
  marginBottom: 5,
}

const gemTextStyle = {
  fontWeight: 'bold',
  marginLeft: 10,
  color: "#FF0081",
  fontSize: 15,
}

const contributGemTextStyle = {
  marginLeft: 5,
  color: "#FF0081",
  fontSize: 12,
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
    this.handleViewContributorsClick = this.handleViewContributorsClick.bind(this);
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
          <div>
            <button className="button-rounded-purple-no-mar-small" onClick={() => this.handleReplyClick(true)}>
              {"Reply"}
            </button>
          </div>
        );
      }
    }
  }

  handleViewContributorsClick() {
    this.props.setContributorsCommentId(this.props.comment.id);
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

  renderComment() {
    var comment = this.props.comment;
    return (
      <div style={tier0Style}>
        <div>
          <Row>
            <img src={comment.profile_picture} style={{marginLeft: 40, width: 20, height: 20, display: 'inline-block'}} src='../../../../../images/gem.png'/>
            <Typography style={gemTextStyle}>
              {comment.gems + " Contributed"}
            </Typography>
          </Row>
          <div>
            <p style={{display:'inline-block', fontStyle: 'italic', marginLeft: 30, marginTop: 5, marginBottom: 0, fontSize: 10, textAlign: 'left', color: '#880045'}}>{"( " + comment.count + " contributors )"}</p>
            <p style={{display:'inline-block', textDecoration: 'underline', marginLeft: 10, marginTop: 5, marginBottom: 0, fontSize: 10, textAlign: 'left', color: '#880045', cursor: 'pointer'}} onClick={() => this.handleViewContributorsClick()}>{"View All"}</p>
          </div>
        </div>
        <p style={{marginLeft: 30, marginTop: 10, marginBottom: 0, fontWeight: 'bold'}}>{comment.comment}</p>
        <p style={tier0NameStyle}>
          {"Posted by: " + comment.username}
        </p>
        <Row style={{marginTop: 0}}>
          <img style={{marginLeft: 40, height: 30, cursor: 'pointer'}} src='../../../../../images/contribute_gems.png' onClick={() => this.props.openContributeGemsModal(comment.id)}/>
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
      <div style={{marginBottom: 30}}>
        {this.renderComment()}
      </div>
    );
  }
}

export default Comment;
