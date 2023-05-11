import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import { useAppSelector } from "../../redux/hooks";
import { GenerateProductParameters, StatusTypes } from "../../types/constantTypes";

const getBadgeColor = (status: StatusTypes) => {
    if (status === 'IN_PROGRESS') {
        return 'secondary'
    } else if (status === 'COMPLETE') {
        return 'success'
    }
}

const getBadgeLabel = (status: StatusTypes) => {
    if (status === 'IN_PROGRESS') {
        return 'In Progress'
    } else if (status === 'COMPLETE') {
        return 'Complete'
    }
}



const GeneratedProductHistory = () => {
    const generatedProducts = useAppSelector((state) => state.product.generatedProducts)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)

    const renderCardContents = (status: StatusTypes, granuleId: string, generationParameters: GenerateProductParameters) => (
        <Col style={{margin: '10px'}}>
            <Card className={`${colorModeClass}-text`} style={{ width: '18rem' }}>
                {/* <Card.Header className={`${colorModeClass}-text`} style={{color: 'black'}}>{granuleId}</Card.Header> */}
                <Card.Title className={`${colorModeClass}-text`} style={{color: 'black'}}>{granuleId}</Card.Title>
                {/* <Card.Text className={`${colorModeClass}-text`} style={{color: 'black'}}>
                    Parameters Used to Generate
                </Card.Text> */}
                <Card.Header  style={{color: 'black'}}> Parameters Used to Generate</Card.Header>
                <ListGroup>
                    {Object.entries(generationParameters).map(entry => <ListGroup.Item>{`${entry[0]}: ${entry[1]}`}</ListGroup.Item>)}
                </ListGroup>
                <Badge pill bg={getBadgeColor(status)} style={{margin: '20px'}}>
                    {getBadgeLabel(status)}
                </Badge>
            </Card>
        </Col>
    )

    return (
        <Row>
            {generatedProducts.map(genProductObj => renderCardContents(genProductObj.status, genProductObj.granuleId, genProductObj.parametersUsedToGenerate))}
        </Row>
    );
}

export default GeneratedProductHistory;