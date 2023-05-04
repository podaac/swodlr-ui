import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowAddProductModalFalse, addProduct } from './customProductModalSlice'
import Form from 'react-bootstrap/Form';
import { Alert, Col, Row } from 'react-bootstrap';
import { allProductParameters } from '../../types/constantTypes';
import sampleAvailableGranules from '../../constants/sampleAvailableGranules.json'
import { LatLngExpression } from 'leaflet';
import { Plus } from 'react-bootstrap-icons';
import { parameterOptionValues } from '../../constants/rasterParameterConstants'

const AddGranules = () => {
    const dispatch = useAppDispatch()
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const allProductParametersArray = useAppSelector((state) => state.customProductModal.allProductParametersArray)

    const [name, setName] = useState('');
    const [cycle, setCycle] = useState('');
    const [pass, setPass] = useState('');
    const [scene, setScene] = useState('');
    const [addGranuleWarning, setAddGranuleWarning] = useState('')
    const [addGranuleWarningVariant, setAddGranuleWarningVariant] = useState('')

    // const [validated, setValidated] = useState(false);
    // const [inputsNotValid, setInputsNotValid] = useState([] as string[])

    // const requiredFields = ['name', 'cycle', 'pass', 'scene']

    // const setInitialStates = () => {
    //     setName('')
    //     setCycle('')
    //     setPass('')
    //     setScene('')
    //     setAddGranuleWarning('')
    // }

    // useEffect(() => {}, [setInitialStates])

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

    const handleSave = () => {
        // check if granule exists with that scene, cycle, and pass
        const granuleFoundResult = sampleAvailableGranules.find(granuleObject => granuleObject.cycle === cycle && granuleObject.pass === pass && granuleObject.scene === scene)
        const granulesAlreadyAdded: string[] = allProductParametersArray.map(granuleObj => granuleObj.granuleId)
        if (granuleFoundResult && !granulesAlreadyAdded.includes(granuleFoundResult.granuleId)) {
            // NOTE: this is using sample json array but will be hooked up to the get granule API result later
            // get the granuleId from it and pass it to the parameters
            const parameters: allProductParameters = {
                granuleId: granuleFoundResult.granuleId,
                name,
                cycle,
                pass,
                scene,
                outputGranuleExtentFlag: parameterOptionValues.outputGranuleExtentFlag.default as number,
                outputSamplingGridType: parameterOptionValues.outputSamplingGridType.default as string,
                rasterResolution: parameterOptionValues.rasterResolutionUTM.default as number,
                utmZoneAdjust: parameterOptionValues.utmZoneAdjust.default as string,
                mgrsBandAdjust: parameterOptionValues.mgrsBandAdjust.default as string,
                footprint: granuleFoundResult.footprint as LatLngExpression[]
            }
            setAddGranuleWarningVariant('success')
            setAddGranuleWarning('SUCCESSFULLY ADDED GRANULE!') 
            // if (checkValidInputs([name, cycle, pass, scene])) {
                // setValidated(true)
                dispatch(addProduct(parameters))
                // dispatch(setShowAddProductModalFalse())
                // set parameters back to default
                // setInitialStates()
            // } else {
            //     console.log('not valid')
            // }
        } else if (!granuleFoundResult){
            setAddGranuleWarningVariant('danger')
            setAddGranuleWarning('NO MATCHING GRANULES FOUND') 
        } else if (granulesAlreadyAdded.includes(granuleFoundResult.granuleId)) {
            setAddGranuleWarningVariant('danger')
            setAddGranuleWarning('THAT GRANULE HAS ALREADY BEEN ADDED')
        }
    }


  return (
    <>
        <Row style={{paddingTop: '20px', paddingBottom: '10px'}}>
            <h3 className={`${colorModeClass}-text`}>Add Granules</h3>
        </Row>
        {/* <Row>
            <Col>
                <h5>Name</h5>
                <Form.Control required id="add-product-name" placeholder="custom_product_name" onChange={event => setName(event.target.value)}/>
            </Col>
        </Row> */}
        <Row><h5>Parameter IDs</h5></Row>
        <Row>
            <Col>
                <Form.Label>Cycle</Form.Label>
                <Form.Control value={cycle} required id="add-product-cycle" placeholder="cycle_id" onChange={event => setCycle(event.target.value)}/>
            </Col>
            <Col>
                <Form.Label>Pass</Form.Label>
                <Form.Control value={pass} required id="add-product-pass" placeholder="pass_id" onChange={event => setPass(event.target.value)}/>
            </Col>
            <Col>
                <Form.Label>Scene</Form.Label>
                <Form.Control value={scene} required id="add-product-scene" placeholder="scene_id" onChange={event => setScene(event.target.value)}/>
            </Col>
        </Row>
        <Row style={{paddingTop: '20px', paddingBottom: '5px'}}>
            <Col>
                <Button variant='success' onClick={() => handleSave()}>
                    <Plus size={24}/> Add Granule(s)
                </Button>
            </Col>
        </Row>
        <Row style={{paddingTop: '5px', paddingBottom: '30px'}}>
            <Col md={{ span: 6, offset: 3 }}>
                <Alert variant={`${addGranuleWarningVariant}`}>{addGranuleWarning}</Alert>
            </Col>
        </Row>
    </>
  );
}

export default AddGranules;