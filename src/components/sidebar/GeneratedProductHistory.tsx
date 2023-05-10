import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { useAppSelector } from "../../redux/hooks";
import { StatusTypes } from "../../types/constantTypes";

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

    return (
        <Row>
            {generatedProducts.map(genProductObj => (
                <Col style={{margin: '10px'}}>
                <Card className={`${colorModeClass}-text`} style={{ width: '18rem' }}>
                    <Card.Header className={`${colorModeClass}-text`} style={{color: 'black'}}>Product</Card.Header>
                    <Card.Title className={`${colorModeClass}-text`} style={{color: 'black'}}>{genProductObj.granuleId}</Card.Title>
                    {/* <Card.Text className={`${colorModeClass}-text`} style={{color: 'black'}}>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                    </Card.Text> */}
                    <Badge pill bg={getBadgeColor(genProductObj.status)}>
                        {getBadgeLabel(genProductObj.status)}
                    </Badge>
                </Card>
                </Col>
            ))}
        </Row>
    );
}

export default GeneratedProductHistory;