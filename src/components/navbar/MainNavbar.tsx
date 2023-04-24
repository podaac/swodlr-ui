import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';



const MainNavbar = () => {
  return (
    <Navbar className='Main-navbar' expand="lg">
      <Navbar.Brand style={{marginLeft: '20px', color: 'white'}} href="#home">SWODLR</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link style={{color: 'white'}} href="#home">Home</Nav.Link>
          <Nav.Link style={{color: 'white'}} href="#link">About</Nav.Link>
          <NavDropdown  title="Data Discovery" id="basic-nav-dropdown">
            <NavDropdown.Item href="https://search.earthdata.nasa.gov/search" target="_blank">Earthdata Search</NavDropdown.Item>
            <NavDropdown.Item href="https://podaac.jpl.nasa.gov/" target="_blank">PO.DAAC Portal</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MainNavbar;