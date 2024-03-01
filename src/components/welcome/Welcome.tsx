import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { useAppSelector } from '../../redux/hooks'
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateEdlAuthorizeLink } from '../../authentication/edl';

const Welcome = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const testMode = false;
  const currentUser = useAppSelector((state) => state.app.currentUser);

  useEffect(() => {
    if (currentUser !== null) {
      navigate('/customizeProduct/selectScenes');
    }
  }, [navigate, currentUser]);

  const handleLogin = () => {
    if (testMode) {
      navigate(`customizeProduct/selectScenes${search}`)
    } else {
      generateEdlAuthorizeLink().then((url) => {
        window.location.replace(url as string)
      })
    } 
  }

  return (
      <Row style={{backgroundColor: '#3d5d82', width: '100%'}}>
        <Row style={{marginTop: '6%', marginBottom: '0%'}}><h2 className='welcome-page-text'>SWOT On-Demand Level-2 Raster Generator</h2></Row>
        <Row style={{marginTop: '5%', height: '100%'}}>
          <Col sm={6} style={{borderRight: 'solid'}}>
            <Row style={{marginTop: '10%'}}>
              <Col md={{ span: 8, offset: 2 }}>
                <Card className='loginButtonCard' style={{width: '90%'}}>
                  <Card.Body>
                    <h4 style={{marginTop: '0%', marginBottom: '10%'}} className='welcome-page-text'>Login to Continue:</h4>
                    <Button variant='success' size='lg' onClick={() => handleLogin()}>Earthdata Login</Button>
                    <Card.Text className='welcome-page-text' style={{marginTop: '10%', marginBottom: '0%'}}>To use this application, you need to sign in via Earthdata Login. The login button above will redirect you to the Earthdata Login site, then you will be redirected back to SWODLR.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col sm={6} style={{height: '100%', paddingRight: '100px', paddingLeft: '100px'}}>
            <Row style={{marginTop: '20px', marginBottom: '20px'}}>
              <Col md={{ span: 10, offset: 1 }}><h3>How to use application</h3></Col>
            </Row>
            <ListGroup>
              <ListGroup.Item className='howToListItem' style={{borderBottom: 'solid 1px'}}>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h5>1.</h5></Col>
                  <Col md={{ span: 4, offset: 0 }}><h5>Select Scenes</h5></Col>
                  <Col md={{ span: 5, offset: 0 }}><h6>Select scenes to turn into customized raster products and visualize them on a map.</h6></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='howToListItem' style={{borderBottom: 'solid 1px'}}>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h5>2.</h5></Col>
                  <Col md={{ span: 4, offset: 0 }}><h5>Customize</h5></Col>
                  <Col md={{ span: 5, offset: 0 }}><h6>Customize generation parameters to fit with your use case.</h6></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='howToListItem' style={{borderBottom: 'solid 1px'}}>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h5>3.</h5></Col>
                  <Col md={{ span: 4, offset: 0 }}><h5>Generate</h5></Col>
                  <Col md={{ span: 5, offset: 0 }}><h6>Generate multiple rasters at once with  custom parameters.</h6></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='howToListItem'>
                <Row style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Col md={{ span: 1, offset: 1 }}><h5>4.</h5></Col>
                  <Col md={{ span: 4, offset: 0 }}><h5>Download</h5></Col>
                  <Col md={{ span: 5, offset: 0 }}><h6>Download generated products once processing is complete.</h6></Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Row>  
  )
}

export default Welcome;