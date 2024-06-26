import { Col, Row } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { PersonSquare } from 'react-bootstrap-icons';
import { logoutCurrentUser } from '../app/appSlice';
import { useLocation, useNavigate } from "react-router-dom";
import { setShowTutorialModalTrue } from '../sidebar/actions/modalSlice';

const MainNavbar = () => {
  const dispatch = useAppDispatch()
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const userData = useAppSelector((state) => state.app.currentUser)
  const navigate = useNavigate()
  const BASE_REDIRECT_URI = process.env.REACT_APP_BASE_REDIRECT_URI;

  var { email, firstName, lastName } = userData || {};
  const { search } = useLocation();

  const renderUserDropdownTitle = () => (
      <span>
        <PersonSquare /> {`${firstName} ${lastName}`}
      </span>
  )

  const handleLogout = async () => {
    dispatch(logoutCurrentUser());
    navigate('/')
  }

  return (
    <Navbar className={`${colorModeClass}-navbar-background Main-navbar`}variant="dark" expand="sm">
      <Navbar.Brand className={`${colorModeClass}-text`} style={{marginLeft: '20px', pointerEvents: 'none'}}>SWODLR</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link className={`${colorModeClass}-navbar-link`} href={`${BASE_REDIRECT_URI}customizeProduct/selectScenes${search}`} onClick={() => navigate(`/customizeProduct/selectScenes${search}`)} id='customization-tab'>Customization</Nav.Link>
          <Nav.Link className={`${colorModeClass}-navbar-link`} href={`${BASE_REDIRECT_URI}generatedProductHistory${search}`} onClick={() => navigate(`/generatedProductHistory${search}`)} id='my-data-page'>My Data</Nav.Link>
          <NavDropdown  className={`${colorModeClass}-navbar-dropdown`} title="Data Discovery" id="basic-nav-dropdown" menuVariant="dark">
            <NavDropdown.Item href="https://search.earthdata.nasa.gov/search/granules?p=C2799438271-POCLOUD&pg[0][v]=f&pg[0][gsk]=-start_date&q=SWOT_L2_HR_RASTER_2.0&tl=1705536407!3!!&lat=65.390625&zoom=1" target="_blank">Earthdata Search</NavDropdown.Item>
            <NavDropdown.Item href="https://podaac.jpl.nasa.gov/" target="_blank">PO.DAAC Portal</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link className={`${colorModeClass}-navbar-link`} href={`${BASE_REDIRECT_URI}about${search}`} onClick={() => navigate(`/about${search}`)}>About</Nav.Link>
          <Nav.Link className={`${colorModeClass}-navbar-link`} onClick={() => dispatch(setShowTutorialModalTrue())} id='tutorial-page'>Tutorial</Nav.Link>
        </Nav>
        <NavDropdown  className={`${colorModeClass}-text`} title={renderUserDropdownTitle()} id="basic-nav-dropdown" align="end" style={{marginRight: '20px'}} menuVariant="dark">
            <Row>
              <Col>
                <NavDropdown.Item>Email: {email}</NavDropdown.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
              </Col>
            </Row>
        </NavDropdown>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MainNavbar;