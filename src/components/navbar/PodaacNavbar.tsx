import { Col, Row } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';

const PodaacNavbar = () => {
  return (
    <Navbar className={`Podaac-navbar`} expand="lg" style={{height: '70px'}}>
      <Row style={{width: '100%'}}>
        <Col md={{ span: 1, offset: 0 }} style={{paddingRight: '0px'}}>
          <a href="https://www.nasa.gov/" target="_blank" rel="noreferrer">
            <img
              alt=""
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/2449px-NASA_logo.svg.png"
              width="70"
              height="60"
              className="d-inline-block align-top"
            />{' '}
          </a>
        </Col>
        <Col md={{ span: 2, offset: 0 }} style={{paddingLeft: '0px'}}>
          <Row style={{paddingTop: '10px'}}>
            <a href="http://www.jpl.nasa.gov" target="_blank" rel="noreferrer" style={{color: 'white', fontSize: '16px', textDecoration: 'none', paddingLeft: '0px'}}>
              Jet Propulsion Laboratory
            </a>
          </Row>
          <Row style={{paddingBottom: '10px'}}>
            <a href="http://www.caltech.edu/" target="_blank" rel="noreferrer" style={{color: 'white', fontSize: '12px', textDecoration: 'none', paddingLeft: '0px'}}>
              California Institute of Technology
            </a>
          </Row>
        </Col>
        <Col md={{ span: 2, offset: 0 }} style={{paddingLeft: '0px'}}>
          <a href="https://podaac.jpl.nasa.gov/" target="_blank" rel="noreferrer">
            <img
              alt=""
              src="https://podaac.jpl.nasa.gov/sites/all/themes/podaac/images/logo@x2.png"
              height="60"
              className="d-inline-block align-top"
            />{' '}
          </a>
        </Col>
        <Col md={{ span: 3, offset: 4 }}>
          <img
            alt=""
            src="https://podaac.jpl.nasa.gov/sites/all/themes/podaac/images/satellite@x1.png"
            height="60"
            className="d-inline-block align-top d-flex"
          />{' '}
        </Col>
        </Row>
    </Navbar>
  );
}

export default PodaacNavbar;