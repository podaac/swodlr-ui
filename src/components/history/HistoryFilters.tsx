import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import { ProductState } from "../../types/graphqlTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCurrentFilter } from "../sidebar/actions/productSlice";
import { defaultFilterParameters, defaultSpatialSearchEndDate, defaultSpatialSearchStartDate, parameterOptionValues, rasterResolutionOptions } from "../../constants/rasterParameterConstants";
import { useState } from "react";
import { OutputGranuleExtentFlagOptions, OutputSamplingGridType, RasterResolution, Adjust, FilterParameters, FilterAction } from "../../types/historyPageTypes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const HistoryFilters = () => {
    const dispatch = useAppDispatch()
    const [currentFilters, setCurrentFilters] = useState<FilterParameters>(defaultFilterParameters)
    const [endDateToUse, setEndDateToUse] = useState<Date>(defaultSpatialSearchEndDate)
    const [startDateToUse, setStartDateToUse] = useState<Date>(defaultSpatialSearchStartDate)

    const handleChangeFilters = (filter: FilterAction, value: string) => {        
        const currentFiltersToModify: FilterParameters = structuredClone(currentFilters)
        switch(filter) {
          case 'cycle':
            if(value === '') {
                currentFiltersToModify[filter] = 'none'
            } else {
                currentFiltersToModify[filter] = value
            }
            break;
          case 'pass':
            if(value === '') {
                currentFiltersToModify[filter] = 'none'
            } else {
                currentFiltersToModify[filter] = value
            }
            break;
          case 'scene':
            if(value === '') {
                currentFiltersToModify[filter] = 'none'
            } else {
                currentFiltersToModify[filter] = value
            }
            break;
          case 'status':
            if(currentFiltersToModify[filter].includes(value as ProductState)) {
              // remove the value
              currentFiltersToModify[filter] = currentFiltersToModify[filter].filter(filterCopyObject => filterCopyObject !== value)
            } else {
                currentFiltersToModify[filter].push(value as ProductState)
            }
            break;
          case 'outputGranuleExtentFlag':
            if(currentFiltersToModify[filter].includes(value as OutputGranuleExtentFlagOptions)) {
              // remove the value
              currentFiltersToModify[filter] = currentFiltersToModify[filter].filter(filterCopyObject => filterCopyObject !== value)
            } else {
                currentFiltersToModify[filter].push(value as OutputGranuleExtentFlagOptions)
            }
            break;
          case 'outputSamplingGridType':
            if(currentFiltersToModify[filter].includes(value as OutputSamplingGridType)) {
              // remove the value
              currentFiltersToModify[filter] = currentFiltersToModify[filter].filter(filterCopyObject => filterCopyObject !== value)
            } else {
                currentFiltersToModify[filter].push(value as OutputSamplingGridType)
            }
            break;
          case 'rasterResolution':
            if(currentFiltersToModify[filter].includes(value as RasterResolution)) {
              // remove the value
              currentFiltersToModify[filter] = currentFiltersToModify[filter].filter(filterCopyObject => filterCopyObject !== value)
            } else {
                currentFiltersToModify[filter].push(value as RasterResolution)
            }
            break;
          case 'utmZoneAdjust':
            if(currentFiltersToModify[filter].includes(value as Adjust)) {
              // remove the value
              currentFiltersToModify[filter] = currentFiltersToModify[filter].filter(filterCopyObject => filterCopyObject !== value)
            } else {
                currentFiltersToModify[filter].push(value as Adjust)
            }
            break;
          case 'mgrsBandAdjust':
            if(currentFiltersToModify[filter].includes(value as Adjust)) {
              // remove the value
              currentFiltersToModify[filter] = currentFiltersToModify[filter].filter(filterCopyObject => filterCopyObject !== value)
            } else {
                currentFiltersToModify[filter].push(value as Adjust)
            }
            break;
        case 'endDate':
            if(value === 'none') {
                currentFiltersToModify[filter] = 'none'
                setEndDateToUse(defaultSpatialSearchEndDate)
            } else {
                currentFiltersToModify[filter] = new Date(value)
                setEndDateToUse(new Date(value))
            }
            break;
        case 'startDate':
            if(value === 'none') {
                currentFiltersToModify[filter] = 'none'
                setStartDateToUse(defaultSpatialSearchStartDate)
            } else {
                currentFiltersToModify[filter] = new Date(value)
                setStartDateToUse(new Date(value))
            }
            break;
          default:
            // code block
        }
        setCurrentFilters(currentFiltersToModify)
    }

    const statusOptions = ['NEW', 'UNAVAILABLE', 'GENERATING', 'ERROR', 'READY', 'AVAILABLE']
    const outputGranuleExtentFlagOptions = ['128 x 128', '256 x 128']
    const outputSamplingGridTypeOptions = parameterOptionValues.outputSamplingGridType.values.map(value => {
        const valueToUse = value as string
        return valueToUse.toUpperCase()})
    const rasterResolutionOptionsUTMOptions = rasterResolutionOptions.UTM.map(value => value.toString())
    const rasterResolutionOptionsGEOOptions = rasterResolutionOptions.GEO.map(value => value.toString())
    const zoneAdjustOptions = ['+1', '0', '-1']

    return (
        <Col className="table-filter">
            <Row style={{paddingTop: '5px'}}><h5><b>Filters</b></h5></Row>
            <Row style={{overflowY: 'auto', maxHeight: '59vh'}}>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Cycle</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="cycle-filter-input">
                                    <Form.Control type="number" placeholder="cycle_id" onChange={(e) => handleChangeFilters('cycle', String(e.target.value))}/>
                                </Form.Group>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Pass</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="pass-filter-input">
                                    <Form.Control type="number" placeholder="pass_id" onChange={(e) => handleChangeFilters('pass', String(e.target.value))}/>
                                </Form.Group>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Scene</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="scene-filter-input">
                                    <Form.Control type="number" placeholder="scene_id" onChange={(e) => handleChangeFilters('scene', String(e.target.value))}/>
                                </Form.Group>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Status</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <div key={`default-checkbox`} className="mb-3">
                                    {statusOptions.map(statusString => {
                                        return (
                                            <Form.Check type='checkbox' key={`${statusString}-status-checkbox`} id={`${statusString}-status-checkbox`} label={statusString} checked={currentFilters.status.includes(statusString as ProductState)} onChange={() => handleChangeFilters('status', statusString)}/>
                                        )
                                    })}
                                </div>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Output Granule Extent Flag (km)</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <div key={`default-checkbox`} className="mb-3">
                                    {outputGranuleExtentFlagOptions.map(flagString => {
                                        return (
                                            <Form.Check type='checkbox' key={`${flagString}-outputGranuleExtentFlag-checkbox`} id={`${flagString}-outputGranuleExtentFlag-checkbox`} label={flagString} checked={currentFilters.outputGranuleExtentFlag.includes(flagString as OutputGranuleExtentFlagOptions)} onChange={() => handleChangeFilters('outputGranuleExtentFlag', flagString)}/>
                                        )
                                    })}
                                </div>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Output Sampling Grid Type</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <div key={`default-checkbox`} className="mb-3">
                                    {outputSamplingGridTypeOptions.map(valueString => {
                                        return (
                                            <Form.Check type='checkbox' key={`${valueString}-outputSamplingGridType-checkbox`} id={`${valueString}-outputSamplingGridType-checkbox`} label={valueString} checked={currentFilters.outputSamplingGridType.includes(valueString as OutputSamplingGridType)} onChange={() => handleChangeFilters('outputSamplingGridType', valueString)}/>
                                        )
                                    })}
                                </div>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion >
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Raster Resolution</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <div key={`default-checkbox`} className="mb-3">
                                    <h6>UTM</h6>
                                    {rasterResolutionOptionsUTMOptions.map(valueString => {
                                        return (
                                            <Form.Check type='checkbox' key={`${valueString}-resolution-checkbox`} id={`${valueString}-status-checkbox`} label={valueString} checked={currentFilters.rasterResolution.includes(valueString as RasterResolution)} onChange={() => handleChangeFilters('rasterResolution', valueString)}/>
                                        )
                                    })}
                                    <h6>LAT/LON</h6>
                                    {rasterResolutionOptionsGEOOptions.map(valueString => {
                                        return (
                                            <Form.Check type='checkbox' key={`${valueString}-resolution-checkbox`} label={valueString} checked={currentFilters.rasterResolution.includes(valueString as RasterResolution)} onChange={() => handleChangeFilters('rasterResolution', valueString)}/>
                                        )
                                    })}
                                </div>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="4">
                        <Accordion.Header>UTM Zone Adjust</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <div key={`default-checkbox`} className="mb-3">
                                    {zoneAdjustOptions.map(valueString => {
                                        const strippedValueString = valueString.replace('+', '')
                                        return (
                                            <Form.Check type='checkbox' key={`${strippedValueString}-utmZoneAdjust-checkbox`} id={`${strippedValueString}-utmZoneAdjust-checkbox`} label={valueString} checked={currentFilters.utmZoneAdjust.includes(strippedValueString as Adjust)} onChange={() => handleChangeFilters('utmZoneAdjust', strippedValueString)}/>
                                        )
                                    })}
                                </div>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="5">
                        <Accordion.Header>MGRS Band Adjust</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <div key={`default-checkbox`} className="mb-3">
                                    {zoneAdjustOptions.map(valueString => {
                                        return (
                                            <Form.Check type='checkbox' key={`${valueString}-mgrsBandAdjust-checkbox`} id={`${valueString}-mgrsBandAdjust-checkbox`} label={valueString} checked={currentFilters.mgrsBandAdjust.includes(valueString as Adjust)} onChange={() => handleChangeFilters('mgrsBandAdjust', valueString)}/>
                                        )
                                    })}
                                </div>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="6">
                        <Accordion.Header>Date Generated</Accordion.Header>
                        <Accordion.Body>
                            <h6>End Date</h6>
                            <Row>
                            <DatePicker
                                selected={endDateToUse}
                                onChange={date => handleChangeFilters('endDate', String(date as Date))}
                                timeInputLabel="Time:"
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeInput
                            />
                            </Row>
                            <h6 style={{paddingTop: '10px'}}>Start Date</h6>
                            <Row>
                            <DatePicker
                                selected={startDateToUse}
                                onChange={date => handleChangeFilters('startDate', String(date as Date))}
                                timeInputLabel="Time:"
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeInput
                            />
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Row>
            <Row style={{paddingRight: '20px', paddingLeft: '20px', paddingTop: '7px', paddingBottom: '7px'}}><Button onClick={() => dispatch(setCurrentFilter(currentFilters))}>Apply</Button></Row>
        </Col>
    )
}

export default HistoryFilters;
