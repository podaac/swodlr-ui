import { Col, Row } from "react-bootstrap";

const ErrorPage = (props: {errorCode: string}) => {
    const {errorCode} = props
    return (
        <Col className="about-page" style={{marginTop: '70px', paddingRight: '12px', marginLeft: '0px', height: '100%'}}>
            <Row style={{paddingTop: '200px'}}><h4>{errorCode} error</h4></Row>
        </Col>
    );
}

export default ErrorPage;