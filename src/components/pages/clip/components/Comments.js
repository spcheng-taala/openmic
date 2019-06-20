// Comments.js
import React from 'react';
import Comment from './Comment';

const childStyle = {
  marginLeft: 50,
}

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.renderComment = this.renderComment.bind(this);
    this.sendReply = this.sendReply.bind(this);
  }

  sendReply(reply, parentCommentId) {
    this.props.sendReply(reply, parentCommentId);
  }

  renderComment() {
    var self = this;
    if (this.props.isChild) {
      return (
        <div style={childStyle}>
          {this.props.comments.map(function(comment){
            return <Comment
              key={comment.id}
              comment={comment}
              isChild={self.props.isChild}
              sendReply={self.props.sendReply}
              openContributeGemsModal={self.props.openContributeGemsModal}
            />
          })}
        </div>
      );
    } else {
      return (
        <div>
          {this.props.comments.map(function(comment){
            return <Comment
              key={comment.id}              
              comment={comment}
              isChild={self.props.isChild}
              sendReply={self.props.sendReply}
              likedComments={self.props.likedComments}
              handleCommentHeartClick={self.props.handleCommentHeartClick}
              openContributeGemsModal={self.props.openContributeGemsModal}
              setContributorsCommentId={self.props.setContributorsCommentId}
              />
          })}
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderComment()}
      </div>
    );
  }
}

export default Comments;
