import React from 'react';
import { withRouter } from "react-router-dom";
import {Elements} from 'react-stripe-elements';
import { TwitterShareButton, TwitterIcon } from 'react-share';

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
}

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class UploadSuccessModal extends React.Component {

  constructor(props) {
    super(props);

    this.handleDoneClick = this.handleDoneClick.bind(this);
  }

  handleDoneClick() {
    this.props.closeUploadSuccessModal();
    this.props.history.push('/story/' + this.props.storyId);
    this.props.handleStoryClick(this.props.storyId);
  }

  render() {
    return (
      <div>
        <h1 style={titleStyle}>{"Success!"}</h1>
        <button className='button-rounded' onClick={() => this.handleDoneClick()}>
          Check out the story!
        </button>
        <TwitterShareButton
          url={"http://localhost:3000/#/story/" + this.props.storyId}
          title={this.props.title}
          className="share-button">
          <TwitterIcon
            size={32}
            round />
        </TwitterShareButton>
      </div>
    );
  }
}

export default withRouter(UploadSuccessModal);
