import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import Form from 'react-bootstrap/Form';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { parameterHelp, parameterOptionValues } from '../../constants/rasterParameterConstants'
import { InfoCircle } from 'react-bootstrap-icons';
import { setGenerateProductParameters, setShowUTMAdvancedOptions } from "./actions/productSlice";
import { useSearchParams, Link } from 'react-router-dom';

const ProductCustomization = () => {
    const showGenerateProductsModal = useAppSelector((state) => state.modal.showGenerateProductModal)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const generateProductParameters = useAppSelector((state) => state.product.generateProductParameters)
    const showUTMAdvancedOptions = useAppSelector((state) => state.product.showUTMAdvancedOptions)
    const dispatch = useAppDispatch()

    const {outputSamplingGridType, rasterResolution} = generateProductParameters

    const setOutputSamplingGridType = (outputSamplingGridType: string, rasterResolution: number) => {
        let gridType = outputSamplingGridType
        if (outputSamplingGridType === "lat/lon") {
            gridType = "rasterResolutionGEO"
            if (showUTMAdvancedOptions) {
                dispatch(setShowUTMAdvancedOptions(false))
            }
        } else {
            gridType = "rasterResolutionUTM"
        }
        setSearchParams({ [gridType]: rasterResolution.toString() })
        dispatch(setGenerateProductParameters({...generateProductParameters, outputSamplingGridType, rasterResolution}))
    }
    const setRasterResolutionUTM = (rasterResolutionUTM: number) => {
        setSearchParams({"rasterResolutionUTM": rasterResolutionUTM.toString()})
        dispatch(setGenerateProductParameters({...generateProductParameters, rasterResolution: rasterResolutionUTM}))
    }
    const setRasterResolutionGEO = (rasterResolutionGEO: number) => {
        setSearchParams({"rasterResolutionGEO": rasterResolutionGEO.toString()})
        dispatch(setGenerateProductParameters({...generateProductParameters, rasterResolution: rasterResolutionGEO}))
    }

    const [searchParams, setSearchParams] = useSearchParams();

      // Get a specific query parameter
//   const myParam = searchParams.get('myParam');

    // Set a query parameter
    // setSearchParams({ myParam: 'myValue' });

    // Remove a query parameter
    // setSearchParams((params) => {
    //     params.delete('myParam');
    //     return params;
    // });

    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const handleShowAdvancedOptions = (bool: boolean) => {
        setSearchParams({"outputGranuleExtentFlag": bool ? "0" : "1"})
        setShowAdvancedOptions(!showAdvancedOptions)
    }

    const setDefaultUrlParameters = (existingParameterNames: string[]) => {
        const defaultParameterOptionValuesArray = Object.entries(parameterOptionValues).map(parameterEntry => [parameterEntry[0], parameterEntry[1]["default"].toString()])
            .filter(element => {
                const key = element[0]
                let returnElement = true
                if (existingParameterNames.includes(key)) {
                    returnElement = false
                } else if (!showUTMAdvancedOptions && (key === "utmZoneAdjust" || key === "mgrsBandAdjust")) {
                    returnElement = false
                } else if (key === "rasterResolutionGEO" && outputSamplingGridType === "utm") {
                    returnElement = false
                } else if (key === "rasterResolutionUTM" && outputSamplingGridType === "lat/lon") {
                    returnElement = false
                } else if (key === "outputSamplingGridType") {
                    returnElement = false
                }
                return returnElement
            })
        console.log(defaultParameterOptionValuesArray)
        setSearchParams(Object.fromEntries(defaultParameterOptionValuesArray));
    }

    // set the default url state parameters
    useEffect(() => {
        // check if anything specified in url, if not load defaults
        const existingParameterNames = Object.keys(parameterOptionValues).filter(key => searchParams.get(key))
        console.log(existingParameterNames)
        console.log(searchParams.get("outputGranuleExtentFlag"))
        setDefaultUrlParameters(existingParameterNames)
    }, [])

    const renderRasterResolutionOptions = (outputSamplingGridType: string) => {
        if (outputSamplingGridType === 'utm') {
            return (
                <Form.Select id='rasterResolutionUTMId' aria-label='rasterResolutionUTM' defaultValue={parameterOptionValues.rasterResolutionUTM.default} value={rasterResolution} onChange={event => setRasterResolutionUTM(parseInt(event.target.value))}>
                    {parameterOptionValues.rasterResolutionUTM.values.map(parameterValue => <option value={parameterValue}>{parameterValue}</option>)}
                </Form.Select>
            )
        } else if (outputSamplingGridType === 'lat/lon') {
            return (
                <Form.Select id='rasterResolutionGEOId' aria-label='rasterResolutionGEO' defaultValue={parameterOptionValues.rasterResolutionGEO.default} value={rasterResolution} onChange={event => setRasterResolutionGEO(parseInt(event.target.value))}>
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
            const resolutionToUse: number = value === 'utm' ? parseInt(parameterOptionValues.rasterResolutionUTM.default as string) : parseInt(parameterOptionValues.rasterResolutionGEO.default as string)
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
                    onChange={() => dispatch(setShowUTMAdvancedOptions(!showUTMAdvancedOptions))}
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