import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Helmet } from 'react-helmet';
import BackendManager from '../../singletons/BackendManager.js';

const animationRoot = {
  display: 'flex',
  flexWrap: 'wrap',
  height: 500,
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
}

class PublishingPage extends Component {

  componentDidMount() {
    var isEdit = localStorage.getItem('is_edit');
		var id = localStorage.getItem('clip_id');
    var uuid = localStorage.getItem('clip_uuid');
    var url = localStorage.getItem('clip_url');
		if (id && uuid && url) {
			this.setState({
        isEdit: isEdit,
				id: id,
        uuid: uuid,
        url: url,
			});
      localStorage.removeItem('is_edit');
      localStorage.removeItem('clip_id');
      localStorage.removeItem('clip_uuid');
      localStorage.removeItem('clip_url');
      setInterval(this.refresh, 10000);
		} else {
      this.props.history.push('/');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      isEdit: 0,
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
      if (this.state.isEdit == 0) {
        this.props.history.push('/studio/' + this.state.uuid);
      } else {
        this.props.history.push('/clips/' + this.state.uuid);
      }
    }
  }

  render() {
		return (
      <div style={{backgroundColor: 'white'}}>
        <Helmet>
          <title>{"Publishing... - Riptide"}</title>
        </Helmet>
        <div style={animationRoot}>
          <img alt={"Lol"} style={{height: "100%"}} src='../../../../../images/spinning_head.gif'/>
        </div>
        <p style={{color: '#4F5CD8', textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>{"Creating your clip!"}</p>
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
