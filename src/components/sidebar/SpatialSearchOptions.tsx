import { Alert, Col, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSpatialSearchEndDate, setSpatialSearchStartDate } from './actions/productSlice';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const SpatialSearchOptions = () => {
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const spatialSearchStartDate = useAppSelector((state) => state.product.spatialSearchStartDate)
  const spatialSearchEndDate = useAppSelector((state) => state.product.spatialSearchEndDate)
  const userHasCorrectEdlPermissions = useAppSelector((state) => state.app.userHasCorrectEdlPermissions)
  const dispatch = useAppDispatch()

  // set spatial search start and end date if in url params
  useEffect(() => {
    const startDateParam = searchParams.get('spatialSearchStartDate')
    if (startDateParam && startDateParam !== spatialSearchStartDate) {
      dispatch(setSpatialSearchStartDate(startDateParam))
    }
  }, [spatialSearchStartDate])

  useEffect(() => {
    const endDateParam = searchParams.get('spatialSearchEndDate')
    if (endDateParam && (new Date(endDateParam)) !== (new Date(spatialSearchEndDate))) {
      dispatch(setSpatialSearchEndDate(endDateParam))
    }
  }, [spatialSearchEndDate])

  const [searchParams, setSearchParams] = useSearchParams();

  const addSearchParamToCurrentUrlState = (newPairsObject: object, remove?: string) => {
    const currentSearchParams = Object.fromEntries(searchParams.entries())
    Object.entries(newPairsObject).forEach(pair => {
        currentSearchParams[pair[0]] = pair[1].toString()
    })
    
    // remove unused search param
    if (remove) {
        delete currentSearchParams[remove]
    }
    setSearchParams(currentSearchParams)
}

  const handleSetSpatialSearchStartDate = (dateToSet: Date) => {
    addSearchParamToCurrentUrlState({'spatialSearchStartDate': dateToSet.toISOString()})
    dispatch(setSpatialSearchStartDate((dateToSet.toISOString())))
  }  

  const handleSetSpatialSearchEndDate = (dateToSet: Date) => {
    addSearchParamToCurrentUrlState({'spatialSearchEndDate': dateToSet.toISOString()})
    dispatch(setSpatialSearchEndDate((dateToSet.toISOString())))
  }  

  return (
    <div style={{backgroundColor: '#2C415C', marginTop: '10px', marginBottom: '10px', paddingBottom: '10px'}} className='g-0 shadow' id='spatial-search-options'>
      <Row style={{marginRight: '0px', marginLeft: '0px', paddingBottom: '5px', paddingTop: '5px'}} className={`${colorModeClass}-sidebar-section-title`}>
        <Col><h5 className={`${colorModeClass}-text`} >Spatial Search Options</h5></Col>
      </Row>
      <Row style={{marginLeft: '0px', marginRight: '0px', paddingTop: '10px', paddingBottom: '5px'}}>
        <Col>Start Date</Col>
        <Col> 
          <DatePicker
            selected={new Date(spatialSearchStartDate)}
            onChange={date => handleSetSpatialSearchStartDate(date as Date)}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
          />
        </Col>
      </Row>
      <Row style={{marginLeft: '0px', marginRight: '0px', paddingTop: '5px', paddingBottom: '10px'}}>
        <Col>End Date</Col>
        <Col> 
        <DatePicker
            selected={new Date(spatialSearchEndDate)}
            onChange={date => handleSetSpatialSearchEndDate(date as Date)}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
          />
        </Col>
      </Row>
      {/* <Row>
        <Col>
          <Button variant='primary' size='sm' onClick={() => console.log('run spatial search')}>
            <Search size={10}/> Find Scenes on Map
          </Button>
        </Col>
      </Row> */}
      <Row style={{marginLeft: '0px', marginRight: '0px'}}>
        <Col style={{}}>
          {/* <Alert variant="secondary" style={{marginLeft: '20px', marginRight:'20px'}}>
            <p>
              Draw areas to search spatially on the map by using the controls on the top right
            </p>
          </Alert> */}
          <p>
            Draw areas to <b>search spatially</b> on the map by using the controls on the <b>top right</b>. The scene search will start once you finish drawing the search area shape.
          </p>
        </Col>
      </Row>
      {userHasCorrectEdlPermissions ? null :
        (<Row style={{marginLeft: '0px', marginRight: '0px'}}>
          <Col style={{}}>
            <Alert variant="warning">
              <p>
                Spatial search is not available because the SWOT dataset that allows this feature is not currently publicly available.
              </p>
            </Alert>
          </Col>
        </Row>)
      }
    </div>
  );
}

export default SpatialSearchOptions;