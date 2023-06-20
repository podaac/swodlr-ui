import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import Form from 'react-bootstrap/Form';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { parameterHelp, parameterOptionValues } from '../../constants/rasterParameterConstants'
import { InfoCircle } from 'react-bootstrap-icons';
import { setGenerateProductParameters, setShowUTMAdvancedOptions } from "./actions/productSlice";

const ProductCustomization = () => {
    const showGenerateProductsModal = useAppSelector((state) => state.modal.showGenerateProductModal)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const generateProductParameters = useAppSelector((state) => state.product.generateProductParameters)
    const showUTMAdvancedOptions = useAppSelector((state) => state.product.showUTMAdvancedOptions)
    const dispatch = useAppDispatch()

    const {outputGranuleExtentFlag, outputSamplingGridType, rasterResolution} = generateProductParameters

    const setOutputGranuleExtentFlag = (outputGranuleExtentFlag: number) => dispatch(setGenerateProductParameters({...generateProductParameters, outputGranuleExtentFlag}))
    const setOutputSamplingGridType = (outputSamplingGridType: string) => dispatch(setGenerateProductParameters({...generateProductParameters, outputSamplingGridType}))
    const setRasterResolutionUTM = (rasterResolutionUTM: number) => dispatch(setGenerateProductParameters({...generateProductParameters, rasterResolution: rasterResolutionUTM}))
    const setRasterResolutionGEO = (rasterResolutionGEO: number) => dispatch(setGenerateProductParameters({...generateProductParameters, rasterResolution: rasterResolutionGEO}))

    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

    useEffect(() => {}, [showGenerateProductsModal, outputSamplingGridType])

    const renderRasterResolutionOptions = (outputSamplingGridType: string) => {
        if (outputSamplingGridType === 'utm') {
            return (
                <Form.Select id='rasterResolutionUTMId' aria-label='rasterResolutionUTM' defaultValue={parameterOptionValues.rasterResolutionUTM.default} value={rasterResolution} onChange={event => setRasterResolutionUTM(parseInt(event.target.value))}>
                    {parameterOptionValues.rasterResolutionUTM.values.map(parameterValue => <option value={parameterValue}>{parameterValue}</option>)}
                </Form.Select>
            )
        } else if (outputSamplingGridType === 'lat/long') {
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
        } else if (outputSamplingGridType === 'lat/long') {
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
        const inputArray = parameterOptionValues.outputSamplingGridType.values.map((value, index) => 
            <Form.Check 
                defaultChecked={value === parameterOptionValues.outputSamplingGridType.default} 
                inline 
                label={String(value)} 
                name="outputSamplingGridTypeGroup" 
                type={'radio'} 
                id={`outputSamplingGridTypeGroup-radio-${index}`} 
                onChange={() => setOutputSamplingGridType(value as string)}
            />
        )
        if (outputSamplingGridType === 'utm') {
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
                    />
                )
            )
        }
        return inputArray
    }

  return (
    <div style={{backgroundColor: '#2C415C', marginTop: '10px'}} className='g-0 shadow'>
        <Row style={{marginRight: '0px', marginLeft: '0px',}}>
            <h4 className={`${colorModeClass}-sidebar-section-title`} style={{paddingTop: '10px', paddingBottom: '10px'}}>Parameter Options</h4>
        </Row>
        <div style={{padding: '0px 20px 15px 20px'}}>
            <Row className='normal-row'>
                <Col md={{ span: 5, offset: 0 }}>
                    <h5>Output Granule Extent</h5>
                </Col>  
                <Col md={{ span: 1, offset: 0 }}>
                        {renderInfoIcon('outputGranuleExtentFlag')}
                    </Col>
                <Col md={{ span: 5, offset: 1 }}>
                    {/* <Form.Check 
                        type="switch"
                        id="outputGranuleExtentFlag-switch"
                        checked={!!outputGranuleExtentFlag}
                        onChange={() => setOutputGranuleExtentFlag(outputGranuleExtentFlag ? 0 : 1)}
                    /> */}
                    {parameterOptionValues.outputGranuleExtentFlag.values.map((value, index) => {

                        return (
                            <Form.Check 
                                defaultChecked={value === parameterOptionValues.outputGranuleExtentFlag.default} 
                                inline 
                                label={value ? 'rectangle' : 'square'} 
                                name="outputGranuleExtentFlagTypeGroup" 
                                type={'radio'} 
                                id={`outputGranuleExtentFlagTypeGroup-radio-${index}`} 
                                onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
                            />
                        )
                    })}
                </Col>
            </Row>
            <Row className='normal-row'>
                <Col md={{ span: 5, offset: 0 }}>
                    <h5>Output Sampling Grid Type</h5>
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
                    <h5>Raster Resolution</h5>
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