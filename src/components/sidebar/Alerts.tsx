import { useAppSelector } from '../../redux/hooks'
import { Alert, Col, Row } from 'react-bootstrap';
import DeleteGranulesModal from './DeleteGranulesModal';
import { AlertLocation, AlertMessageObject, AlertProps } from '../../types/constantTypes';
import { useLocation, useNavigate } from 'react-router-dom';
import { alertStylesWithPointer } from '../../constants/rasterParameterConstants';

const Alerts = (props: AlertProps) => {
  const { location } = props
  const alerts = useAppSelector((state) => state.product.alerts)
  const navigate = useNavigate()
  const { search } = useLocation();

  const customOnClick = (location: AlertLocation) => {
    if (location === 'generate') {
      navigate(`/generatedProductHistory${search}`)
    }
  }

  const alertCursorStyle = alertStylesWithPointer.includes(location) ? 'pointer' : 'default'

  return (
    <div style={{padding: '0px 20px 0px 20px'}}>
      {alerts.filter((alert: AlertMessageObject) => alert.location === location).map((alertObject, index) => (
        <Row key={`${alertObject.variant}-${index}`} style={{paddingTop: '5px', paddingBottom: '10px'}}>
          <Col md={{ span: 8, offset: 2 }}>
            <Alert style={{cursor: alertCursorStyle}} variant={`${alertObject.variant}`} onClick={() => customOnClick(location)}>{alertObject.message}</Alert>
          </Col>
        </Row>
      ))}
      <DeleteGranulesModal />
    </div>
  );
}

export default Alerts;