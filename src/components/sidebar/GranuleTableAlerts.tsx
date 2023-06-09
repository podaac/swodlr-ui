import { useAppSelector } from '../../redux/hooks'
import { Alert, Col, Row } from 'react-bootstrap';
import DeleteGranulesModal from './DeleteGranulesModal';

const GranuleTableAlerts = () => {
  const granuleTableAlerts = useAppSelector((state) => state.product.granuleTableAlerts)

  return (
    <div style={{padding: '0px 20px 0px 20px'}}>
      {granuleTableAlerts.map(alertObject => (
        <Row style={{paddingTop: '5px', paddingBottom: '10px'}}>
          <Col md={{ span: 8, offset: 2 }}>
            <Alert variant={`${alertObject.variant}`}>{alertObject.message}</Alert>
          </Col>
        </Row>
      ))}
      <DeleteGranulesModal />
    </div>
  );
}

export default GranuleTableAlerts;