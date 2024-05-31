import Navbar from 'react-bootstrap/Navbar';
import { useAppSelector } from '../../redux/hooks'
import { Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import packageJson from '../../../package.json'

const PodaacFooter = () => {
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const userAuthenticated = useAppSelector((state) => state.app.userAuthenticated)
  const navigate = useNavigate();
  const { search } = useLocation();

  return (
    <Navbar className={`${colorModeClass}-navbar-background Main-navbar fixed-bottom`} style={{paddingTop: '0px', paddingBottom: "0px", marginRight: '0px'}} expand="lg">
      <Row style={{width: '100%', paddingTop: '5px', paddingBottom: '5px'}}>
        <Col md={{ span: 6, offset: 0 }}>
          <Navbar.Text style={{marginLeft: '0px', color: '#C8C7C5'}}>
            {`Version ${packageJson.version} of SWOT On-Demand Level-2 Raster Generator (SWODLR)`}
          </Navbar.Text>
        </Col>
        <Col md={{ span: 5, offset: 1 }}><Row>       
          <Col>
            <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '0px'}}>
              <a href="https://www.jpl.nasa.gov/caltechjpl-privacy-policies-and-important-notices" target="_blank" style={{color: 'white'}} rel="noreferrer">Privacy</a>
            </Navbar.Text>
          </Col>
          { userAuthenticated ?
            (<Col>
              <Navbar.Text style={{marginLeft: '0px', color: 'white', cursor: 'pointer'}} onClick={() => navigate(`/about${search}`)}>
                <u>About SWODLR</u>
              </Navbar.Text>
            </Col>) 
            : null
          }
          <Col>
            <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '0px', color: 'white', cursor: 'pointer'}} onClick={() => window.open('mailto:podaac@podaac.jpl.nasa.gov')}>
              <u>Contact</u>
            </Navbar.Text>
          </Col>
        </Row></Col>
      </Row>
    </Navbar>
  );
}

export default PodaacFooter;