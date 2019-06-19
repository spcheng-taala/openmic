// Comment.js
import React from 'react';
import Comments from './Comments';
import { Row, Col } from 'react-grid-system';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const gemIconStyle = {
  marginLeft: 40,
  marginRight: 10,
  width: 20,
  height: 20,
  display: 'inline-block',
}

const gemLabelStyle1 = {
  fontWeight: 'bold',
  color:'#9A9B9C',
  font: "Lato",
  textAlign: "left",
  fontSize: 15,
}

const gemLabelStyle2 = {
  fontWeight: 'bold',
  color:'#229CD2',
  font: "Lato",
  textAlign: "left",
  fontSize: 15,
}

const gemLabelStyle3 = {
  fontWeight: 'bold',
  color:'#FF0081',
  font: "Lato",
  textAlign: "left",
  fontSize: 15,
}

const gemLabelStyle4 = {
  fontWeight: 'bold',
  color:'#974BFF',
  font: "Lato",
  textAlign: "left",
  fontSize: 15,
}

const gemLabelStyle5 = {
  fontWeight: 'bold',
  color:'#95D601',
  font: "Lato",
  textAlign: "left",
  fontSize: 15,
}

const gemLabelStyle6 = {
  fontWeight: 'bold',
  color:'#FFC842',
  font: "Lato",
  textAlign: "left",
  fontSize: 15,
}

const tier0NameStyle = {
  marginTop: 10,
  marginLeft: 30,
  color: "#525252",
  fontSize: 13,
  marginBottom: 5,
}

const replyingToStyle = {
  marginLeft: 10,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  fontStyle: 'italic',
  color: "#525252",
  fontSize: 13,
}

const parentTextStyle = {
  marginLeft: 10,
  marginTop: 5,
  marginBottom: 5,
  fontWeight: 'bold',
  color: "#36454F",
  fontSize: 14,
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
  marginTop: 20,
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
    this.handleViewContributorsClick = this.handleViewContributorsClick.bind(this);
    this.convertToCommaString = this.convertToCommaString.bind(this);
    this.renderGem = this.renderGem.bind(this);
  }

  renderGem(gems) {
    if (gems < 100) {
      return (
        <Row>
          <img style={gemIconStyle} src='../../../../../images/gem_1_10x.png'/>
          <Typography style={gemLabelStyle1}>
            {this.convertToCommaString(gems) + " Contributed"}
          </Typography>
        </Row>
      )
    } else if (gems < 1000) {
      return (
        <Row>
          <img
            style={gemIconStyle}
            src='../../../../../../images/gem_2_10x.png'/>
          <Typography style={gemLabelStyle2}>
            {this.convertToCommaString(gems) + " Contributed"}
          </Typography>
        </Row>
      )
    } else if (gems < 5000) {
      return (
        <Row>
          <img
            style={gemIconStyle}
            src='../../../../../../images/gem_3_10x.png'/>
          <Typography style={gemLabelStyle3}>
            {this.convertToCommaString(gems) + " Contributed"}
          </Typography>
        </Row>
      )
    } else if (gems < 10000) {
      return (
        <Row>
          <img
            style={gemIconStyle}
            src='../../../../../../images/gem_4_10x.png'/>
          <Typography style={gemLabelStyle4}>
            {this.convertToCommaString(gems) + " Contributed"}
          </Typography>
        </Row>
      )
    } else if (gems < 25000) {
      return (
        <Row>
          <img
            style={gemIconStyle}
            src='../../../../../../images/gem_5_10x.png'/>
          <Typography style={gemLabelStyle5}>
            {this.convertToCommaString(gems) + " Contributed"}
          </Typography>
        </Row>
      )
    } else if (gems >= 25000) {
      return (
        <Row>
          <img
            style={gemIconStyle}
            src='../../../../../../images/gem_6_10x.png'/>
          <Typography style={gemLabelStyle6}>
            {this.convertToCommaString(gems) + " Contributed"}
          </Typography>
        </Row>
      );
    }
  }

  handleReplyClick(isReplying) {
    this.setState({
      isReplying: isReplying,
    });
  }

  renderReply() {
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

  handleViewContributorsClick() {
    this.props.setContributorsCommentId(this.props.comment.id);
  }

  renderComment() {
    var comment = this.props.comment;
    return (
      <div style={tier0Style}>
        {!comment.root ? <div>
          {this.renderGem(comment.gems)}
          <div>
            <p style={{display:'inline-block', fontStyle: 'italic', marginLeft: 30, marginTop: 5, marginBottom: 0, fontSize: 10, textAlign: 'left', color: '#880045'}}>{"( " + comment.count + " contributors )"}</p>
            <p style={{display:'inline-block', textDecoration: 'underline', marginLeft: 10, marginTop: 5, marginBottom: 0, fontSize: 10, textAlign: 'left', color: '#880045', cursor: 'pointer'}} onClick={() => this.handleViewContributorsClick()}>{"View All"}</p>
          </div>
        </div> :
        <div style={{backgroundColor: '#DDDDDD', borderRadius: '5px 5px 0px 0px', width: '60%'}}>
          <p style={replyingToStyle}>
            {'Replying to: '}
          </p>
          <p style={parentTextStyle}>
            {comment.parent_comment}
          </p>
        </div>
        }
        <p style={{marginLeft: 30, marginTop: 10, marginBottom: 0, fontWeight: 'bold'}}>{comment.comment}</p>
        <p style={tier0NameStyle}>
          {"Posted by: " + comment.username}
        </p>
        {!comment.root ?
          <Row style={{marginTop: 0}}>
            <img style={{marginLeft: 40, height: 30, cursor: 'pointer'}} src='../../../../../images/contribute_gems.png' onClick={() => this.props.openContributeGemsModal(comment.id)}/>
            {this.renderReply()}
          </Row>
          :
          <div style={{marginLeft: 30}}>{this.renderReply()}</div>}
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
    if (this.props.comment.root) {
      this.props.sendReply(this.state.reply, this.props.comment.id, this.props.comment.root);
    } else {
      this.props.sendReply(this.state.reply, this.props.comment.id, this.props.comment.id);
    }
    this.setState({
      isReplying: false,
      reply: "",
    });
  }

  convertToCommaString(x) {
    if (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return ("0");
    }
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
