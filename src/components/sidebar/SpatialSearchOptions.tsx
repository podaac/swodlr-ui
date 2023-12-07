import { Col, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSpatialSearchEndDate, setSpatialSearchStartDate } from './actions/productSlice';

const SpatialSearchOptions = () => {
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const spatialSearchStartDate = useAppSelector((state) => state.product.spatialSearchStartDate)
    const spatialSearchEndDate = useAppSelector((state) => state.product.spatialSearchEndDate)
    const dispatch = useAppDispatch()

  return (
    <div style={{backgroundColor: '#2C415C', marginTop: '10px', marginBottom: '10px', paddingBottom: '10px'}} className='g-0 shadow'>
      <Row style={{marginRight: '0px', marginLeft: '0px', paddingBottom: '5px', paddingTop: '5px'}} className={`${colorModeClass}-sidebar-section-title`}>
        <Col><h5 className={`${colorModeClass}-text`} >Spatial Search Options</h5></Col>
      </Row>
      <Row className='normal-row' style={{marginLeft: '0px', marginRight: '0px'}}>
        <Col>Start Date</Col>
        <Col> 
          <DatePicker
            selected={new Date(spatialSearchStartDate)}
            onChange={(date) => dispatch(setSpatialSearchStartDate((date as Date).toString()))}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
          />
        </Col>
      </Row>
      <Row className='normal-row' style={{marginLeft: '0px', marginRight: '0px'}}>
        <Col>End Date</Col>
        <Col> 
        <DatePicker
            selected={new Date(spatialSearchEndDate)}
            onChange={(date) => dispatch(setSpatialSearchEndDate((date as Date).toString()))}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
          />
        </Col>
      </Row>
    </div>
  );
}

export default SpatialSearchOptions;