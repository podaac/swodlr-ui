import { Button, Col, Row } from 'react-bootstrap';
import { useAppDispatch } from '../../redux/hooks'
import swotPosterCropped from '../../assets/swotPosterCropped.png'
import { setCurrentPage, setUserAuthenticated } from '../app/appSlice';
import { checkUserAuthentication } from './authentication';
import { AuthenticationResponse } from '../../types/authenticationTypes';
import PodaacNavbar from '../navbar/PodaacNavbar';

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
        <PodaacNavbar />
        <Row style={{marginTop: '7%', marginBottom: '0%'}}><h1 className='welcome-page-text'>Welcome to SWODLR</h1></Row>
        <Row style={{marginTop: '0%', marginBottom: '5%'}}><h2 className='welcome-page-text'>(SWOT Level-2 On-demand Raster Generation)</h2></Row>
        <Row>
          <Col sm={6}>
            <Row style={{marginTop: '10%', marginBottom: '2%'}}><h3 className='welcome-page-text'>Login to Continue:</h3></Row>
            <Row style={{marginTop: '2%', marginBottom: '5%'}}>
              <Col><Button variant='success' size='lg' onClick={() => handleLogin()}>Earthdata Login</Button></Col>
            </Row>
            <Row style={{marginTop: '5%', marginBottom: '10%'}}><p className='welcome-page-text'>To use this application, you need to sign in via Earthdata Login.</p></Row>
          </Col>
          <Col sm={6} style={{paddingRight: '0px', height: '100%'}}>
            <img src={swotPosterCropped} alt="SWOT Poster Graphic" style={{height: '60vh', width: '40vh', padding: '0px', borderRadius: '00px'}}></img>
          </Col>
        </Row>

      </Row>  
  )
}

export default Welcome;