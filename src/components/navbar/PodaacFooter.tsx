import Navbar from 'react-bootstrap/Navbar';
import { useAppSelector } from '../../redux/hooks'

const PodaacFooter = () => {
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)

  return (
    <Navbar className={`${colorModeClass}-navbar-background Main-navbar fixed-bottom`} style={{paddingTop: '0px', paddingBottom: "0px", marginRight: '0px'}} expand="lg">
      <Navbar.Text className={`${colorModeClass}-navbar-link`} style={{marginLeft: '20px'}}>
        Version 1.0 Pre-Alpha of SWOT On-Demand Level-2 Raster Generator (SWODLR)
      </Navbar.Text>
    </Navbar>
  );
}

export default PodaacFooter;