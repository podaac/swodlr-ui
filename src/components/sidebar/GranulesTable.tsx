import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { granuleAlertMessageConstant, granuleEssentialLabels, parameterOptionValues } from '../../constants/rasterParameterConstants';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { setShowDeleteProductModalTrue } from './actions/modalSlice';
import { arrayOfProductIds } from '../../types/modalTypes';
import { allProductParameters, sampleGranuleData } from '../../types/constantTypes';
import sampleAvailableGranules from '../../constants/sampleAvailableGranules.json'
import { LatLngExpression } from 'leaflet';
import { addProduct, setSelectedGranules, setGranuleFocus } from './actions/productSlice';
import DeleteGranulesModal from './DeleteGranulesModal';

const GranuleTable = () => {
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
  const dispatch = useAppDispatch()
  const [productsBeingDeleted, setProductBeingDeleted] = useState([] as arrayOfProductIds)
  const [productsBeingGenerated, setProductBeingGenerated] = useState([] as arrayOfProductIds)
  // const [selectedGranules, setSelectedGranules] = useState([] as arrayOfProductIds)
  const [allChecked, setAllChecked] = useState(false)

  // add granules
  const [name, setName] = useState('');
  const [cycle, setCycle] = useState('');
  const [pass, setPass] = useState('');
  const [scene, setScene] = useState('');
  const [addGranuleWarning, setAddGranuleWarning] = useState('')
  const [addGranuleWarningVariant, setAddGranuleWarningVariant] = useState('')
  const [showGranuleAddAlert, setShowGranuleAddAlert] = useState(false)

  useEffect(() => {}, [selectedGranules])

  useEffect(() => {  
    const timeId = setTimeout(() => {
      setShowGranuleAddAlert(false)
    }, 5000)

    return () => {
      clearTimeout(timeId)
    }
  }, [showGranuleAddAlert])

  const getScenesArray = (sceneString: string): string[] => {
    const scenesArray = []
    if (sceneString.includes('-')) {
      const scenesSplit = sceneString.split('-')
      const sceneStartCount = parseInt(scenesSplit[0])
      const sceneEndCount = parseInt(scenesSplit[1])
      for (let sceneId = sceneStartCount; sceneId <= sceneEndCount; sceneId++ ) {
        scenesArray.push(sceneId.toString())
      }
    } else {
      scenesArray.push(sceneString)
    }
    return scenesArray
  }

  const setSaveGranulesAlert = (variant: string, alertMessage: string) => {
    setAddGranuleWarningVariant(variant)
    setAddGranuleWarning(granuleAlertMessageConstant[alertMessage]) 
    setShowGranuleAddAlert(true)
  }

  const handleSave = () => {
    const granulesToAdd: allProductParameters[] = []
    let granuleAlreadyAdded = false
    const granulesAlreadyAdded: sampleGranuleData[] = []
    let granuleNotFound = false
    const granulesNotFound: sampleGranuleData[] = []
    getScenesArray(scene).forEach(sceneId => {
      console.log('sceneId', sceneId)
      // check if granule exists with that scene, cycle, and pass
      const granuleFoundResult = sampleAvailableGranules.find(granuleObject => granuleObject.cycle === cycle && granuleObject.pass === pass && granuleObject.scene === sceneId)
      const granulesAlreadyAdded: string[] = addedProducts.map(granuleObj => granuleObj.granuleId)
      if (granuleFoundResult && !granulesAlreadyAdded.includes(granuleFoundResult.granuleId)) {
          // NOTE: this is using sample json array but will be hooked up to the get granule API result later
          // get the granuleId from it and pass it to the parameters
          const parameters: allProductParameters = {
              granuleId: granuleFoundResult.granuleId,
              name,
              cycle,
              pass,
              scene: sceneId,
              outputGranuleExtentFlag: parameterOptionValues.outputGranuleExtentFlag.default as number,
              outputSamplingGridType: parameterOptionValues.outputSamplingGridType.default as string,
              rasterResolution: parameterOptionValues.rasterResolutionUTM.default as number,
              utmZoneAdjust: parameterOptionValues.utmZoneAdjust.default as string,
              mgrsBandAdjust: parameterOptionValues.mgrsBandAdjust.default as string,
              footprint: granuleFoundResult.footprint as LatLngExpression[]
          }

          granulesToAdd.push(parameters)
      } else if (!granuleFoundResult){
        granuleNotFound = true
      } else if (granulesAlreadyAdded.includes(granuleFoundResult.granuleId)) {
        granuleAlreadyAdded = true
      }
    })
    
    // check if any granules could not be found or they were already added
    if (granuleNotFound && granuleAlreadyAdded) {
      console.log()
      setSaveGranulesAlert('danger', 'alreadyAddedAndNotFound')
    } else if (granuleNotFound) {
      setSaveGranulesAlert('danger', 'notFound')
    } else if  (granuleAlreadyAdded) {
      setSaveGranulesAlert('danger', 'alreadyAdded')
    } else {
      setSaveGranulesAlert('success', 'success')
      dispatch(addProduct(granulesToAdd))
      dispatch(setGranuleFocus(granulesToAdd[0].granuleId))
    }
}
  
  const handleDelete = (granuleId: string) => {
    const granuleIdToDelete: string = granuleId.split('-')[0]
    dispatch(setShowDeleteProductModalTrue())
    setProductBeingDeleted([...productsBeingDeleted, granuleIdToDelete])
  }

  const handleAllChecked = () => {
    if (!allChecked) {
      setAllChecked(true)
      // add all granules to checked
      const allCheckedArray = addedProducts.map(parameterObject => parameterObject.granuleId)
      dispatch(setSelectedGranules(allCheckedArray))
    } else {
      setAllChecked(false)
      // remove all granules from checked
      dispatch(setSelectedGranules([]))
    }
  }

  const handleGranuleSelected = (granuleBeingSelected: string) => {
    if (selectedGranules.includes(granuleBeingSelected)) {
      // remove granuleId from selected list
      dispatch(setSelectedGranules(selectedGranules.filter(id => id !== granuleBeingSelected)))
    } else {
      // add granuleId to selected list
      dispatch(setSelectedGranules([...selectedGranules, granuleBeingSelected]))
    }
  }

  return (
    <Row>
      <Row style={{marginBottom: '10px'}}>
        <h4 className={`${colorModeClass}-text`}>Granule Table</h4>
      </Row>
      <div className='table-responsive'>
        <Table bordered hover className={`table-responsive ${colorModeClass}-table`} style={{marginBottom: '0px'}}>
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
              {/* <th>Delete</th> */}
            </tr>
          </thead>
          <tbody>
            {addedProducts.map((productParameterObject, index) => {
              // remove footprint from product object when mapping to table
              const { cycle, pass, scene, granuleId} = productParameterObject
              const essentialsGranule = {cycle, pass, scene, granuleId}
              return (
              <tr className={`${colorModeClass}-table hoverable-row`} onClick={() => dispatch(setGranuleFocus(granuleId))}>
                <td>
                  <Form.Check
                    inline
                    name="group1"
                    id={`inline-select-${granuleId}`}
                    className='table-checkbox'
                    onChange={event => handleGranuleSelected(granuleId)}
                    checked={selectedGranules.includes(granuleId)}
                  />
                </td>
                {Object.entries(essentialsGranule).map(entry => {
                  let valueToDisplay = entry[1]
                  if (entry[0] === 'outputSamplingGridType' && typeof valueToDisplay === 'string') {
                    valueToDisplay = valueToDisplay.toUpperCase()
                  }
                  return <td>{valueToDisplay}</td>
                })}
                {/* <td>
                  <Button variant="danger" id={`${essentialsGranule.granuleId}-delete`} size='sm' onClick={(event) => handleDelete(event.currentTarget.id)}>
                    <Trash color="white" size={18}/>
                  </Button>
                </td> */}
              </tr>
            )})}
          </tbody>
        </Table>
        {/* <DeleteGranulesModal /> */}
      </div>
      <div className='table-responsive'>
      <Table bordered hover className={`table-responsive Products-table ${colorModeClass}-table`}>
        <thead>
          <tr className='add-granules' style={{ border: 0 }}>
            <td></td>
            <td><Form.Control value={cycle} required id="add-product-cycle" placeholder="cycle_id" onChange={event => setCycle(event.target.value)}/></td>
            <td><Form.Control value={pass} required id="add-product-pass" placeholder="pass_id" onChange={event => setPass(event.target.value)}/></td>
            <td><Form.Control value={scene} required id="add-product-scene" placeholder="scene_id" onChange={event => setScene(event.target.value)}/></td>
            <td colSpan={2}>                
              <Button variant='success' size='sm' onClick={() => handleSave()}>
                <Plus size={24}/>Add Granule(s)
              </Button>
            </td>
          </tr>
        </thead>
      </Table>
      </div>
      {(showGranuleAddAlert && addGranuleWarning !== '') 
          ? (<Row style={{paddingTop: '5px', paddingBottom: '30px'}}>
              <Col md={{ span: 6, offset: 3 }}>
                <Alert variant={`${addGranuleWarningVariant}`}>{addGranuleWarning}</Alert>
              </Col>
            </Row>)
          : null
      }
    </Row>
  );
}

export default GranuleTable;