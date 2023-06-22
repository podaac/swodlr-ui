import { Col, Row } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { PersonSquare } from 'react-bootstrap-icons';
import { setCurrentPage, setUserNotAuthenticated } from '../app/appSlice';

const MainNavbar = () => {
  const dispatch = useAppDispatch()
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)

  const renderUserDropdownTitle = () => (
      <span>
        <PersonSquare /> {`Username`}
      </span>
  )

  return (
    <Navbar className={`${colorModeClass}-navbar-background Main-navbar`} expand="lg">
      <Navbar.Brand className={`${colorModeClass}-text`} style={{marginLeft: '20px', pointerEvents: 'none'}}>SWODLR</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link className={`${colorModeClass}-navbar-link`} href="#productCustomization" onClick={() => dispatch(setCurrentPage('productCustomization'))}>Customization</Nav.Link>
          <Nav.Link className={`${colorModeClass}-navbar-link`} href="#generatedProductsHistory" onClick={() => dispatch(setCurrentPage('generatedProductsHistory'))}>My Data</Nav.Link>
          <NavDropdown  className={`${colorModeClass}-navbar-dropdown`} title="Data Discovery" id="basic-nav-dropdown" menuVariant="dark">
            <NavDropdown.Item href="https://search.earthdata.nasa.gov/search" target="_blank">Earthdata Search</NavDropdown.Item>
            <NavDropdown.Item href="https://podaac.jpl.nasa.gov/" target="_blank">PO.DAAC Portal</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link className={`${colorModeClass}-navbar-link`} href="#about" onClick={() => dispatch(setCurrentPage('about'))}>About</Nav.Link>
        </Nav>
        <NavDropdown  className={`${colorModeClass}-text`} title={renderUserDropdownTitle()} id="basic-nav-dropdown" align="end" style={{marginRight: '20px'}} menuVariant="dark">
            <Row>
              <Col>
                <NavDropdown.Item>Email: username@gmail.com</NavDropdown.Item>
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