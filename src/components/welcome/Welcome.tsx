import { Button, Col, Row } from 'react-bootstrap';
import { useAppSelector } from '../../redux/hooks'
import swotPosterCropped from '../../assets/swotPosterCropped.png'

const Welcome = () => {
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)

  return (
      <Row className={`${colorModeClass}-background welcome-page-container`} style={{margin: 'auto'}}>
        <Col sm={6}>
          <Row style={{marginTop: '30%', marginBottom: '5%'}}><h1>Welcome to SWODLR</h1></Row>
          <Row style={{marginTop: '5%', marginBottom: '20%'}}><h2>(SWOT L2 On-demand Raster Generation)</h2></Row>
          <Row style={{marginTop: '20%', marginBottom: '2%'}}><h3>Login to Continue:</h3></Row>
          <Row style={{marginTop: '2%', marginBottom: '5%'}}>
            <Col><Button variant='success' size='lg'>Earthdata Login</Button></Col>
          </Row>
          <Row style={{marginTop: '5%', marginBottom: '10%'}}><p>To use this application, you need to sign in via Earthdata Login.</p></Row>
        </Col>
        <Col sm={6} style={{paddingRight: '0px', height: '100%'}}>
          <img src={swotPosterCropped} alt="SWOT Poster Graphic" style={{height: '100%', width: '100%', padding: '15px', borderRadius: '200px'}}></img>
        </Col>
      </Row>  
  )
}

export default Welcome;