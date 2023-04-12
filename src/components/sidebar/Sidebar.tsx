import { Button, Container, Form, Col, Row} from 'react-bootstrap';


function Sidebar() {
  return (
    <Container className='Sidebar-container'>
        <Col>
            <Form>
                <Row>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Parameter IDs</Form.Label>
                        <Form.Control type="email" placeholder="cycle_id" />
                        <Form.Control type="email" placeholder="pass_id" />
                        <Form.Control type="email" placeholder="scene_id" />
                    </Form.Group>
                </Row>
                <Row>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Product Configurations</Form.Label>
                    <Form.Select aria-label="Premade Options">
                        <option value="1">Open Ocean</option>
                        <option value="2">Costal</option>
                        <option value="3">River</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                        Configuration options premade by the SWOT science team.
                    </Form.Text>
                    <Form.Control disabled type="email" placeholder="output_granule_extent_flag" />
                    <Form.Control disabled type="email" placeholder="output_sampling_grid_type" />
                    <Form.Control disabled type="email" placeholder="raster_resolution" />
                    <Form.Control disabled type="email" placeholder="utm_zone_adjust" />
                    <Form.Control disabled type="email" placeholder="mgrs_band_adjust" />
                    <Button variant="primary" type="submit">
                    Save Custom Config
                </Button>
                </Form.Group>
                </Row>
                <Row>
                    <Form.Group>
                        <Button variant="primary" type="submit">
                            Create Raster
                        </Button>
                    </Form.Group>
                </Row>
            </Form>
        </Col>
    </Container>
  );
}

export default Sidebar;