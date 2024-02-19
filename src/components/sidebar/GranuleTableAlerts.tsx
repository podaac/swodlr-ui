import { useAppSelector } from '../../redux/hooks'
import { Alert, Col, Row } from 'react-bootstrap';
import DeleteGranulesModal from './DeleteGranulesModal';
import { TableTypes } from '../../types/constantTypes';

const GranuleTableAlerts: React.FC<{tableType: TableTypes}> = ({tableType}) => {
  const granuleTableAlerts = useAppSelector((state) => state.product.granuleTableAlerts)

  return (
    <div style={{padding: '0px 20px 0px 20px'}} id='alert-messages'>
      {granuleTableAlerts.filter(item => item.tableType === tableType).map((alertObject, index) => (
        <Row key={`${alertObject.variant}-${index}`} style={{paddingTop: '5px', paddingBottom: '10px'}}>
          <Col md={{ span: 8, offset: 2 }}>
            <Alert variant={`${alertObject.variant}`} dismissible>{alertObject.message}</Alert>
          </Col>
        </Row>
      ))}
      <DeleteGranulesModal />
    </div>
  );
}

export default GranuleTableAlerts;