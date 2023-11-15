import { Button, Col, Row } from 'react-bootstrap';
import { ArrowReturnRight} from 'react-bootstrap-icons';
import GranuleTable from './GranulesTable';
import { useAppSelector } from '../../redux/hooks'
import GranuleTableAlerts from './GranuleTableAlerts';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomizeProductsSidebar from './CustomizeProductsSidebar';
import { GranuleSelectionAndConfigurationViewProps } from '../../types/constantTypes';
import WorldMap from '../map/WorldMap'

const GranuleSelectionAndConfigurationView = (props: GranuleSelectionAndConfigurationViewProps) => {
  const {mode} = props
  
  return (
    <>
       <CustomizeProductsSidebar mode={mode}/>
       <WorldMap />
    </>
  );
}

export default GranuleSelectionAndConfigurationView;