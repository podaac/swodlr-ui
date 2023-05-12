import { Button, Col, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import swotPosterCropped from '../../assets/swotPosterCropped.png'
import { setUserAuthenticated } from '../app/appSlice';
import { checkUserAuthentication } from './authentication';
import e from 'express';
import { AuthenticationResponse } from '../../types/authenticationTypes';

const Welcome = () => {
  // const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const dispatch = useAppDispatch()

  const handleLogin = async () => {
    const response: AuthenticationResponse = await checkUserAuthentication() ?? {status: 'unknown'}
    console.log(response)
    if (response.status === 'authenticated') {
      dispatch(setUserAuthenticated())
    } else if (response.status === 'unauthenticated') {
      // redirect
      window.location.replace(response.redirectUrl as string);
    }
  }

  return (
      <Row className='welcome-page-container' style={{margin: 'auto'}}>
        <Col sm={6}>
          <Row style={{marginTop: '30%', marginBottom: '5%'}}><h1 className='welcome-page-text'>Welcome to SWODLR</h1></Row>
          <Row style={{marginTop: '5%', marginBottom: '20%'}}><h2 className='welcome-page-text'>(SWOT L2 On-demand Raster Generation)</h2></Row>
          <Row style={{marginTop: '20%', marginBottom: '2%'}}><h3 className='welcome-page-text'>Login to Continue:</h3></Row>
          <Row style={{marginTop: '2%', marginBottom: '5%'}}>
            <Col><Button variant='success' size='lg' onClick={() => handleLogin()}>Earthdata Login</Button></Col>
          </Row>
          <Row style={{marginTop: '5%', marginBottom: '10%'}}><p className='welcome-page-text'>To use this application, you need to sign in via Earthdata Login.</p></Row>
        </Col>
        <Col sm={6} style={{paddingRight: '0px', height: '100%'}}>
          <img src={swotPosterCropped} alt="SWOT Poster Graphic" style={{height: '100%', width: '100%', padding: '15px', borderRadius: '50px'}}></img>
        </Col>
      </Row>  
  )
}

export default Welcome;