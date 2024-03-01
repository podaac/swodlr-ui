import { Alert, Col, Row } from 'react-bootstrap';
import GranuleTable from './GranulesTable';
import GranuleTableAlerts from './GranuleTableAlerts';
import SpatialSearchOptions from './SpatialSearchOptions';

const GranuleSelectionView = () => {
  return (
    <div>
        <SpatialSearchOptions />
        <GranuleTable tableType='granuleSelection'/>
        <GranuleTableAlerts tableType='granuleSelection'/>
        <div style={{padding: '0px 20px 0px 20px'}} id='alert-messages'>
            <Row style={{paddingTop: '5px', paddingBottom: '10px'}}>
              <Col md={{ span: 8, offset: 2 }}>
                <Alert variant={'warning'}>The SWOT dataset is not public yet. Until then, some functionality of this site will be limited. You are not yet able to add scenes, configure scenes, or generate products.</Alert>
              </Col>
            </Row>
        </div>
    </div>
  );
}

export default GranuleSelectionView;