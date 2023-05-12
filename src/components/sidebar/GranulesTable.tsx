import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { granuleAlertMessageConstant, granuleEssentialLabels, parameterOptionValues } from '../../constants/rasterParameterConstants';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { ArrowReturnRight, Plus, Trash } from 'react-bootstrap-icons';
import { allProductParameters } from '../../types/constantTypes';
import sampleAvailableGranules from '../../constants/sampleAvailableGranules.json'
import { LatLngExpression } from 'leaflet';
import { addProduct, setSelectedGranules, setGranuleFocus } from './actions/productSlice';
import { setActiveTab, setGranuleTableEditable } from './actions/sidebarSlice';
import { setShowDeleteProductModalTrue } from './actions/modalSlice';
import DeleteGranulesModal from './DeleteGranulesModal';

const GranuleTable = () => {
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
  const granuleTableEditable = useAppSelector((state) => state.sidebar.granuleTableEditable)
  const dispatch = useAppDispatch()
  const [allChecked, setAllChecked] = useState(false)

  // add granules
  const [cycle, setCycle] = useState('');
  const [pass, setPass] = useState('');
  const [scene, setScene] = useState('');
  const [addGranuleWarning, setAddGranuleWarning] = useState('')
  const [addGranuleWarningVariant, setAddGranuleWarningVariant] = useState('')
  const [showGranuleAddAlert, setShowGranuleAddAlert] = useState(false)
  const allAddedGranules = addedProducts.map(parameterObject => parameterObject.granuleId)

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
    // const granulesAlreadyAdded: sampleGranuleData[] = []
    let granuleNotFound = false
    getScenesArray(scene).forEach(sceneId => {
      // check if granule exists with that scene, cycle, and pass
      const granuleFoundResult = sampleAvailableGranules.find(granuleObject => granuleObject.cycle === cycle && granuleObject.pass === pass && granuleObject.scene === sceneId)
      // const granulesAlreadyAdded: string[] = addedProducts.map(granuleObj => granuleObj.granuleId)
      if (granuleFoundResult && !allAddedGranules.includes(granuleFoundResult.granuleId)) {
          // NOTE: this is using sample json array but will be hooked up to the get granule API result later
          // get the granuleId from it and pass it to the parameters
          const parameters: allProductParameters = {
              granuleId: granuleFoundResult.granuleId,
              name: '',
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
      } else if (allAddedGranules.includes(granuleFoundResult.granuleId)) {
        granuleAlreadyAdded = true
      }
    })
    
    // check if any granules could not be found or they were already added
    if (granuleNotFound && granuleAlreadyAdded) {
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

  const handleAllChecked = () => {
    if (!allChecked) {
      setAllChecked(true)
      // add all granules to checked
      dispatch(setSelectedGranules(allAddedGranules))
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
      <Row style={{marginBottom: '15px'}}>
        <Col md={{ span: 4, offset: 1 }}><h6>Edit Mode</h6></Col>
        <Col md={{ span: 2, offset: 0 }}>
          <Form.Check 
              type="switch"
              defaultChecked={!granuleTableEditable}
              className={`table-mode-switch ${colorModeClass}-text`}
              // label="Dark mode"
              id="dark-mode-switch"
              // checked={granuleTableEditable}
              style={{paddingRight: '20px', cursor: 'pointer'}}
              onClick={() => dispatch(setGranuleTableEditable(!granuleTableEditable))}
            />
        </Col>
        <Col md={{ span: 4, offset: 0 }}><h6>Generate Product Mode</h6></Col>
      </Row>
      <div className='table-responsive'>
        <Table bordered hover className={`table-responsive ${colorModeClass}-table`} style={{marginBottom: '0px'}}>
          <thead>
            <tr>
              {Object.entries(granuleEssentialLabels).map(labelEntry => <th>{labelEntry[1]}</th>)}
              {granuleTableEditable ? (
                <th>          
                  <Form.Check
                    inline
                    name="group1"
                    label='Delete'
                    id={`inline-select-all`}
                    style={{cursor: 'pointer'}}
                    onChange={() => handleAllChecked()}
                  />
                </th>
              ): null}
            </tr>
          </thead>
          <tbody>
            {addedProducts.map((productParameterObject, index) => {
              // remove footprint from product object when mapping to table
              const { cycle, pass, scene, granuleId} = productParameterObject
              const essentialsGranule = {cycle, pass, scene, granuleId}
              return (
              <tr className={`${colorModeClass}-table hoverable-row`} onClick={() => handleGranuleSelected(granuleId)}>
                {Object.entries(essentialsGranule).map(entry => {
                  let valueToDisplay = entry[1]
                  if (entry[0] === 'outputSamplingGridType' && typeof valueToDisplay === 'string') {
                    valueToDisplay = valueToDisplay.toUpperCase()
                  }
                  return <td>{valueToDisplay}</td>
                })}
                {granuleTableEditable  ? (
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
                ): null}
              </tr>
            )})}
          </tbody>
        </Table>
      </div>
      { granuleTableEditable ? (
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
                      <Plus size={24}/>
                    </Button>
                  </td>
                  <td colSpan={2}>
                    <Button disabled={selectedGranules.length === 0} variant='danger' onClick={() =>  dispatch(setShowDeleteProductModalTrue())}>
                        <Trash color="white" size={18}/>
                    </Button>
                  </td>
                </tr>
              </thead>
            </Table>
          </div>
        ) : null
      }
      {(showGranuleAddAlert && addGranuleWarning !== '') 
          ? (<Row style={{paddingTop: '5px', paddingBottom: '10px'}}>
              <Col md={{ span: 6, offset: 3 }}>
                <Alert variant={`${addGranuleWarningVariant}`}>{addGranuleWarning}</Alert>
              </Col>
            </Row>)
          : null
      }
      <Row>
        <Col>
          <Button variant='success' disabled={granuleTableEditable} style={{marginTop: '10px'}} onClick={() => dispatch(setActiveTab('productCustomization'))}>Customize Products <ArrowReturnRight /></Button>
        </Col>
      </Row>
      <DeleteGranulesModal />
    </Row>
  );
}

export default GranuleTable;