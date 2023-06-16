import { Col, Form, Row } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setDarkMode, setLightMode } from './navbarSlice';
// import swotLogo from '../../assets/swot_mainlogo_portrait.jpg'
import { PersonSquare } from 'react-bootstrap-icons';
import { setCurrentPage, setUserNotAuthenticated } from '../app/appSlice';

const PodaacFooter = () => {
  const dispatch = useAppDispatch()
  const darkMode = useAppSelector((state) => state.navbar.darkMode)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)

  const renderUserDropdownTitle = () => (
      <span>
        <PersonSquare /> {`Username`}
      </span>
  )

  return (
    <Navbar className={`${colorModeClass}-navbar-background Main-navbar fixed-bottom`} style={{paddingTop: '0px', paddingBottom: "0px"}} expand="lg">
      <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '20px'}}>
        Version 1.0 Alpha of SWOT On-Demand Level-2 Raster Generator (SWODLR)
      </Navbar.Text>
    </Navbar>
  );
}

export default PodaacFooter;