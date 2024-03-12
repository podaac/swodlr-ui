import GranuleTable from './GranulesTable';
import GranuleTableAlerts from './GranuleTableAlerts';
import SpatialSearchOptions from './SpatialSearchOptions';

const GranuleSelectionView = () => {
  return (
    <div>
        <SpatialSearchOptions />
        <GranuleTable tableType='granuleSelection'/>
        <GranuleTableAlerts />
    </div>
  );
}

export default GranuleSelectionView;