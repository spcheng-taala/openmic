import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Planet } from 'react-kawaii';
import BackendManager from '../../singletons/BackendManager.js';

const animationRoot = {
  display: 'flex',
  flexWrap: 'wrap',
  height: 250,
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
}

class PublishingPage extends Component {

  componentDidMount() {
		var id = localStorage.getItem('clip_id');
    var uuid = localStorage.getItem('clip_uuid');
    var url = localStorage.getItem('clip_url');
		if (id && uuid && url) {
			this.setState({
				id: id,
        uuid: uuid,
        url: url,
			});
      localStorage.removeItem('clip_id');
      localStorage.removeItem('clip_uuid');
      localStorage.removeItem('clip_url');
      setInterval(this.refresh, 30000);
		} else {
      this.props.history.push('/');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
			id: 0,
      uuid: "",
      url: "",
      active: 0,
      key: 0,
    };

    this.refresh = this.refresh.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
  }

  refresh() {
    var key = this.state.key;
    key += 1;
    this.setState({
      key: key
    });
  }

  handleDurationChange(duration) {
    if (duration && duration > 0) {
      this.props.history.push('/studio/' + this.state.uuid);
    }
  }

  render() {
		return (
      <div>
        <div style={animationRoot}>
          <Planet className='floating' size={200} mood="shocked" color="#FCCB7E" />
        </div>
        <p style={{color: 'grey', textAlign: 'center'}}>{"Creating your clip!"}</p>
        <ReactPlayer
          key={this.state.key}
          width={350}
          height={200}
          url={this.state.url}
          onDuration={this.handleDurationChange}
          playing={true}
          loop />
      </div>
    )
  }
}

export default PublishingPage;
