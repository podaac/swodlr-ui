import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AddProductModalProps } from '../../types/modalTypes';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setFalse, addProduct } from './addCustomProductModalSlice'
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import { parameterOptionValues, rasterResolutionOptions } from '../../constants/rasterParameterConstants'
import { allProductParameters, parameterValuesObject } from '../../types/constantTypes';

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

    const createFormSelectForParameters = (parameterName: string) => {
        let parameterNameForKey = parameterName
        if (parameterName === ('rasterResolution')) {
            parameterNameForKey = `${parameterName}${outputSamplingGridType.toUpperCase()}`
        } 
        const parameterOptions: parameterValuesObject = parameterOptionValues[parameterNameForKey]
        return (
            <Form.Select id={parameterNameForKey} aria-label={`${parameterNameForKey}`} defaultValue={parameterOptions.default} onChange={event => setOutputSamplingGridType(event.target.value)}>
                {parameterOptions.values.map(parameterValue => <option value={parameterValue}>{parameterValue}</option>)}
            </Form.Select>
        )
    }

    const onSave = () => {
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
        dispatch(setFalse())
        dispatch(addProduct(parameters))
        console.log(parameters)
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
                <Form.Control id="add-product-name" placeholder="custom_product_name"/>
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
                <Form.Control id="add-product-cycle" placeholder="cycle_id"/>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Pass</Form.Label>
            </Col>  
            <Col>
                <Form.Control id="add-product-pass" placeholder="pass_id"/>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Scene</Form.Label>
            </Col>  
            <Col>
                <Form.Control id="add-product-scene" placeholder="scene_id"/>
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
                {createFormSelectForParameters('outputGranuleExtentFlag')}
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Output Sampling Grid Type</Form.Label>
            </Col>  
            <Col>
                {createFormSelectForParameters('outputSamplingGridType')}
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Raster Resolution</Form.Label>
            </Col>  
            <Col>
                {createFormSelectForParameters('rasterResolution')}
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>UTM Zone Adjust</Form.Label>
            </Col>
            <Col>
                {createFormSelectForParameters('utmZoneAdjust')}
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>MGRS Band Adjust</Form.Label>
            </Col>
            <Col>
                {createFormSelectForParameters('mgrsBandAdjust')}
            </Col>
        </Row>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setFalse())}>Close</Button>
        <Button variant="primary" onClick={() => onSave()}>Save</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default AddProductModal;