import React from 'react';
import MainNavbar from './components/navbar/MainNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Row, Col } from 'react-bootstrap';
import Sidebar from './components/sidebar/Sidebar'
import Map from './components/map/Map'

function App() {
  return (
    <div className="App">
      <MainNavbar />
      <Row style={{height: '100%'}}>
        <Col sm={4}>
          <Sidebar />
        </Col>
        <Col sm={8}>
         <Map />
        </Col>
      </Row>
    </div>
  );
}

export default App;
