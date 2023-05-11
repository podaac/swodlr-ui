import { Button, Col, Form, Row } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setDarkMode, setLightMode } from './navbarSlice';
import swotLogo from '../../assets/swot_mainlogo_portrait.jpg'
import { Person, PersonSquare } from 'react-bootstrap-icons';
import { setUserNotAuthenticated } from '../app/appSlice';

const MainNavbar = () => {
  const dispatch = useAppDispatch()
  const darkMode = useAppSelector((state) => state.navbar.darkMode)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)

  const renderUserDropdownTitle = () => (
      <span>
        <PersonSquare /> {`Username`}
      </span>
  )

  return (
    <Navbar className={`fixed-top ${colorModeClass}-navbar-background Main-navbar`} expand="lg">
      <Navbar.Brand className={`${colorModeClass}-text`} style={{marginLeft: '20px'}} href="#home">SWODLR</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link className={`${colorModeClass}-text`} href="#home">Home</Nav.Link>
          <Nav.Link className={`${colorModeClass}-text`} href="#link">About</Nav.Link>
          <NavDropdown  className={`${colorModeClass}-text`} title="Data Discovery" id="basic-nav-dropdown">
            <NavDropdown.Item href="https://search.earthdata.nasa.gov/search" target="_blank">Earthdata Search</NavDropdown.Item>
            <NavDropdown.Item href="https://podaac.jpl.nasa.gov/" target="_blank">PO.DAAC Portal</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
            <Form.Check 
              type="switch"
              defaultChecked={darkMode}
              className={`dark-mode-switch ${colorModeClass}-text`}
              label="Dark mode"
              id="dark-mode-switch"
              style={{paddingRight: '20px', cursor: 'pointer'}}
              onClick={() => darkMode ? dispatch(setLightMode()) : dispatch(setDarkMode())}
            />
        </Nav>
        <NavDropdown  className={`${colorModeClass}-text`} title={renderUserDropdownTitle()} id="basic-nav-dropdown" align="end" style={{marginRight: '20px'}}>
          <NavDropdown.Item>Email: username@gmail.com</NavDropdown.Item>
          <Button variant='danger' onClick={() => dispatch(setUserNotAuthenticated())}>Logout</Button>
        </NavDropdown>
        {/* <Nav><PersonSquare />Jimmy</Nav> */}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MainNavbar;