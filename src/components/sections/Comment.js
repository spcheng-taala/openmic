// Comment.js
import React from 'react';
import Comments from './Comments';
import ReactPlayer from 'react-player';
import { Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import UtilsManager from '../singletons/UtilsManager.js';

const styles = theme => ({
  textFieldInputRoot: {
    fontFamily: 'Lato',
    color: '#222225',
  },
  textFieldLabelRoot: {
    fontFamily: 'Lato',
  }
});

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
  textAlign: 'left',
  fontSize: 15,
}

const gemLabelStyle2 = {
  fontWeight: 'bold',
  color:'#229CD2',
  textAlign: 'left',
  fontSize: 15,
}

const gemLabelStyle3 = {
  fontWeight: 'bold',
  color:'#FF0081',
  textAlign: 'left',
  fontSize: 15,
}

const gemLabelStyle4 = {
  fontWeight: 'bold',
  color:'#974BFF',
  textAlign: 'left',
  fontSize: 15,
}

const gemLabelStyle5 = {
  fontWeight: 'bold',
  color:'#95D601',
  textAlign: 'left',
  fontSize: 15,
}

const gemLabelStyle6 = {
  fontWeight: 'bold',
  color:'#FFC842',
  textAlign: 'left',
  fontSize: 15,
}

const tier0NameStyle = {
  marginTop: 10,
  marginLeft: 30,
  color: '#525252',
  fontSize: 13,
  marginBottom: 5,
}

const responseVideoTitleStyle = {
  marginLeft: 50,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  fontStyle: 'italic',
  color: '#525252',
  fontSize: 13,
}

const replyingToStyle = {
  marginLeft: 10,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  fontStyle: 'italic',
  color: '#525252',
  fontSize: 13,
}

const parentTextStyle = {
  marginLeft: 10,
  marginTop: 5,
  marginBottom: 5,
  fontWeight: 'bold',
  color: '#36454F',
  fontSize: 14,
}

const gemTextStyle = {
  fontWeight: 'bold',
  marginLeft: 10,
  color: '#FF0081',
  fontSize: 15,
}

const contributGemTextStyle = {
  marginLeft: 5,
  color: '#FF0081',
  fontSize: 12,
}

const commentStyle = {
  marginLeft: 70,
  marginTop: 20,
}

