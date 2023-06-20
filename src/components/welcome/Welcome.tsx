import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
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
      <Row>
        <Row style={{marginTop: '6%', marginBottom: '0%'}}><h1 className='welcome-page-text'>SWOT Level-2 On-demand Raster Generator</h1></Row>
        <Row style={{marginTop: '5%', height: '100%'}}>
          <Col sm={6} style={{borderRight: 'solid'}}>
            <Row style={{marginTop: '10%'}}>
              <Col md={{ span: 8, offset: 2 }}>
                <Card className='loginButtonCard' style={{width: '90%'}}>
                  <Card.Body>
                    <Card.Text style={{marginTop: '0%', marginBottom: '10%'}}><h3 className='welcome-page-text'>Login to Continue:</h3></Card.Text>
                    <Button variant='success' size='lg' onClick={() => handleLogin()}>Earthdata Login</Button>
                    <Card.Text style={{marginTop: '10%', marginBottom: '0%'}}><p className='welcome-page-text'>To use this application, you need to sign in via Earthdata Login. The login button above will redirect you to the Earthdata Login site then you will be redirected back to SWODLR.</p></Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col sm={6} style={{height: '100%', paddingRight: '100px', paddingLeft: '100px'}}>
            <Row style={{marginTop: '20px', marginBottom: '20px'}}>
              <Col md={{ span: 10, offset: 1 }}><h2>How to use application</h2></Col>
            </Row>
            <ListGroup>
              <ListGroup.Item className='howToListItem'>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h4>1.</h4></Col>
                  <Col md={{ span: 3, offset: 0 }}><h4>Select Scenes</h4></Col>
                  <Col md={{ span: 5, offset: 1 }}><h6>Select scenes to turn into customized raster products and visualize them on a map.</h6></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='howToListItem'>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h4>2.</h4></Col>
                  <Col md={{ span: 3, offset: 0 }}><h4>Customize</h4></Col>
                  <Col md={{ span: 5, offset: 1 }}><h6>Customize generation parameters to fit with your use case.</h6></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='howToListItem'>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h4>3.</h4></Col>
                  <Col md={{ span: 3, offset: 0 }}><h4>Generate</h4></Col>
                  <Col md={{ span: 5, offset: 1 }}><h6>Generate multiple rasters at once with  custom parameters.</h6></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='howToListItem'>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h4>4.</h4></Col>
                  <Col md={{ span: 3, offset: 0 }}><h4>Download</h4></Col>
                  <Col md={{ span: 5, offset: 1 }}><h6>Download generated products once processing is complete.</h6></Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Row>  
  )
}

export default Welcome;