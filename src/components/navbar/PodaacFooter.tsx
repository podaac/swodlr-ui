import Navbar from 'react-bootstrap/Navbar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setCurrentPage } from '../app/appSlice';
import { Nav } from 'react-bootstrap';

const PodaacFooter = () => {
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const dispatch = useAppDispatch()

  return (
    <Navbar className={`${colorModeClass}-navbar-background Main-navbar fixed-bottom`} style={{paddingTop: '0px', paddingBottom: "0px", marginRight: '0px'}} expand="lg">
      <Navbar.Text style={{marginLeft: '20px', color: '#C8C7C5'}}>
        Version 1.0 Pre-Alpha of SWOT On-Demand Level-2 Raster Generator (SWODLR)
      </Navbar.Text>
      
      <Nav>
        <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '20px'}}>
        <a href="https://www.jpl.nasa.gov/caltechjpl-privacy-policies-and-important-notices" target="_blank" style={{color: 'white'}} rel="noreferrer">Privacy</a>
        </Navbar.Text>
        <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '20px'}}>
        |
        </Navbar.Text>
        <Navbar.Text style={{marginLeft: '20px', color: 'white', cursor: 'pointer'}} onClick={() => dispatch(setCurrentPage('about'))}>
        <u>About SWODLR</u>
        </Navbar.Text>
        <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '20px'}}>
        |
        </Navbar.Text>
        <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '20px', color: 'white', cursor: 'pointer'}} onClick={() => window.open('mailto:podaac@podaac.jpl.nasa.gov')}>
        <u>Contact</u>
        </Navbar.Text>
      </Nav>
    </Navbar>
  );
}

export default PodaacFooter;