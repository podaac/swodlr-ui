import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowGenerateProductModalFalse } from './actions/modalSlice'
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import { parameterOptionValues } from '../../constants/rasterParameterConstants'
import { allProductParameters } from '../../types/constantTypes';
import sampleAvailableGranules from '../../constants/sampleAvailableGranules.json'
import { LatLngExpression } from 'leaflet';
import { addProduct } from './actions/productSlice';

const GenerateProducts = () => {
    const showGenerateProductsModal = useAppSelector((state) => state.modal.showGenerateProductModal)
    const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
    const dispatch = useAppDispatch()

    const [name, setName] = useState('');
    const [cycle, setCycle] = useState('');
    const [pass, setPass] = useState('');
    const [scene, setScene] = useState('');
    const [outputGranuleExtentFlag, setOutputGranuleExtentFlag] = useState(parameterOptionValues.outputGranuleExtentFlag.default as number);
    const [outputSamplingGridType, setOutputSamplingGridType] = useState(parameterOptionValues.outputSamplingGridType.default as string);
    const [rasterResolutionUTM, setRasterResolutionUTM] = useState(parameterOptionValues.rasterResolutionUTM.default as number)
    const [rasterResolutionGEO, setRasterResolutionGEO] = useState(parameterOptionValues.rasterResolutionGEO.default as number)
    const [utmZoneAdjust, setUTMZoneAdjust] = useState(parameterOptionValues.utmZoneAdjust.default as string);
    const [mgrsBandAdjust, setMGRSBandAdjust] = useState(parameterOptionValues.mgrsBandAdjust.default as string);

    const setInitialStates = () => {
        setName('')
        setCycle('')
        setPass('')
        setScene('')
        setOutputGranuleExtentFlag(parameterOptionValues.outputGranuleExtentFlag.default as number)
        setOutputSamplingGridType(parameterOptionValues.outputSamplingGridType.default as string)
        setRasterResolutionUTM(parameterOptionValues.rasterResolutionUTM.default as number)
        setRasterResolutionGEO(parameterOptionValues.rasterResolutionGEO.default as number)
        setUTMZoneAdjust(parameterOptionValues.utmZoneAdjust.default as string)
        setMGRSBandAdjust(parameterOptionValues.mgrsBandAdjust.default as string)
    }

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

    const handleSave = () => {
        const rasterResolutionToSet = outputSamplingGridType === 'utm' ? rasterResolutionUTM : rasterResolutionGEO;
        // check if granule exists with that scene, cycle, and pass
        const granuleFoundResult = sampleAvailableGranules.find(granuleObject => granuleObject.cycle === cycle && granuleObject.pass === pass && granuleObject.scene === scene)
        if (granuleFoundResult) {
            // NOTE: this is using sample json array but will be hooked up to the get granule API result later
            // get the granuleId from it and pass it to the parameters
            const parameters: allProductParameters = {
                granuleId: granuleFoundResult.granuleId,
                name,
                cycle,
                pass,
                scene,
                outputGranuleExtentFlag,
                outputSamplingGridType,
                rasterResolution: rasterResolutionToSet,
                utmZoneAdjust,
                mgrsBandAdjust,
                footprint: granuleFoundResult.footprint as LatLngExpression[]
            }
            dispatch(addProduct([parameters]))
            dispatch(setShowGenerateProductModalFalse())
            setInitialStates()
        } else {
            console.log('NO MATCHING GRANULES FOUND') 
        }
    }

    const utmOptions = (
        <>
            <Row className='normal-row'>
                <Col>
                    <h5>UTM Zone Adjust</h5>
                </Col>
                <Col>
                    {parameterOptionValues.utmZoneAdjust.values.map((value, index) => <Form.Check
                        defaultChecked={value === parameterOptionValues.utmZoneAdjust.default}
                        inline
                        label={value}
                        name="utmZoneAdjustGroup"
                        type={'radio'}
                        id={`utmZoneAdjustGroup-${'radio'}-${index}`}
                        onChange={() => setUTMZoneAdjust(value as string)} />
                    )}
                </Col>
            </Row>
            <Row className='normal-row'>
                <Col>
                    <h5>MGRS Band Adjust</h5>
                </Col>
                <Col>
                    {parameterOptionValues.mgrsBandAdjust.values.map((value, index) => <Form.Check
                        defaultChecked={value === parameterOptionValues.mgrsBandAdjust.default}
                        inline
                        label={value}
                        name="mgrsBandAdjustGroup"
                        type={'radio'}
                        id={`mgrsBandAdjustGroup-${'radio'}-${index}`}
                        onChange={() => setMGRSBandAdjust(value as string)} />
                    )}
                </Col>
            </Row>
        </>
    )

  return (
    <>
        <Row>
            <h3>Parameter Options</h3>
        </Row>
        <Row className='normal-row'>
            <Col>
                <h5>Output Granule Extent Flag</h5>
            </Col>  
            <Col>
                <Form.Check 
                    type="switch"
                    id="outputGranuleExtentFlag-switch"
                    onChange={() => setOutputGranuleExtentFlag(outputGranuleExtentFlag ? 0 : 1)}
                />
            </Col>
        </Row>
        <Row className='normal-row'>
            <Col>
                <h5>Output Sampling Grid Type</h5>
            </Col>  
            <Col>
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
            <Col>
                <h5>Raster Resolution</h5>
            </Col>  
            <Col>
                {renderRasterResolutionOptions(outputSamplingGridType)}
            </Col>
        </Row>
        {outputSamplingGridType === 'geo' ? null : utmOptions}
        <Row className='normal-row' style={{paddingTop: '30px'}}>
            <Col>
                <Button disabled={selectedGranules.length === 0} variant="success" onClick={() => console.log('generating products', selectedGranules)}>
                    Generate Selected Products
                </Button>
            </Col>
        </Row>
    </>       
  );
}

export default GenerateProducts;