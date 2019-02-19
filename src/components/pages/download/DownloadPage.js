import React, { Component } from 'react';
import Header from '../../ui/Header.js';
import { Container, Row, Col } from 'react-grid-system';

const rowStyle = {
  float: 'left',
  clear: 'none',
}

const imageStyle = {
  width: 500,
  overflow: 'hidden',
  objectFit: 'cover',
}

class DownloadPage extends Component {
  render() {
		return (
      <div className="landing-page">
        <div className="download-bg">
          <Header
            title={"Download the app!"} subtitle={""}
          />
          <Row>
            <Col>
              <img style={imageStyle} src={"./images/iphone.png"} backgroundColor={'transparent'}/>
            </Col>
            <Col>

            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default DownloadPage;
