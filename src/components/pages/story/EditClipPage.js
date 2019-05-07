import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import WaveSurfer from 'wavesurfer.js';
import toWav from 'audiobuffer-to-wav';
import Modal from 'react-modal';
import './assets/index.scss';
import "react-input-range/lib/css/index.css";
import { Planet } from 'react-kawaii';
import ReactPlayer from 'react-player';
import GridLayout from 'react-grid-layout';
import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import _ from "lodash";
import GifEditor from './components/GifEditor.js';
import TranscriptionEditor from './components/TranscriptionEditor.js';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';

const STAGE_VERIFYING = 0;
const STAGE_GIF = 1;
const STAGE_PUBLISHING = 2;

var uniqueCounter = 0;

const ReactGridLayout = WidthProvider(RGL);

var interval = null;

const tileData = [
    {
      index: 0,
      title: "Edit GIFs",
    },
    {
      index: 1,
      title: "Edit Captions",
    },
 ];

const customStyles = {
	overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: 'rgba(19, 18, 24, 0.75)',
		maxHeight: '100%',
    overflowY: 'auto',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
		background: 'rgba(255, 255, 255, 1)',
    transform: 'translate(-50%, -50%)'
  },
};

const gridList = {
	marginLeft: 20,
	marginTop: 20,
  width: 220,
  height: 70,
}

const waveformStyle = {
  marginLeft: 50,
  marginRight: 50,
}

const sliderStyle = {
  margin: 50,
}

const playPauseButtonStyle = {
  width: 60,
  height: 60,
  marginBottom: 10,
  cursor: 'pointer',
}

const root = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
}

const animationRoot = {
  display: 'flex',
  flexWrap: 'wrap',
  height: 250,
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,

}

const buttonRoot = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
}

const removeStyle = {
  position: "absolute",
  right: "2px",
  top: 0,
  cursor: "pointer"
};

const validGif = {
  margin: 0,
  borderRadius: 5,
  paddingLeft: 2,
  color: 'white',
  backgroundColor: '#3ABBBC',
}

const invalidGif = {
  margin: 0,
  borderRadius: 5,
  color: 'white',
  backgroundColor: '#DD7DA5',
}

const editorStyle = {
  height: 100,
}

const listStyle = {
  marginTop: 25,
  width: 400,
  height: 470,
  overflow: 'scroll',
  overflowX: 'hidden',
}

const timeTextFieldStyle = {
  width: 100,
}

const timeTextFiledFontStyle = {
  font: 'Lato',
  fontSize: 14,
}

var active = {
  color: '#CF5085',
  fontWeight: 'bold',
	cursor: 'pointer',
}

var inactive = {
  color: 'grey',
  fontWeight: 'normal',
	cursor: 'pointer',
}


class EditClipPage extends Component {

  static defaultProps = {
    isDraggable: true,
    isResizable: true,
    compactType: 'horizontal',
    // verticalCompact: false,
    rowHeight: 30,
    cols: 100,
    onLayoutChange: function() {},
  };

	handleTypeClick(index) {
		if (index == 0) {
			this.setState({type: index})
		} else if (index == 1) {
			this.setState({type: index});
		}
	}

  constructor(props) {
    super(props);
    this.state = {
			type: 0,
    };

		this.renderView = this.renderView.bind(this);
		this.switchToCaptions = this.switchToCaptions.bind(this);
		this.goToNewClip = this.goToNewClip.bind(this);
  }

	renderView() {
		if (this.state.type == 0) {
			return (
				<GifEditor id={this.props.match.params.id} switchToCaptions={this.switchToCaptions}/>
			)
		} else {
			return (
				<TranscriptionEditor id={this.props.match.params.id} goToNewClip={this.goToNewClip}/>
			)
		}
	}

	switchToCaptions() {
		this.setState({
			type: 1,
		});
	}

	goToNewClip() {
		this.props.history.push('/clips/' + this.props.match.params.id);
	}

  render() {
    const { classes } = this.props;
		return (
      <div>
				<GridList cellHeight={50} style={gridList} cols={2}>
					{tileData.map(tile => (
						<GridListTile key={tile.index} onClick={() => this.handleTypeClick(tile.index)}>
							<p style={tile.index == this.state.type ? active:inactive}>{tile.title}</p>
						</GridListTile>
					))}
				</GridList>
				{this.renderView()}
      </div>
    )
  }
}

export default EditClipPage;
