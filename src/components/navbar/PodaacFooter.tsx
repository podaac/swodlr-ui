import Navbar from 'react-bootstrap/Navbar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setCurrentPage } from '../app/appSlice';
import { Col, Nav, Row } from 'react-bootstrap';

const PodaacFooter = () => {
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const dispatch = useAppDispatch()

  return (
    <Navbar className={`${colorModeClass}-navbar-background Main-navbar fixed-bottom`} style={{paddingTop: '0px', paddingBottom: "0px", marginRight: '0px'}} expand="lg">
      <Row style={{width: '100%', paddingTop: '5px', paddingBottom: '5px'}}>
        <Col md={{ span: 6, offset: 0 }}><Navbar.Text style={{marginLeft: '20px', color: '#C8C7C5'}}>
          Version 1.0 Pre-Alpha of SWOT On-Demand Level-2 Raster Generator (SWODLR)
        </Navbar.Text>
        </Col>
        <Col md={{ span: 4, offset: 2 }}><Row>       
          <Col>
            <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '20px'}}>
              <a href="https://www.jpl.nasa.gov/caltechjpl-privacy-policies-and-important-notices" target="_blank" style={{color: 'white'}} rel="noreferrer">Privacy</a>
            </Navbar.Text>
          </Col>
          <Col>
            <Navbar.Text style={{marginLeft: '20px', color: 'white', cursor: 'pointer'}} onClick={() => dispatch(setCurrentPage('about'))}>
              <u>About SWODLR</u>
            </Navbar.Text>
          </Col>
          <Col>
            <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '20px', color: 'white', cursor: 'pointer'}} onClick={() => window.open('mailto:podaac@podaac.jpl.nasa.gov')}>
              <u>Contact</u>
            </Navbar.Text>
          </Col>
        </Row></Col>
        {/* <Nav> */}
          {/* <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '20px'}}>
          |
          </Navbar.Text>

          <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '20px'}}>
          |
          </Navbar.Text> */}

        {/* </Nav> */}
      </Row>
    </Navbar>
  );
}

export default PodaacFooter;