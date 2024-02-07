import GranuleTable from './GranulesTable';
import GranuleTableAlerts from './GranuleTableAlerts';
import SpatialSearchOptions from './SpatialSearchOptions';

const GranuleSelectionView = () => {
  return (
    <div>
        <SpatialSearchOptions />
        <GranuleTable tableType='granuleSelection'/>
        <GranuleTableAlerts />
        {/* <hr></hr>
        <Row style={{marginBottom: '10px', marginRight: '10px', marginLeft: '10px'}}>
            <Col>
                <Button variant='success' disabled={addedProducts.length === 0} onClick={() => navigate(`/customizeProduct/configureOptions${search}`)} id='configure-products-button'>Configure Products <ArrowReturnRight /></Button>
            </Col>
        </Row> */}
    </div>
  );
}

export default GranuleSelectionView;