const tier0Style = {
  color: '#222225',
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
      isHovering: false,
    };

    this.renderComment = this.renderComment.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.handleReplyClick = this.handleReplyClick.bind(this);
    this.renderReply = this.renderReply.bind(this);
    this.handleReplyChange = this.handleReplyChange.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.handleViewContributorsClick = this.handleViewContributorsClick.bind(this);
    this.renderGem = this.renderGem.bind(this);
    this.renderResponseVideo = this.renderResponseVideo.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
    this.renderPlayPauseButton = this.renderPlayPauseButton.bind(this);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.handleCollectClick = this.handleCollectClick.bind(this);
  }

  renderGem(gems) {
    var style = gemLabelStyle1;
    var src = '../../../../../images/gem_1_10x.png';

    if (gems < 100) {
      style = gemLabelStyle1;
      src = '../../../../../images/gem_1_10x.png';
    } else if (gems < 1000) {
      style = gemLabelStyle2;
      src = '../../../../../images/gem_2_10x.png';
    } else if (gems < 5000) {
      style = gemLabelStyle3;
      src = '../../../../../images/gem_3_10x.png';
    } else if (gems < 10000) {
      style = gemLabelStyle4;
      src = '../../../../../images/gem_4_10x.png';
    } else if (gems < 25000) {
      style = gemLabelStyle5;
      src = '../../../../../images/gem_5_10x.png';
    } else if (gems >= 25000) {
      style = gemLabelStyle6;
      src = '../../../../../images/gem_6_10x.png';
    }

    var text = UtilsManager.convertToCommaString(gems) + " Added";
    if (this.props.comment.stage == 1) {
      text = UtilsManager.convertToCommaString(gems) + " Raised";
    }

    return (
      <Row>
        <img style={gemIconStyle} src={src}/>
        <Typography style={style}>
          {text}
        </Typography>
      </Row>
    );
  }

  handleReplyClick(isReplying) {
    this.setState({
      isReplying: isReplying,
    });
  }

  renderReply(classes) {
    if (this.state.isReplying) {
      return (
        <div style={commentStyle}>
          <TextField
            id="outlined-adornment-amount"
            label="Reply"
            value={this.state.reply}
            onChange={this.handleReplyChange}
            fullWidth
            InputProps={{ classes: { root: classes.textFieldInputRoot } }}
            InputLabelProps={{
              FormLabelClasses: {
                root: classes.textFieldLabelRoot
              }
            }}
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

  ref = player => {
    this.player = player
  }

  renderPlayPauseButton(response) {
    if (this.props.currentResponseId != response.id) {
      return (
        <img style={{width: 100, height: 100, position: 'absolute', left: '0%', right: '0%', top:'0%', bottom: '0%', margin:'auto', cursor: 'pointer'}} src='../../../../../images/play_3d.png'/>
      );
    } else {
      if (this.state.isHovering) {
        return (
          <img style={{width: 100, height: 100, position: 'absolute', left: '0%', right: '0%', top:'0%', bottom: '0%', margin:'auto', cursor: 'pointer'}} src='../../../../../images/pause_3d.png'/>
        );
      }
    }
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

  renderResponseVideo(response) {
    return (
      <div style={{cursor: 'pointer', marginLeft: 10}} onClick={() => this.props.handleResponseVideoClick(response.id)}>
        <p style={responseVideoTitleStyle}>
          {response.username + " responded: "}
        </p>
        <div style={{display: 'table', position: 'relative', backgroundColor: 'black', borderRadius: 10}} onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}>
          {this.renderPlayPauseButton(response)}
          <ReactPlayer
            ref={this.ref}
            style={{marginTop: 10}}
            width={480}
            height={640}
            loop={true}
            url={response.url}
            playing={this.props.currentResponseId == response.id} />
        </div>
      </div>
    );
  }

  renderChildren(comment) {
    if (comment.stage == 0) {
      return (
        <Comments isChild={true} comments={comment.children} sendReply={this.props.sendReply} depth={this.props.depth + 1}/>
      );
    } else {
      if (comment.root) {
        return (
          <Comments isChild={true} comments={comment.children} sendReply={this.props.sendReply} depth={this.props.depth + 1}/>
        );
      } else {
        if (comment.response) {
          return (
            <div>
              {this.renderResponseVideo(comment.response)}
              <Comments isChild={true} comments={comment.children} sendReply={this.props.sendReply} depth={this.props.depth + 1}/>
            </div>
          );
        } else {
          return (
            <Comments isChild={true} comments={comment.children} sendReply={this.props.sendReply} depth={this.props.depth + 1}/>
          );
        }
      }
    }
  }

  renderComment(classes) {
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
        {this.renderButtons(classes, comment)}
        {this.renderChildren(comment)}
      </div>
    );
  }

  renderButtons(classes, comment) {
    if (comment.stage == 0 && !comment.root) {
      return (
        <Row style={{marginTop: 0}}>
          {this.props.isOwner ? <button style={{marginLeft: 40}} className='button-rounded-green-no-mar-small' onClick={() => this.handleCollectClick(comment)}>{"Collect Gems"}</button> : <img style={{marginLeft: 40, height: 30, cursor: 'pointer'}} src='../../../../../images/contribute_gems.png' onClick={() => this.props.openContributeGemsModal(comment)}/>}
          {this.renderReply(classes)}
        </Row>
      );
    } else {
      return (
        <div style={{marginLeft: 30}}>{this.renderReply(classes)}</div>
      );
    }
  }

  handleCollectClick(comment) {
    this.props.handleCollectClick(comment.id, comment.username, comment.comment, comment.gems);
  }

  handleReplyChange(e) {
    this.setState({
      reply: e.target.value
    });
  }

  handleSendClick() {
    if (this.props.comment.root) {
      this.props.sendReply(this.state.reply, this.props.comment.id, this.props.comment.comment, this.props.comment.root);
    } else {
      this.props.sendReply(this.state.reply, this.props.comment.id, this.props.comment.comment, this.props.comment.id);
    }
    this.setState({
      isReplying: false,
      reply: "",
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{marginTop: 10}}>
        {this.renderComment(classes)}
      </div>
    );
  }
}

export default withStyles(styles)(Comment);
