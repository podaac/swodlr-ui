import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { useAppDispatch } from '../../redux/hooks'
import { setCurrentPage, setUserAuthenticated } from '../app/appSlice';
import { checkUserAuthentication } from '../../user/authentication';
import { TestAuthenticationResponse } from '../../types/authenticationTypes';
import { useEffect, useState } from 'react';
import { getUserData } from '../../user/userData';

const Welcome = () => {
  const dispatch = useAppDispatch()
  const testMode: boolean = false

  const [redirectUri, setRedirectUri] = useState("");

  // check if user is authenticated
  useEffect(() => {
    if (!testMode) {
      testAuthentication()
    }
  }, [])

  const testAuthentication = async () => {
    const response: TestAuthenticationResponse = await checkUserAuthentication()
    if (response.authenticated) {
      // const userData = getUserData()
      dispatch(setCurrentPage('productCustomization'))
      dispatch(setUserAuthenticated())
    } else {
      if (response.redirectUri) {
        setRedirectUri(response.redirectUri)
      } else if (response.error) {
        console.log('error: ' + response.error)
      }
    }
  }

  const handleLogin = () => {
    if (testMode) {
      dispatch(setCurrentPage('productCustomization'))
      dispatch(setUserAuthenticated())
    } else {
      window.location.replace(redirectUri as string);
    } 
  }

  return (
      <Row>
        <Row style={{marginTop: '6%', marginBottom: '0%'}}><h1 className='welcome-page-text'>SWOT Level-2 On-demand Raster Generator</h1></Row>
        <Row style={{marginTop: '5%', height: '100%'}}>
          <Col sm={8} style={{borderRight: 'solid'}}>
            <Row style={{marginTop: '10%'}}>
              <Col md={{ span: 8, offset: 2 }}>
                <Card className='loginButtonCard' style={{width: '90%'}}>
                  <Card.Body>
                    <Card.Text style={{marginTop: '0%', marginBottom: '10%'}}><h3 className='welcome-page-text'>Login to Continue:</h3></Card.Text>
                    <Button variant='success' size='lg' onClick={() => handleLogin()}>Earthdata Login</Button>
                    <Card.Text style={{marginTop: '10%', marginBottom: '0%'}}><p className='welcome-page-text'>To use this application, you need to sign in via Earthdata Login. The login button above will redirect you to the Earthdata Login site, then you will be redirected back to SWODLR.</p></Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col sm={4} style={{height: '100%', paddingRight: '100px', paddingLeft: '100px'}}>
            <Row style={{marginTop: '20px', marginBottom: '20px'}}>
              <Col md={{ span: 10, offset: 1 }}><h2>How to use application</h2></Col>
            </Row>
            <ListGroup>
              <ListGroup.Item className='howToListItem' style={{borderBottom: 'solid 1px'}}>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h4>1.</h4></Col>
                  <Col md={{ span: 4, offset: 0 }}><h4>Select Scenes</h4></Col>
                  <Col md={{ span: 5, offset: 0 }}><h6>Select scenes to turn into customized raster products and visualize them on a map.</h6></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='howToListItem' style={{borderBottom: 'solid 1px'}}>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h4>2.</h4></Col>
                  <Col md={{ span: 4, offset: 0 }}><h4>Customize</h4></Col>
                  <Col md={{ span: 5, offset: 0 }}><h6>Customize generation parameters to fit with your use case.</h6></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='howToListItem' style={{borderBottom: 'solid 1px'}}>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h4>3.</h4></Col>
                  <Col md={{ span: 4, offset: 0 }}><h4>Generate</h4></Col>
                  <Col md={{ span: 5, offset: 0 }}><h6>Generate multiple rasters at once with  custom parameters.</h6></Col>
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