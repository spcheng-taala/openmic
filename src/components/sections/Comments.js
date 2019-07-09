// Comments.js
import React from 'react';
import Comment from './Comment';

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
    var marginLeft = 0;

    if (this.props.isChild) {
      marginLeft = 50;
    }

    return (
      <div style={{marginLeft: marginLeft}}>
        {this.props.comments.map(function(comment){
          return <Comment
            key={comment.id}
            isOwner={self.props.isOwner}
            comment={comment}
            isChild={self.props.isChild}
            sendReply={self.props.sendReply}
            openContributeGemsModal={self.props.openContributeGemsModal}
            setContributorsCommentId={self.props.setContributorsCommentId}
            currentResponseId={self.props.currentResponseId}
            handleResponseVideoClick={self.props.handleResponseVideoClick}
          />
        })}
      </div>
    );
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
