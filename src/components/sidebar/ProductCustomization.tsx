import { useState, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks'
import Form from 'react-bootstrap/Form';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { parameterHelp, parameterOptionValues } from '../../constants/rasterParameterConstants'
import { InfoCircle } from 'react-bootstrap-icons';
import { GridTypes } from '../../types/constantTypes';

const ProductCustomization = () => {
    const showGenerateProductsModal = useAppSelector((state) => state.modal.showGenerateProductModal)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)

    const [outputGranuleExtentFlag, setOutputGranuleExtentFlag] = useState(parameterOptionValues.outputGranuleExtentFlag.default as number);
    const [outputSamplingGridType, setOutputSamplingGridType] = useState(parameterOptionValues.outputSamplingGridType.default as string);
    const [rasterResolutionUTM, setRasterResolutionUTM] = useState(parameterOptionValues.rasterResolutionUTM.default as number)
    const [rasterResolutionGEO, setRasterResolutionGEO] = useState(parameterOptionValues.rasterResolutionGEO.default as number)
    const [utmZoneAdjust, setUTMZoneAdjust] = useState(parameterOptionValues.utmZoneAdjust.default as string);
    const [mgrsBandAdjust, setMGRSBandAdjust] = useState(parameterOptionValues.mgrsBandAdjust.default as string);

    useEffect(() => {}, [showGenerateProductsModal, outputSamplingGridType])

    const renderRasterResolutionOptions = (outputSamplingGridType: string) => {
        if (outputSamplingGridType === 'utm') {
            return (
                <Form.Select id='rasterResolutionUTMId' aria-label='rasterResolutionUTM' defaultValue={parameterOptionValues.rasterResolutionUTM.default} value={rasterResolutionUTM} onChange={event => setRasterResolutionUTM(parseInt(event.target.value))}>
                    {parameterOptionValues.rasterResolutionUTM.values.map(parameterValue => <option value={parameterValue}>{parameterValue}</option>)}
                </Form.Select>
            )
        } else if (outputSamplingGridType === 'geo') {
            return (
                <Form.Select id='rasterResolutionGEOId' aria-label='rasterResolutionGEO' defaultValue={parameterOptionValues.rasterResolutionGEO.default} value={rasterResolutionGEO} onChange={event => setRasterResolutionGEO(parseInt(event.target.value))}>
                    {parameterOptionValues.rasterResolutionGEO.values.map(parameterValue => <option value={parameterValue}>{parameterValue}</option>)}
                </Form.Select>
            )
        }
    }

    const renderinfoIcon = (parameterId: string) => (
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

    const getRelevantRasterResolution = (resolution: GridTypes) => {
        if (resolution === 'utm') {
            return rasterResolutionUTM
        } else {
            return rasterResolutionGEO
        }
    }

    const bandAdjustOptions = (
        <>
            <Row className='normal-row'>
                <Col md={{ span: 4, offset: 1 }}>
                    <h5>UTM Zone Adjust</h5>
                </Col>
                <Col md={{ span: 1, offset: 0 }}>
                    {renderinfoIcon('utmZoneAdjust')}
                </Col>
                <Col md={{ span: 4, offset: 1 }}>
                    {parameterOptionValues.utmZoneAdjust.values.map((value, index) => 
                        <Form.Check
                            defaultChecked={value === parameterOptionValues.utmZoneAdjust.default}
                            inline
                            label={value}
                            name="utmZoneAdjustGroup"
                            type={'radio'}
                            id={`utmZoneAdjustGroup-${'radio'}-${index}`}
                            onChange={() => setUTMZoneAdjust(value as string)} 
                        />
                    )}
                </Col>
            </Row>
            <Row className='normal-row'>
                <Col md={{ span: 4, offset: 1 }}>
                    <h5>MGRS Band Adjust</h5>
                </Col>
                <Col md={{ span: 1, offset: 0 }}>
                    {renderinfoIcon('mgrsBandAdjust')}
                </Col>
                <Col md={{ span: 4, offset: 1 }}>
                    {parameterOptionValues.mgrsBandAdjust.values.map((value, index) => 
                        <Form.Check
                            defaultChecked={value === parameterOptionValues.mgrsBandAdjust.default}
                            inline
                            label={value}
                            name="mgrsBandAdjustGroup"
                            type={'radio'}
                            id={`mgrsBandAdjustGroup-${'radio'}-${index}`}
                            onChange={() => setMGRSBandAdjust(value as string)} 
                        />
                    )}
                </Col>
            </Row>
        </>
    )

  return (
    <div style={{backgroundColor: '#2C415C', marginTop: '10px'}} className='g-0 shadow'>
        <Row style={{marginRight: '0px', marginLeft: '0px',}}>
            <h4 className={`${colorModeClass}-sidebar-section-title`} style={{paddingTop: '10px', paddingBottom: '10px'}}>Parameter Options</h4>
        </Row>
        <div style={{padding: '0px 20px 15px 20px'}}>
            <Row className='normal-row'>
                <Col md={{ span: 4, offset: 1 }}>
                    <h5>Output Granule Extent Flag</h5>
                </Col>  
                <Col md={{ span: 1, offset: 0 }}>
                        {renderinfoIcon('outputGranuleExtentFlag')}
                    </Col>
                <Col md={{ span: 4, offset: 1 }}>
                    <Form.Check 
                        type="switch"
                        id="outputGranuleExtentFlag-switch"
                        onChange={() => setOutputGranuleExtentFlag(outputGranuleExtentFlag ? 0 : 1)}
                    />
                </Col>
            </Row>
            <Row className='normal-row'>
                <Col md={{ span: 4, offset: 1 }}>
                    <h5>Output Sampling Grid Type</h5>
                </Col>  
                <Col md={{ span: 1, offset: 0 }}>
                        {renderinfoIcon('outputSamplingGridType')}
                    </Col>
                <Col md={{ span: 4, offset: 1 }}>
                    {parameterOptionValues.outputSamplingGridType.values.map((value, index) => 
                        <Form.Check 
                            defaultChecked={value === parameterOptionValues.outputSamplingGridType.default} 
                            inline 
                            label={String(value).toUpperCase()} 
                            name="outputSamplingGridTypeGroup" 
                            type={'radio'} 
                            id={`outputSamplingGridTypeGroup-radio-${index}`} 
                            onChange={() => setOutputSamplingGridType(value as string)}
                            />)}
                </Col>
            </Row>
            <Row className='normal-row'>
                <Col md={{ span: 4, offset: 1 }}>
                    <h5>Raster Resolution</h5>
                </Col>  
                <Col md={{ span: 1, offset: 0 }}>
                        {renderinfoIcon('rasterResolution')}
                    </Col>
                <Col md={{ span: 4, offset: 1 }}>
                    {renderRasterResolutionOptions(outputSamplingGridType)}
                </Col>
            </Row>
            {outputSamplingGridType === 'geo' ? null : bandAdjustOptions}
        </div>
    </div>      
  );
}

export default ProductCustomization;