import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import Form from 'react-bootstrap/Form';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { parameterHelp, parameterOptionValues } from '../../constants/rasterParameterConstants'
import { InfoCircle } from 'react-bootstrap-icons';
import { setGenerateProductParameters, setShowUTMAdvancedOptions } from "./actions/productSlice";
import { useLocation, useSearchParams } from 'react-router-dom';
import { GenerateProductParameters, newUrlParamsObject } from '../../types/constantTypes';

const ProductCustomization = () => {
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const generateProductParameters = useAppSelector((state) => state.product.generateProductParameters)
    const showUTMAdvancedOptions = useAppSelector((state) => state.product.showUTMAdvancedOptions)
    
    const dispatch = useAppDispatch()
    const { search } = useLocation();

    const {outputSamplingGridType, rasterResolutionUTM, rasterResolutionGEO} = generateProductParameters

    const cleanUpCurrentParametersObject = (currentSearchParamObject: any): GenerateProductParameters => {
        const objectToReturn = {...currentSearchParamObject}
        Object.entries(currentSearchParamObject).forEach(paramEntry => {
            switch(paramEntry[0]) {
                case 'outputGranuleExtentFlag':
                    // set outputGranuleExtentFlag
                    console.log(parseInt(currentSearchParamObject['outputGranuleExtentFlag']))
                    objectToReturn['outputGranuleExtentFlag'] = parseInt(currentSearchParamObject['outputGranuleExtentFlag'])
                    break;
                case 'rasterResolutionGEO':
                    // set raster resolution and output sampling grid type
                    objectToReturn['rasterResolutionGEO'] = parseInt(currentSearchParamObject['rasterResolutionGEO'])
                    objectToReturn['outputSamplingGridType'] = 'lat/lon'
                    // objectToReturn['rasterResolutionGEO'] = parseInt(currentSearchParamObject['rasterResolutionGEO'])
                    break;
                case 'rasterResolutionUTM':
                    // set raster resolution and output sampling grid type
                    objectToReturn['rasterResolutionUTM'] = parseInt(currentSearchParamObject['rasterResolutionUTM'])
                    objectToReturn['outputSamplingGridType'] = 'utm'
                    // objectToReturn['rasterResolutionGEO'] = parseInt(currentSearchParamObject['rasterResolutionGEO'])
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

    // set the default url state parameters
    useEffect(() => {
        // check if anything specified in url, if not load defaults
        // set redux state variables to parameters
        // const newParamsObject: newUrlParamsObject = {}
        // if (!search.includes('outputGranuleExtentFlag')) {
        //     console.log('outputGranuleExtentFlag')
        //     newParamsObject['outputGranuleExtentFlag'] = parameterOptionValues.outputGranuleExtentFlag.default
        // }
        // if (!(search.includes('rasterResolutionUTM') || search.includes('rasterResolutionGEO'))) {
        //     if (search.includes('rasterResolutionGEO')) {
        //         newParamsObject['rasterResolutionGEO'] = parameterOptionValues.rasterResolutionGEO.default
        //     } else {
        //         newParamsObject['rasterResolutionUTM'] = parameterOptionValues.rasterResolutionUTM.default
        //     }
        // }
        // if (!search.includes('showUTMAdvancedOptions')) {
        //     newParamsObject['showUTMAdvancedOptions'] = false
        // }
        // addSearchParamToCurrentUrlState(newParamsObject)
        // console.log('generateProductParameters', generateProductParameters)
        // console.log('newParamsObject', newParamsObject)
        // console.log('currentSearchParamObject', Object.fromEntries(searchParams.entries()))
        // go through object of search params and if it is different then default parameters update it
        // Object.entries(Object.fromEntries(searchParams.entries())).forEach(paramEntry => {
        //     let key = paramEntry[0]
        //     let value = paramEntry[1]
        //     if (key === )
        // })
        const currentSearchParamObject = Object.fromEntries(searchParams.entries())
        const currentSearchParamObjectCleaned = cleanUpCurrentParametersObject(currentSearchParamObject)
        const parametersFromUrl = {...generateProductParameters, ...currentSearchParamObjectCleaned}
        console.log(parametersFromUrl)
        dispatch(setGenerateProductParameters(parametersFromUrl))
    }, [])

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
        dispatch(setGenerateProductParameters({...generateProductParameters, outputSamplingGridType, [gridType] :rasterResolution}))
    }
    const setRasterResolutionUTM = (rasterResolutionUTM: number) => {
        addSearchParamToCurrentUrlState({"rasterResolutionUTM": rasterResolutionUTM}, "rasterResolutionGEO")
        dispatch(setGenerateProductParameters({...generateProductParameters, rasterResolutionUTM}))
    }
    const setRasterResolutionGEO = (rasterResolutionGEO: number) => {
        addSearchParamToCurrentUrlState({"rasterResolutionGEO": rasterResolutionGEO}, "rasterResolutionUTM")
        dispatch(setGenerateProductParameters({...generateProductParameters, rasterResolutionGEO}))
    }

    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const handleShowAdvancedOptions = (bool: boolean) => {
        addSearchParamToCurrentUrlState({"outputGranuleExtentFlag": bool ? "0" : "1"})
        setShowAdvancedOptions(!showAdvancedOptions)
    }

    const handleShowUTMAdvancedOptions = () => {
        const newShowOptionsValue: boolean = !showUTMAdvancedOptions
        addSearchParamToCurrentUrlState({"showUTMAdvancedOptions": newShowOptionsValue} )
        dispatch(setShowUTMAdvancedOptions(newShowOptionsValue))
    }

    const renderRasterResolutionOptions = (outputSamplingGridType: string) => {
        if (outputSamplingGridType === 'utm') {
            return (
                <Form.Select id='rasterResolutionUTMId' aria-label='rasterResolutionUTM' defaultValue={parameterOptionValues.rasterResolutionUTM.default} value={rasterResolutionUTM} onChange={event => setRasterResolutionUTM(parseInt(event.target.value))}>
                    {parameterOptionValues.rasterResolutionUTM.values.map(parameterValue => <option value={parameterValue}>{parameterValue}</option>)}
                </Form.Select>
            )
        } else if (outputSamplingGridType === 'lat/lon') {
            return (
                <Form.Select id='rasterResolutionGEOId' aria-label='rasterResolutionGEO' defaultValue={parameterOptionValues.rasterResolutionGEO.default} value={rasterResolutionGEO} onChange={event => setRasterResolutionGEO(parseInt(event.target.value))}>
                    {parameterOptionValues.rasterResolutionGEO.values.map(parameterValue => <option value={parameterValue}>{parameterValue}</option>)}
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
            // const resolutionToUse: number = value === 'utm' ? parseInt(parameterOptionValues.rasterResolutionUTM.default as string) : parseInt(parameterOptionValues.rasterResolutionGEO.default as string)
            const resolutionToUse: number = value === 'utm' ? rasterResolutionUTM : rasterResolutionGEO
            return (
                <Form.Check 
                    defaultChecked={value === parameterOptionValues.outputSamplingGridType.default} 
                    inline 
                    label={String(value).toUpperCase()} 
                    name="outputSamplingGridTypeGroup" 
                    type={'radio'} 
                    id={`outputSamplingGridTypeGroup-radio-${index}`} 
                    onChange={() => setOutputSamplingGridType(value as string, resolutionToUse)}
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
                    disabled={!(outputSamplingGridType === 'utm')}
                />
            )
        )
        return inputArray
    }

  return (
    <div style={{backgroundColor: '#2C415C', marginTop: '10px'}} className='g-0 shadow'>
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
                        return (
                            <Form.Check 
                                defaultChecked={value === parameterOptionValues.outputGranuleExtentFlag.default} 
                                inline 
                                label={value ? '256 x 128 km' : '128 x 128 km'} 
                                name="outputGranuleExtentFlagTypeGroup" 
                                type={'radio'} 
                                id={`outputGranuleExtentFlagTypeGroup-radio-${index}`} 
                                onChange={() => handleShowAdvancedOptions(showAdvancedOptions)}
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
        </div>
    </div>      
  );
}

export default ProductCustomization;