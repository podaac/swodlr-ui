import { Col, Row } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { PersonSquare } from 'react-bootstrap-icons';
import { setUserNotAuthenticated } from '../app/appSlice';
import { useLocation, useNavigate } from "react-router-dom";

const MainNavbar = () => {
  const dispatch = useAppDispatch()
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const userData = useAppSelector((state) => state.app.currentUser)
  const navigate = useNavigate()

  const { email, firstName, lastName } = userData
  const { search } = useLocation();

  const renderUserDropdownTitle = () => (
      <span>
        <PersonSquare /> {`${firstName} ${lastName}`}
      </span>
  )

  return (
    <Navbar className={`${colorModeClass}-navbar-background Main-navbar`} expand="lg">
      <Navbar.Brand className={`${colorModeClass}-text`} style={{marginLeft: '20px', pointerEvents: 'none'}}>SWODLR</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link className={`${colorModeClass}-navbar-link`} onClick={() => navigate(`/customizeProduct/selectScenes${search}`)}>Customization</Nav.Link>
          <Nav.Link className={`${colorModeClass}-navbar-link`} onClick={() => navigate(`/generatedProductHistory${search}`)}>My Data</Nav.Link>
          <NavDropdown  className={`${colorModeClass}-navbar-dropdown`} title="Data Discovery" id="basic-nav-dropdown" menuVariant="dark">
            <NavDropdown.Item href="https://search.earthdata.nasa.gov/search" target="_blank">Earthdata Search</NavDropdown.Item>
            <NavDropdown.Item href="https://podaac.jpl.nasa.gov/" target="_blank">PO.DAAC Portal</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link className={`${colorModeClass}-navbar-link`} onClick={() => navigate(`/about${search}`)}>About</Nav.Link>
        </Nav>
        <NavDropdown  className={`${colorModeClass}-text`} title={renderUserDropdownTitle()} id="basic-nav-dropdown" align="end" style={{marginRight: '20px'}} menuVariant="dark">
            <Row>
              <Col>
                <NavDropdown.Item>Email: {email}</NavDropdown.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <NavDropdown.Item onClick={() => dispatch(setUserNotAuthenticated())}>Logout</NavDropdown.Item>
              </Col>
            </Row>
        </NavDropdown>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MainNavbar;