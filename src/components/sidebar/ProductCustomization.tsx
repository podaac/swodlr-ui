import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import Form from 'react-bootstrap/Form';
import { Alert, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { parameterHelp, parameterOptionValues } from '../../constants/rasterParameterConstants'
import { InfoCircle } from 'react-bootstrap-icons';
import { setGenerateProductParameters, setShowUTMAdvancedOptions } from "./actions/productSlice";
import { useSearchParams } from 'react-router-dom';
import { GenerateProductParameters } from '../../types/constantTypes';

// TODO: revert back after ONLY RESOLUTION SELECTION period is over. Search todos related to disabled and featureNotAvailable

const ProductCustomization = () => {
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const generateProductParameters = useAppSelector((state) => state.product.generateProductParameters)
    const showUTMAdvancedOptions = useAppSelector((state) => state.product.showUTMAdvancedOptions)
    
    const dispatch = useAppDispatch()

    const {outputSamplingGridType, rasterResolutionUTM, rasterResolutionGEO} = generateProductParameters

    const cleanUpCurrentParametersObject = (currentSearchParamObject: any): GenerateProductParameters => {
        const objectToReturn = {...currentSearchParamObject}
        Object.entries(currentSearchParamObject).forEach(paramEntry => {
            switch(paramEntry[0]) {
                case 'outputGranuleExtentFlag':
                    // set outputGranuleExtentFlag
                    objectToReturn['outputGranuleExtentFlag'] = parseInt(currentSearchParamObject['outputGranuleExtentFlag'])
                    break;
                case 'rasterResolutionGEO':
                    // set raster resolution and output sampling grid type
                    objectToReturn['rasterResolutionGEO'] = parseInt(currentSearchParamObject['rasterResolutionGEO'])
                    objectToReturn['outputSamplingGridType'] = 'lat/lon'
                    break;
                case 'rasterResolutionUTM':
                    // set raster resolution and output sampling grid type
                    objectToReturn['rasterResolutionUTM'] = parseInt(currentSearchParamObject['rasterResolutionUTM'])
                    objectToReturn['outputSamplingGridType'] = 'utm'
                    break;
                case 'showUTMAdvancedOptions':
                    if ((objectToReturn['rasterResolutionGEO'] === 'true') !== showUTMAdvancedOptions)
                    // set showUTMAdvancedOptions
                    handleShowUTMAdvancedOptions()
                    break;
                default:
                    // code block
            }
        })
        return objectToReturn
    }

    const [searchParams, setSearchParams] = useSearchParams();

    // set the default url state parameters
    useEffect(() => {
        const currentSearchParamObject = Object.fromEntries(searchParams.entries())
        const currentSearchParamObjectCleaned = {...generateProductParameters, ...cleanUpCurrentParametersObject(currentSearchParamObject)}
        dispatch(setGenerateProductParameters(currentSearchParamObjectCleaned))
        if (currentSearchParamObjectCleaned.outputSamplingGridType === 'utm' && currentSearchParamObject.showUTMAdvancedOptions) {
            dispatch(setShowUTMAdvancedOptions(true))
        }
    }, [])

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

    const setOutputSamplingGridType = (outputSamplingGridType: string, rasterResolution: number) => {
        let gridType = outputSamplingGridType
        let searchParamToRemove
        if (outputSamplingGridType === "lat/lon") {
            gridType = "rasterResolutionGEO"
            searchParamToRemove = "rasterResolutionUTM"
            if (showUTMAdvancedOptions) {
                handleShowUTMAdvancedOptions()
            }
        } else {
            gridType = "rasterResolutionUTM"
            searchParamToRemove = "rasterResolutionGEO"
        }
        addSearchParamToCurrentUrlState({[gridType]: rasterResolution}, searchParamToRemove)
        dispatch(setGenerateProductParameters({...generateProductParameters, outputSamplingGridType, [gridType]: rasterResolution}))
    }
    const setRasterResolutionUTM = (rasterResolutionUTM: number) => {
        addSearchParamToCurrentUrlState({"rasterResolutionUTM": rasterResolutionUTM}, "rasterResolutionGEO")
        dispatch(setGenerateProductParameters({...generateProductParameters, rasterResolutionUTM}))
    }
    const setRasterResolutionGEO = (rasterResolutionGEO: number) => {
        addSearchParamToCurrentUrlState({"rasterResolutionGEO": rasterResolutionGEO}, "rasterResolutionUTM")
        dispatch(setGenerateProductParameters({...generateProductParameters, rasterResolutionGEO}))
    }

    const setOutputGranuleExtentFlag = (value: string | number) => {
        addSearchParamToCurrentUrlState({"outputGranuleExtentFlag": value ? "1" : "0"})
        dispatch(setGenerateProductParameters({...generateProductParameters, outputGranuleExtentFlag: parseInt(value as string)}))
    }

    const handleShowUTMAdvancedOptions = () => {
        const newShowOptionsValue: boolean = !showUTMAdvancedOptions
        newShowOptionsValue ? addSearchParamToCurrentUrlState({"showUTMAdvancedOptions": newShowOptionsValue}) : addSearchParamToCurrentUrlState({"showUTMAdvancedOptions": newShowOptionsValue}, "showUTMAdvancedOptions")
        dispatch(setShowUTMAdvancedOptions(newShowOptionsValue))
    }

    const renderRasterResolutionOptions = (outputSamplingGridType: string) => {
        if (outputSamplingGridType === 'utm') {
            return (
                <Form.Select id='rasterResolutionUTMId' aria-label='rasterResolutionUTM' value={rasterResolutionUTM} onChange={event => setRasterResolutionUTM(parseInt(event.target.value))}>
                    {parameterOptionValues.rasterResolutionUTM.values.map((parameterValue, index) => <option value={parameterValue} key={`rasterResolutionUTM-key-${index}`}>{parameterValue}</option>)}
                </Form.Select>
            )
        } else if (outputSamplingGridType === 'lat/lon') {
            return (
                <Form.Select id='rasterResolutionGEOId' aria-label='rasterResolutionGEO' value={rasterResolutionGEO} onChange={event => setRasterResolutionGEO(parseInt(event.target.value))}>
                    {parameterOptionValues.rasterResolutionGEO.values.map((parameterValue, index) => <option value={parameterValue} key={`rasterResolutionGEO-key-${index}`}>{parameterValue}</option>)}
                </Form.Select>
            )
        }
    }

    const renderRasterResolutionUnits = (outputSamplingGridType: string) => {
        if (outputSamplingGridType === 'utm') {
            return (
               <p>meters</p>
            )
        } else if (outputSamplingGridType === 'lat/lon') {
            return (
                <p>arc-seconds</p>
            )
        }
    }

    const renderInfoIcon = (parameterId: string) => (
        <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip id="button-tooltip">
                {parameterHelp[parameterId]}
              </Tooltip>
            }
        >
            <InfoCircle />
        </OverlayTrigger>
    )

    const renderOutputSamplingGridTypeInputs = (outputSamplingGridType: string) => {
        const inputArray = parameterOptionValues.outputSamplingGridType.values.map((value, index) => {
            // TODO: Remove featureNotAvailable after ONLY RESOLUTION SELECTION period is over
            const featureNotAvailable = value === 'lat/lon'
            const resolutionToUse: number = value === 'utm' ? rasterResolutionUTM : rasterResolutionGEO
            return (
                <Form.Check 
                    checked={value === generateProductParameters.outputSamplingGridType}
                    // TODO: Remove disabled after ONLY RESOLUTION SELECTION period is over
                    disabled={featureNotAvailable}
                    inline 
                    label={String(value).toUpperCase()} 
                    name="outputSamplingGridTypeGroup" 
                    type={'radio'} 
                    id={`outputSamplingGridTypeGroup-radio-${index}`} 
                    onChange={() => setOutputSamplingGridType(value as string, resolutionToUse)}
                    key={`outputSamplingGridTypeGroup-radio-key-${index}`}
                />
            )}
        )
        inputArray.push(
            (
                <Form.Check 
                    type="switch"
                    inline
                    id="outputGranuleExtentFlag-switch"
                    checked={showUTMAdvancedOptions}
                    onChange={() => handleShowUTMAdvancedOptions()}
                    label={'advanced options'} 
                    style={{marginTop: '10px'}}
                    // TODO: Switch back to other disabled after ONLY RESOLUTION SELECTION period is over
                    // disabled={!(outputSamplingGridType === 'utm')}
                    disabled={true}
                    key={`outputGranuleExtentFlag-switch-key`}
                />
            )
        )
        return inputArray
    }

  return (
    <div style={{backgroundColor: '#2C415C', marginTop: '10px'}} className='g-0 shadow' id='parameter-options'>
        <Row style={{marginRight: '0px', marginLeft: '0px',}}>
            <h5 className={`${colorModeClass}-sidebar-section-title`} style={{paddingTop: '10px', paddingBottom: '10px'}}>Parameter Options</h5>
        </Row>
        <div style={{padding: '0px 20px 15px 20px'}}>
            <Row className='normal-row'>
                <Col md={{ span: 5, offset: 0 }}>
                    <h6>Output Granule Extent</h6>
                </Col>  
                <Col md={{ span: 1, offset: 0 }}>
                        {renderInfoIcon('outputGranuleExtentFlag')}
                    </Col>
                <Col md={{ span: 5, offset: 1 }}>
                    {parameterOptionValues.outputGranuleExtentFlag.values.map((value, index) => {
                        // TODO: Remove featureNotAvailable after ONLY RESOLUTION SELECTION period is over
                        const featureNotAvailable = Boolean(value)
                        return (
                            <Form.Check 
                                checked={value === generateProductParameters.outputGranuleExtentFlag}
                                inline 
                                // TODO: Remove disabled after ONLY RESOLUTION SELECTION period is over
                                disabled={featureNotAvailable}
                                label={value ? '256 x 128 km' : '128 x 128 km'} 
                                name="outputGranuleExtentFlagTypeGroup" 
                                type={'radio'} 
                                id={`outputGranuleExtentFlagTypeGroup-radio-${index}`} 
                                onChange={() => setOutputGranuleExtentFlag(value)}
                                key={`outputGranuleExtentFlagTypeGroup-radio-key-${index}`}
                            />
                        )
                    })}
                </Col>
            </Row>
            <Row className='normal-row'>
                <Col md={{ span: 5, offset: 0 }}>
                    <h6>Output Sampling Grid Type</h6>
                </Col>  
                <Col md={{ span: 1, offset: 0 }}>
                        {renderInfoIcon('outputSamplingGridType')}
                    </Col>
                <Col md={{ span: 5, offset: 1 }}>
                    {renderOutputSamplingGridTypeInputs(outputSamplingGridType)}
                </Col>
            </Row>
            <Row className='normal-row'>
                <Col md={{ span: 5, offset: 0 }}>
                    <h6>Raster Resolution</h6>
                </Col>  
                <Col md={{ span: 1, offset: 0 }}>
                        {renderInfoIcon('rasterResolution')}
                    </Col>
                <Col md={{ span: 3, offset: 1 }} >
                    {renderRasterResolutionOptions(outputSamplingGridType)}
                </Col>
                <Col md={{ span: 2, offset: 0 }} style={{paddingLeft: '0px'}}>{renderRasterResolutionUnits(outputSamplingGridType)}</Col>
            </Row>
            <Row>
                <Col>
                    <Alert key='alert-features-not-available' variant='info'>
                        Some options including Output Granule Extent's <b>256 x 128 km</b> option and Output Sampling Grid Type's <b>LAT/LON</b> and <b>advanced options</b> are <b>not available</b> at this time.
                    </Alert>
                </Col>
            </Row>
        </div>
    </div>      
  );
}

export default ProductCustomization;