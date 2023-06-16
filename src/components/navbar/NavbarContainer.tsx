import { Col, Row } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import PodaacNavbar from './PodaacNavbar';
import MainNavbar from './MainNavbar';

const NavbarContainer = (props: {showMainNavbar: boolean}) => {
  const {showMainNavbar} = props
  
  return (
  <div className="fixed-top">
    <Row><PodaacNavbar /></Row>
    {showMainNavbar ? <Row><MainNavbar /></Row> : null}
  </div>
  );
}

export default NavbarContainer;