import { Accordion, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { GridType, ProductQueryParameters, ProductState, UserProductQueryVariables } from "../../types/graphqlTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCurrentFilter, setWaitingForMyDataFiltering, setWaitingForMyDataFilteringReset } from "../sidebar/actions/productSlice";
import { defaultFilterParameters, defaultSpatialSearchEndDate, defaultSpatialSearchStartDate, inputBounds, parameterOptionValues, rasterResolutionOptions } from "../../constants/rasterParameterConstants";
import { useState } from "react";
import { OutputGranuleExtentFlagOptions, OutputSamplingGridType, RasterResolution, Adjust, FilterParameters, FilterAction } from "../../types/historyPageTypes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Formik } from "formik";

export const getFilterParameters = (currentFilters: FilterParameters, limit?: number, after?: string): UserProductQueryVariables => {
    const productVariablesObject: ProductQueryParameters = {}
    const {cycle, pass, scene, outputGranuleExtentFlag, outputSamplingGridType, startDate, endDate} = currentFilters

    if(typeof limit !== 'undefined') productVariablesObject.limit = limit
    if(typeof after !== 'undefined') productVariablesObject.after = after
    if(cycle !== 'none') {
        productVariablesObject.cycle = parseInt(cycle)
    }
    if (pass !== 'none') {
        productVariablesObject.pass = parseInt(pass)
    }
    if (scene !== 'none') {
        productVariablesObject.scene = parseInt(scene)
    }
    if (outputGranuleExtentFlag.length > 0) {
        let outputGranuleExtentFlagToUse = null
        if(outputGranuleExtentFlag.includes('128 x 128')) outputGranuleExtentFlagToUse = false
        if(outputGranuleExtentFlag.includes('256 x 128')) outputGranuleExtentFlagToUse = true
        if(outputGranuleExtentFlagToUse !== null) productVariablesObject.outputGranuleExtentFlag = outputGranuleExtentFlagToUse
    }
    if (outputSamplingGridType.length > 0) {
        let outputSamplingGridTypeToUse = null
        if(outputSamplingGridType.includes('UTM')) outputSamplingGridTypeToUse = 'UTM'
        if(outputSamplingGridType.includes('LAT/LON')) outputSamplingGridTypeToUse = 'GEO'
        if(outputSamplingGridTypeToUse !== null) productVariablesObject.outputSamplingGridType = outputSamplingGridTypeToUse as GridType
    }

    // filter [status, rasterResolution, utmZoneAdjust, mgrsBandAdjust] after products gotten. 
    // TODO: Implement these into this function once the filtering endpoint supports it.
    if(startDate !== 'none') {
        productVariablesObject.afterTimestamp = startDate.toISOString().replace('Z','')
    }
    if(endDate !== 'none') {
        productVariablesObject.beforeTimestamp = endDate.toISOString().replace('Z','')
    }
    return productVariablesObject as UserProductQueryVariables
}

export const productPassesFilterCheck = (currentFilters: FilterParameters, status: string, rasterResolution: number, utmZoneAdjust?: number, mgrsBandAdjust?: number): boolean => {
    let productPassesFilter = true

    if (currentFilters.status.length > 0 && !currentFilters.status.includes(status as ProductState)) {
        return false
    }
    if (currentFilters.rasterResolution.length > 0 && !currentFilters.rasterResolution.includes(String(rasterResolution) as RasterResolution)) {
        return false
    }
    if (utmZoneAdjust !== undefined && currentFilters.utmZoneAdjust.length > 0 && !currentFilters.utmZoneAdjust.includes(String(utmZoneAdjust) as Adjust)) {
        return false
    }
    if (mgrsBandAdjust !== undefined && currentFilters.mgrsBandAdjust.length > 0 && !currentFilters.mgrsBandAdjust.includes(String(mgrsBandAdjust) as Adjust)) {
        return false
    }
    return productPassesFilter
}

const HistoryFilters = () => {
    const dispatch = useAppDispatch()
    const [currentFilters, setCurrentFilters] = useState<FilterParameters>(defaultFilterParameters)
    const [endDateToUse, setEndDateToUse] = useState<Date>(defaultSpatialSearchEndDate)
    const [startDateToUse, setStartDateToUse] = useState<Date>(defaultSpatialSearchStartDate)
    const waitingForMyDataFiltering = useAppSelector((state) => state.product.waitingForMyDataFiltering)
    const waitingForMyDataFilteringReset = useAppSelector((state) => state.product.waitingForMyDataFilteringReset)
    const [cycleIsValid, setCycleIsValid] = useState<boolean>(true)
    const [passIsValid, setPassIsValid] = useState<boolean>(true)
    const [sceneIsValid, setSceneIsValid] = useState<boolean>(true)

    const handleChangeFilters = (filter: FilterAction, value: string) => {      
        const currentFiltersToModify: FilterParameters = structuredClone(currentFilters)
        switch(filter) {
          case 'cycle':
            if(value === '') {
                currentFiltersToModify[filter] = 'none'
            } else {
                currentFiltersToModify[filter] = value
            }

            const checkCycleIsValid = (parseInt(value) >= inputBounds.cycle.min && parseInt(value) <= inputBounds.cycle.max) || isNaN(parseInt(value))
            setCycleIsValid(checkCycleIsValid)
            break;
          case 'pass':
            if(value === '') {
                currentFiltersToModify[filter] = 'none'
            } else {
                currentFiltersToModify[filter] = value
            }

            const checkPassIsValid = (parseInt(value) >= inputBounds.pass.min && parseInt(value) <= inputBounds.pass.max) || isNaN(parseInt(value))
            setPassIsValid(checkPassIsValid)
            break;
          case 'scene':
            if(value === '') {
                currentFiltersToModify[filter] = 'none'
            } else {
                currentFiltersToModify[filter] = value
            }

            const checkSceneIsValid = (parseInt(value) >= inputBounds.scene.min && parseInt(value) <= inputBounds.scene.max) || isNaN(parseInt(value))
            setSceneIsValid(checkSceneIsValid)
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
        case 'reset':
            
            currentFiltersToModify['cycle'] = 'none'
            currentFiltersToModify['pass'] = 'none'
            currentFiltersToModify['scene'] = 'none'
            currentFiltersToModify['status'] = []
            currentFiltersToModify['outputGranuleExtentFlag'] = []
            currentFiltersToModify['outputSamplingGridType'] = []
            currentFiltersToModify['rasterResolution'] = []
            currentFiltersToModify['utmZoneAdjust'] = []
            currentFiltersToModify['mgrsBandAdjust'] = []
            currentFiltersToModify['endDate'] = 'none'
            currentFiltersToModify['startDate'] = 'none'
            break;
          default:
        }
        setCurrentFilters(currentFiltersToModify)
    }

    const handleApplyFilters = () => {
        dispatch(setCurrentFilter(currentFilters))
        dispatch(setWaitingForMyDataFiltering(true))
    }

    const handleResetFilters = () => {
        dispatch(setCurrentFilter(defaultFilterParameters))
        handleChangeFilters('reset', 'random value')
        dispatch(setWaitingForMyDataFilteringReset(true))
    }

    const statusOptions = ['NEW', 'UNAVAILABLE', 'GENERATING', 'ERROR', 'READY', 'AVAILABLE']
    const outputGranuleExtentFlagOptions = ['128 x 128', '256 x 128']
    const outputSamplingGridTypeOptions = parameterOptionValues.outputSamplingGridType.values.map(value => {
        const valueToUse = value as string
        return valueToUse.toUpperCase()})
    const rasterResolutionOptionsUTMOptions = rasterResolutionOptions.UTM.map(value => value.toString())
    const rasterResolutionOptionsGEOOptions = rasterResolutionOptions.GEO.map(value => value.toString())
    const zoneAdjustOptions = ['+1', '0', '-1']
    const cycleIsInvalid = parseInt(currentFilters['cycle']) < inputBounds.cycle.min || parseInt(currentFilters['cycle']) > inputBounds.cycle.max
    const passIsInvalid = parseInt(currentFilters['pass']) < inputBounds.pass.min || parseInt(currentFilters['pass']) > inputBounds.pass.max
    const sceneIsInvalid = parseInt(currentFilters['scene']) < inputBounds.scene.min || parseInt(currentFilters['scene']) > inputBounds.scene.max
    const applyFilterErrorMessage = `Not Valid: ${cycleIsValid ? '' : 'cycle'}${(!passIsValid || !sceneIsValid) && !cycleIsValid ? ',' : ''} ${passIsValid ? '' : 'pass'}${!sceneIsValid && !passIsValid ? ',' : ''} ${sceneIsValid ? '' : 'scene'}`
    return (
        <Col className="table-filter">
            <Row style={{paddingTop: '5px'}}><h5><b>Filters</b></h5></Row>
            <Row style={{overflowY: 'auto', maxHeight: '55vh'}}>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Cycle</Accordion.Header>
                        <Accordion.Body>
                            <Formik onSubmit={() => {}} initialValues={{}}>
                                <Form>
                                    <Form.Group className="mb-3" controlId="cycle-filter-input">
                                        <Form.Control type="number" isInvalid={cycleIsInvalid} placeholder="cycle_id" onChange={(e) => handleChangeFilters('cycle', String(e.target.value))}/>
                                        <h6 style={{paddingTop: '10px'}}>{`Valid Values: ${inputBounds.cycle.min} - ${inputBounds.cycle.max}`}</h6>
                                    </Form.Group>
                                </Form>
                            </Formik>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion data-bs-theme='dark'>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Pass</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="pass-filter-input">
                                    <Form.Control type="number" isInvalid={passIsInvalid} placeholder="pass_id" onChange={(e) => handleChangeFilters('pass', String(e.target.value))}/>
                                    <h6 style={{paddingTop: '10px'}}>{`Valid Values: ${inputBounds.pass.min} - ${inputBounds.pass.max}`}</h6>
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
                                    <Form.Control type="number" isInvalid={sceneIsInvalid} placeholder="scene_id" onChange={(e) => handleChangeFilters('scene', String(e.target.value))}/>
                                    <h6 style={{paddingTop: '10px'}}>{`Valid Values: ${inputBounds.scene.min} - ${inputBounds.scene.max}`}</h6>
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
                                        const strippedValueString = valueString.replace('+', '')
                                        return (
                                            <Form.Check type='checkbox' key={`${strippedValueString}-mgrsBandAdjust-checkbox`} id={`${strippedValueString}-mgrsBandAdjust-checkbox`} label={valueString} checked={currentFilters.mgrsBandAdjust.includes(strippedValueString as Adjust)} onChange={() => handleChangeFilters('mgrsBandAdjust', strippedValueString)}/>
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
                <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '5px'}} disabled={!cycleIsValid || !passIsValid || !sceneIsValid} onClick={() => handleApplyFilters()}>{waitingForMyDataFiltering ? 
                            <Spinner size="sm" animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner> 
                : 'Apply'}</Button>
                <Button style={{marginTop: '10px', marginBottom: '10px', marginLeft: '5px'}} disabled={!cycleIsValid || !passIsValid || !sceneIsValid} variant='secondary' onClick={() => handleResetFilters()}>{waitingForMyDataFilteringReset ? 
                            <Spinner size="sm" animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner> 
                : 'Reset'}</Button>
                {!cycleIsValid || !passIsValid || !sceneIsValid ? <h6 style={{color: 'red'}}>{applyFilterErrorMessage}</h6> : null}
        </Col>
    )
}

export default HistoryFilters;
