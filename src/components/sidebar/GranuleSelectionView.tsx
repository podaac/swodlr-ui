import { Button, Col, Row } from 'react-bootstrap';
import { ArrowReturnRight} from 'react-bootstrap-icons';
import GranuleTable from './GranulesTable';
import { useAppSelector } from '../../redux/hooks'
import GranuleTableAlerts from './GranuleTableAlerts';
import { useLocation, useNavigate } from 'react-router-dom';

const GranuleSelectionView = () => {
    const addedProducts = useAppSelector((state) => state.product.addedProducts)
    const navigate = useNavigate();
    const { search } = useLocation();

  return (
    <>
        <GranuleTable tableType='granuleSelection'/>
        <GranuleTableAlerts />
        <hr></hr>
        <Row style={{marginBottom: '10px', marginRight: '10px', marginLeft: '10px'}}>
            <Col>
                <Button variant='success' disabled={addedProducts.length === 0} onClick={() => navigate(`/customizeProduct/configureOptions${search}`)}>Configure Products <ArrowReturnRight /></Button>
            </Col>
        </Row>
    </>
  );
}

export default GranuleSelectionView;