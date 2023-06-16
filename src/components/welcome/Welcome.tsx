import { Button, Col, Row } from 'react-bootstrap';
import { useAppDispatch } from '../../redux/hooks'
import swotPosterCropped from '../../assets/swotPosterCropped.png'
import { setCurrentPage, setUserAuthenticated } from '../app/appSlice';
import { checkUserAuthentication } from './authentication';
import { AuthenticationResponse } from '../../types/authenticationTypes';
import PodaacNavbar from '../navbar/PodaacNavbar';
import { ArrowDown } from 'react-bootstrap-icons';
import NavbarContainer from '../navbar/NavbarContainer';

const Welcome = () => {
  const dispatch = useAppDispatch()
  const testMode: boolean = true

  const handleLogin = async () => {
    if (testMode) {
      dispatch(setCurrentPage('productCustomization'))
      dispatch(setUserAuthenticated())
    } else {
      const response: AuthenticationResponse = await checkUserAuthentication() ?? {status: 'unknown'}
      console.log(response)
      if (response.status === 'authenticated') {
        dispatch(setUserAuthenticated())
      } else if (response.status === 'unauthenticated') {
        // redirect
        window.location.replace(response.redirectUrl as string);
      }
    }
  }

  return (
      <Row style={{margin: 'auto'}}>
        <Row style={{marginTop: '6%', marginBottom: '0%'}}><h1 className='welcome-page-text'>SWOT Level-2 On-demand Raster Generator</h1></Row>
        <Row style={{marginTop: '10%'}}>
          <Col sm={6}>
          <Row style={{marginTop: '0%', marginBottom: '2%'}}><h2 className='welcome-page-text'>Welcome to SWODLR</h2></Row>
            <Row style={{marginTop: '10%', marginBottom: '2%'}}><h3 className='welcome-page-text'>Login to Continue:</h3></Row>
            <Row style={{marginTop: '2%', marginBottom: '5%'}}>
              <Col><Button variant='success' size='lg' onClick={() => handleLogin()}>Earthdata Login</Button></Col>
            </Row>
            <Row style={{marginTop: '5%', marginBottom: '10%'}}><p className='welcome-page-text'>To use this application, you need to sign in via Earthdata Login.</p></Row>
          </Col>
          <Col sm={6} style={{height: '100%'}}>
            {/* <img src={swotPosterCropped} alt="SWOT Poster Graphic" style={{height: '60vh', width: '40vh', padding: '0px', borderRadius: '00px'}}></img> */}
            <Row><h3>1. Select Scenes to Customize</h3></Row>
            <Row style={{marginTop: '20px', marginBottom: '20px'}}><ArrowDown size={36}/></Row>
            <Row><h3>2. Customize Parameters</h3></Row>
            <Row style={{marginTop: '20px', marginBottom: '20px'}}><ArrowDown size={36}/></Row>
            <Row><h3>3. Generate Custom Raster Products</h3></Row>
          </Col>
        </Row>
      </Row>  
  )
}

export default Welcome;