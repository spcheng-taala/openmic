// Comment.js
import React from 'react';
import Comments from './Comments';
import { Row } from 'react-grid-system';
import TextField from '@material-ui/core/TextField';

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
  marginLeft: 10,
  color: "#222225",
  fontSize: 17,
}

const commentStyle = {
  marginLeft: 10,
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
  }

  handleReplyClick(isReplying) {
    this.setState({
      isReplying: isReplying,
    });
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
            <button style={commentStyle} onClick={() => this.handleReplyClick(true)}>
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

  renderComment() {
    var comment = this.props.comment;
    if (this.props.comment.donation > 0) {
      return (
        <div>
          <div style={tier1Style}>
            <Row style={tier1DivStyle}>
              <p style={tier1NameStyle}>{comment.name}</p>
              {this.renderSvg(comment.donation)}
            </Row>
            <p style={tier1DonationStyle}>{"(Donated $" + (comment.donation/100).toFixed(2) + ")"}</p>
            <p style={commentStyle}>{comment.comment}</p>
            {this.renderReply()}
          </div>
          <Comments isChild={true} comments={comment.children} />
        </div>
      );
    } else {
      return (
        <div style={tier0Style}>
          <p style={tier0NameStyle}>{comment.name}</p>
          <p style={commentStyle}>{comment.comment}</p>
          {this.renderReply()}
          <Comments isChild={true} comments={comment.children} sendReply={this.props.sendReply}/>
        </div>
      );
    }
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
