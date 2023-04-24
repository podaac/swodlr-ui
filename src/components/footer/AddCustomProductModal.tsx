import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setFalse, addProduct } from './addCustomProductModalSlice'
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import { parameterOptionValues } from '../../constants/rasterParameterConstants'
import { allProductParameters, parameterValuesObject, validFieldsObject } from '../../types/constantTypes';

const AddProductModal = () => {
    const showAddProductModal = useAppSelector((state) => state.addCustomProductModal.showAddProductModal)
    const dispatch = useAppDispatch()

    const [name, setName] = useState('');
    const [cycle, setCycle] = useState('');
    const [pass, setPass] = useState('');
    const [scene, setScene] = useState('');
    const [outputGranuleExtentFlag, setOutputGranuleExtentFlag] = useState(parameterOptionValues.outputGranuleExtentFlag.default as number);
    const [outputSamplingGridType, setOutputSamplingGridType] = useState(parameterOptionValues.outputSamplingGridType.default as string);
    const [rasterResolution, setRasterResulution] = useState(0);
    const [utmZoneAdjust, setUTMZoneAdjust] = useState(parameterOptionValues.utmZoneAdjust.default as string);
    const [mgrsBandAdjust, setMGRSBandAdjust] = useState(parameterOptionValues.mgrsBandAdjust.default as string);

    const [validated, setValidated] = useState(false);
    const [inputsNotValid, setInputsNotValid] = useState([] as string[])

    const requiredFields = ['name', 'cycle', 'pass', 'scene']

    useEffect(() => {}, [showAddProductModal])

    const createFormSelectForParameters = (parameterName: string, setFunction: any) => {
        let parameterNameForKey = parameterName
        if (parameterName === ('rasterResolution')) {
            parameterNameForKey = `${parameterName}${outputSamplingGridType.toUpperCase()}`
        } 
        const parameterOptions: parameterValuesObject = parameterOptionValues[parameterNameForKey]
        return (
            <Form.Select id={parameterNameForKey} aria-label={`${parameterNameForKey}`} defaultValue={parameterOptions.default} onChange={event => setFunction(event.target.value)}>
                {parameterOptions.values.map(parameterValue => <option value={parameterValue}>{parameterValue}</option>)}
            </Form.Select>
        )
    }

    const isValidInput = (inputParameter: string): boolean => {
        return inputParameter !== null && inputParameter !== ''
    }

    const checkValidInputs = (inputParameters: string[]) => {
        const notValidInputs: string[] = []
        const isValid: boolean = inputParameters.map(param => {
            const validity = isValidInput(param)
            if (!validity) notValidInputs.push(Object.keys(param)[0])
            return isValidInput(param)
        }).every(value => value)
        setInputsNotValid(notValidInputs)
        return isValid
    }

    const handleSave = () => {
        const parameters: allProductParameters = {
            name,
            cycle,
            pass,
            scene,
            outputGranuleExtentFlag,
            outputSamplingGridType,
            rasterResolution,
            utmZoneAdjust,
            mgrsBandAdjust
        }

        // if (checkValidInputs([name, cycle, pass, scene])) {
            setValidated(true)
            dispatch(addProduct(parameters))
            dispatch(setFalse())
        // } else {
        //     console.log('not valid')
        // }
    }

  return (
    <Modal show={showAddProductModal} onHide={() => dispatch(setFalse())}>
    <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
    </Modal.Header>

    <Modal.Body>
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
                {createFormSelectForParameters('outputGranuleExtentFlag', setOutputGranuleExtentFlag)}
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Output Sampling Grid Type</Form.Label>
            </Col>  
            <Col>
                {createFormSelectForParameters('outputSamplingGridType', setOutputSamplingGridType)}
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Raster Resolution</Form.Label>
            </Col>  
            <Col>
                {createFormSelectForParameters('rasterResolution', setRasterResulution)}
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>UTM Zone Adjust</Form.Label>
            </Col>
            <Col>
                {createFormSelectForParameters('utmZoneAdjust', setUTMZoneAdjust)}
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>MGRS Band Adjust</Form.Label>
            </Col>
            <Col>
                {createFormSelectForParameters('mgrsBandAdjust', setMGRSBandAdjust)}
            </Col>
        </Row>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setFalse())}>Close</Button>
        <Button variant="primary" type="submit" onClick={() => handleSave()}>Save</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default AddProductModal;