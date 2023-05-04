import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { granuleEssentialLabels, parameterOptionValues } from '../../constants/rasterParameterConstants';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { Plus, Trash } from 'react-bootstrap-icons';
// import EditCusomProductModal from './EditCustomProductModal'
import DeleteCusomProductModal from './DeleteCustomProductModal'
import GenerateCusomProductModal from './GenerateCustomProductModal'
import { setShowDeleteProductModalTrue, addProduct, setShowGenerateProductModalTrue } from './customProductModalSlice';
import { arrayOfProductIds } from '../../types/modalTypes';
import { allProductParameters } from '../../types/constantTypes';
import sampleAvailableGranules from '../../constants/sampleAvailableGranules.json'
import { LatLngExpression } from 'leaflet';

const CustomizedProductTable = () => {
  const allProductParametersArray = useAppSelector((state) => state.customProductModal.allProductParametersArray)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const dispatch = useAppDispatch()
  // const [productsBeingEdited, setProductBeingEdited] = useState([] as arrayOfProductIds)
  const [productsBeingDeleted, setProductBeingDeleted] = useState([] as arrayOfProductIds)
  const [productsBeingGenerated, setProductBeingGenerated] = useState([] as arrayOfProductIds)
  const [selectedGranules, setSelectedGranules] = useState([] as arrayOfProductIds)
  const [allChecked, setAllChecked] = useState(false)

  // add granules
  const [name, setName] = useState('');
  const [cycle, setCycle] = useState('');
  const [pass, setPass] = useState('');
  const [scene, setScene] = useState('');
  const [addGranuleWarning, setAddGranuleWarning] = useState('')
  const [addGranuleWarningVariant, setAddGranuleWarningVariant] = useState('')

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
  
  const handleDelete = (granuleId: string) => {
    const granuleIdToDelete: string = granuleId.split('-')[0]
    dispatch(setShowDeleteProductModalTrue())
    setProductBeingDeleted([...productsBeingDeleted, granuleIdToDelete])
  }
  
  const handleGenerate = (granuleId: string) => {
    setProductBeingGenerated([...productsBeingGenerated, granuleId])
    dispatch(setShowGenerateProductModalTrue())
  }

  const handleAllChecked = () => {
    console.log('CHECKED')
    if (!allChecked) {
      setAllChecked(true)
      // add all granules to checked
      const allCheckedArray = allProductParametersArray.map(parameterObject => parameterObject.granuleId)
      setSelectedGranules(allCheckedArray)
    } else {
      setAllChecked(false)
      // remove all granules from checked
      setSelectedGranules([])
    }
  }

  return (
    <>
      <Row>
        <h3 className={`${colorModeClass}-text`}>Granule Table</h3>
      </Row>
      <div className='table-responsive'>
        <Table bordered hover className={`table-responsive Products-table ${colorModeClass}-table`}>
          <thead>
            <tr>
              <th>          
                <Form.Check
                  inline
                  name="group1"
                  id={`inline-select-all`}
                  style={{cursor: 'pointer'}}
                  onChange={() => handleAllChecked()}
                />
              </th>
              {Object.entries(granuleEssentialLabels).map(labelEntry => <th>{labelEntry[1]}</th>)}
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {allProductParametersArray.map((productParameterObject, index) => {
              // remove footprint from product object when mapping to table
              const {name, cycle, pass, scene, granuleId} = productParameterObject
              const essentialsGranule = {cycle, pass, scene, granuleId}
              return (
              <tr className={`${colorModeClass}-table hoverable-row`}>
                <td>
                  <Form.Check
                    inline
                    name="group1"
                    id={`inline-select-${index}`}
                    className='table-checkbox'
                  />
                </td>
                {Object.entries(essentialsGranule).map(entry => {
                  let valueToDisplay = entry[1]
                  if (entry[0] === 'outputSamplingGridType' && typeof valueToDisplay === 'string') {
                    valueToDisplay = valueToDisplay.toUpperCase()
                  }
                  return <td>{valueToDisplay}</td>
                })}
                <td>
                  <Button variant="danger" id={`${essentialsGranule.granuleId}-delete`} size='sm' onClick={(event) => handleDelete(event.currentTarget.id)}>
                    <Trash color="white" size={18}/>
                  </Button>
                </td>
              </tr>
            )})}
            <tr className='add-granules' style={{ border: 0 }}>
              <td></td>
              <td><Form.Control value={cycle} required id="add-product-cycle" placeholder="cycle_id" onChange={event => setCycle(event.target.value)}/></td>
              <td><Form.Control value={pass} required id="add-product-pass" placeholder="pass_id" onChange={event => setPass(event.target.value)}/></td>
              <td><Form.Control value={scene} required id="add-product-scene" placeholder="scene_id" onChange={event => setScene(event.target.value)}/></td>
              <td colSpan={2}>                
                <Button variant='success' size='sm' onClick={() => handleSave()}>
                  <Plus size={24}/>  Add Granule(s)
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>

        {addGranuleWarning === '' 
          ? null 
          : (<Row style={{paddingTop: '5px', paddingBottom: '30px'}}>
              <Col md={{ span: 6, offset: 3 }}>
                <Alert variant={`${addGranuleWarningVariant}`}>{addGranuleWarning}</Alert>
              </Col>
            </Row>)
        }
        {/* <EditCusomProductModal productsBeingEdited={productsBeingEdited}/> */}
        <DeleteCusomProductModal productsBeingDeleted={productsBeingDeleted}/>
      </div>
    </>
  );
}

export default CustomizedProductTable;