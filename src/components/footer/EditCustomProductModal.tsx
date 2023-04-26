import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowEditProductModalFalse, editProduct } from './customProductModalSlice'
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import { parameterOptionValues } from '../../constants/rasterParameterConstants'
import { allProductParameters } from '../../types/constantTypes';
import { v4 as uuidv4 } from 'uuid';
import { EditProductModalProps } from '../../types/modalTypes';

const EditProductModal = (props: EditProductModalProps) => {
    const showEditProductModal = useAppSelector((state) => state.customProductModal.showEditProductModal)
    const { productsBeingEdited } = props
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

    // const [validated, setValidated] = useState(false);
    // const [inputsNotValid, setInputsNotValid] = useState([] as string[])

    // const requiredFields = ['name', 'cycle', 'pass', 'scene']

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

    useEffect(() => {}, [showEditProductModal, outputSamplingGridType])

    // const isValidInput = (inputParameter: string): boolean => {
    //     return inputParameter !== null && inputParameter !== ''
    // }

    // const checkValidInputs = (inputParameters: string[]) => {
    //     const notValidInputs: string[] = []
    //     const isValid: boolean = inputParameters.map(param => {
    //         const validity = isValidInput(param)
    //         if (!validity) notValidInputs.push(Object.keys(param)[0])
    //         return isValidInput(param)
    //     }).every(value => value)
    //     setInputsNotValid(notValidInputs)
    //     return isValid
    // }

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
        const parameters: allProductParameters = {
            productId: uuidv4(),
            name,
            cycle,
            pass,
            scene,
            outputGranuleExtentFlag,
            outputSamplingGridType,
            rasterResolution: rasterResolutionToSet,
            utmZoneAdjust,
            mgrsBandAdjust
        }

        // if (checkValidInputs([name, cycle, pass, scene])) {
            // setValidated(true)
            dispatch(editProduct(parameters))
            dispatch(setShowEditProductModalFalse())

            // set parameters back to default
            setInitialStates()
        // } else {
        //     console.log('not valid')
        // }
    }

  return (
    <Modal show={showEditProductModal} onHide={() => dispatch(setShowEditProductModalFalse())}>
    <Modal.Header className="modal-style" closeButton>
        <Modal.Title>Edit Product</Modal.Title>
    </Modal.Header>

    <Modal.Body className="modal-style">
        <Row>
            <Col>
                <Form.Label>Name</Form.Label>
            </Col>  
            <Col>
                <Form.Control required id="add-product-name" placeholder="custom_product_name" onChange={event => setName(event.target.value)}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <h5>Parameter IDs</h5>
            </Col>  
            <Col>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Cycle</Form.Label>
            </Col>  
            <Col>
                <Form.Control required id="add-product-cycle" placeholder="cycle_id" onChange={event => setCycle(event.target.value)}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Pass</Form.Label>
            </Col>  
            <Col>
                <Form.Control required id="add-product-pass" placeholder="pass_id" onChange={event => setPass(event.target.value)}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Scene</Form.Label>
            </Col>  
            <Col>
                <Form.Control required id="add-product-scene" placeholder="scene_id" onChange={event => setScene(event.target.value)}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <h5>Variables</h5>
            </Col>  
            <Col>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Output Granule Extent Flag</Form.Label>
            </Col>  
            <Col>
                <Form.Check 
                    type="switch"
                    id="outputGranuleExtentFlag-switch"
                    onChange={() => setOutputGranuleExtentFlag(outputGranuleExtentFlag ? 0 : 1)}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Output Sampling Grid Type</Form.Label>
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
        <Row>
            <Col>
                <Form.Label>Raster Resolution</Form.Label>
            </Col>  
            <Col>
                {renderRasterResolutionOptions(outputSamplingGridType)}
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>UTM Zone Adjust</Form.Label>
            </Col>
            <Col>
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
        <Row>
            <Col>
                <Form.Label>MGRS Band Adjust</Form.Label>
            </Col>
            <Col>
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
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setShowEditProductModalFalse())}>Close</Button>
        <Button variant="primary" type="submit" onClick={() => handleSave()}>Save</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default EditProductModal;