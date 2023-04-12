import { Container, Row, Col } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function ParameterSelection() {
  return (
    <Container>
        <Row>
            <Col>
                <Row> 
                    <Row>
                    <Form.Label htmlFor="basic-url">Enter IDs</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>Cycle</InputGroup.Text>
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>
                    </Row>
                    <Row>
                        <InputGroup>
                            <InputGroup.Text>Scene</InputGroup.Text>
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>
                    </Row>
                    <Row>
                        <InputGroup>
                            <InputGroup.Text>Pass</InputGroup.Text>
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>
                    </Row>
                </Row>
                <Row>
                    <Form.Label htmlFor="basic-url">Select Product Configurations</Form.Label>
                    <DropdownButton id="dropdown-basic-button" title="Options">
                        <Dropdown.Item href="#/action-1">Open Ocean</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Rivers</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Lakes</Dropdown.Item>
                    </DropdownButton>
                </Row>
            </Col>
            <Col />
            <Col />
        </Row>
    </Container>
  );
}

export default ParameterSelection;