import { ReactElement, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { granuleAlertMessageConstant, granuleSelectionLabels, productCustomizationLabelsUTM, productCustomizationLabelsGEO, parameterOptionValues, parameterHelp, infoIconsToRender, inputBounds } from '../../constants/rasterParameterConstants';
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { InfoCircle, Plus, Trash } from 'react-bootstrap-icons';
import { AdjustType, GranuleForTable, GranuleTableProps, InputType, TableTypes, allProductParameters } from '../../types/constantTypes';
import sampleAvailableGranules from '../../constants/sampleAvailableGranules.json'
import { LatLngExpression } from 'leaflet';
import { addProduct, setSelectedGranules, setGranuleFocus, addGranuleTableAlerts, removeGranuleTableAlerts, editProduct } from './actions/productSlice';
import { setShowDeleteProductModalTrue } from './actions/modalSlice';
import DeleteGranulesModal from './DeleteGranulesModal';

const GranuleTable = (props: GranuleTableProps) => {
  const { tableType } = props
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
  const granuleTableAlerts = useAppSelector((state) => state.product.granuleTableAlerts)
  const generateProductParameters = useAppSelector((state) => state.product.generateProductParameters)
  const showUTMAdvancedOptions = useAppSelector((state) => state.product.showUTMAdvancedOptions)

  const dispatch = useAppDispatch()
  
  const [allChecked, setAllChecked] = useState(false)

  const {outputSamplingGridType} = generateProductParameters

  // add granules
  const [cycle, setCycle] = useState('');
  const [pass, setPass] = useState('');
  const [scene, setScene] = useState('');
  const allAddedGranules = addedProducts.map(parameterObject => parameterObject.granuleId)

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

  const setSaveGranulesAlert = (alert: string) => {
    const {message, variant} = granuleAlertMessageConstant[alert]
    const alertThatExists = granuleTableAlerts.find(alertObj => alertObj.type === alert)
    if (alertThatExists) {
      // if alert already in queue
      // delete alert
      dispatch(removeGranuleTableAlerts(alert))
      // stop timeout
      clearTimeout(alertThatExists.timeoutId)
      // add alert again with timeout
      let newTimeoutId = setTimeout(() => {
        dispatch(removeGranuleTableAlerts(alert))
      }, 4000)

      dispatch(addGranuleTableAlerts({type: alert, message, variant, timeoutId: newTimeoutId, tableType: 'granuleSelection' }))
    } else {
      // if alert not in queue
      // add alert with timeout
      let timeoutId = setTimeout(() => {
        dispatch(removeGranuleTableAlerts(alert))
      }, 4000)

      dispatch(addGranuleTableAlerts({type: alert, message, variant, timeoutId, tableType: 'granuleSelection' }))
    }
  }

  const checkInBounds = (inputType: string, inputValue: string): boolean => {
    return parseInt(inputValue) >= inputBounds[inputType].min && parseInt(inputValue) <= inputBounds[inputType].max
  }

  const validateInputs = (inputType: InputType, inputValue: string): boolean => {
    let validInput = false
    // TODO: error checking if not in the 1-10 format
    // check for more than one -
    // check for characters other than integers and one -
    if (inputValue.includes('-')) {
      const inputBoundsValue = inputValue.split('-')
      const min: string = inputBoundsValue[0].trim()
      const max: string = inputBoundsValue[1].trim()
      const minIsValid = checkInBounds(inputType, min)
      const maxIsValid = checkInBounds(inputType, max)
      validInput = minIsValid && maxIsValid
    } else {
      validInput = checkInBounds(inputType, inputValue.trim())
    }
    return validInput
  }

  const handleSave = () => {
    // check if cycle pass and scene are all within a valid range
    const invalidCycle = !cycle && !validateInputs('cycle', cycle)
    const invalidPass = !pass && !validateInputs('pass', pass)
    const invalidScene = !scene && !validateInputs('scene', scene)

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
    if (invalidCycle || invalidPass || invalidScene) {
      if (invalidCycle) setSaveGranulesAlert('invalidCycle')
      if (invalidPass) setSaveGranulesAlert('invalidPass')
      if (invalidScene) setSaveGranulesAlert('invalidScene')
    } else {
      if (granuleNotFound && granuleAlreadyAdded) {
        setSaveGranulesAlert('alreadyAddedAndNotFound')
      } else if (granuleNotFound && !(invalidCycle || invalidPass || invalidScene)) {
        setSaveGranulesAlert('notFound')
      } else if  (granuleAlreadyAdded) {
        setSaveGranulesAlert('alreadyAdded')
      }
    }

    if (!granuleNotFound && !granuleAlreadyAdded && !invalidCycle && !invalidPass && !invalidScene) {
      setSaveGranulesAlert('success')
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
    dispatch(setGranuleFocus(granuleBeingSelected))
  }

  const handleSelectRemoveGranuleCheckbox = (granuleBeingSelected: string) => {
    if (tableType === 'granuleSelection') {
      if (selectedGranules.includes(granuleBeingSelected)) {
        // remove granuleId from selected list
        dispatch(setSelectedGranules(selectedGranules.filter(id => id !== granuleBeingSelected)))
      } else {
        // add granuleId to selected list
        dispatch(setSelectedGranules([...selectedGranules, granuleBeingSelected]))
      }
    }
  }

  const getAdjustRadioGroup = (adjustType: AdjustType, granuleId: string) => {
    if (adjustType === 'zone') {
      return (                    
        <td>  
          <Form>              
              {parameterOptionValues.utmZoneAdjust.values.map((value, index) => 
                <Form.Check
                    defaultChecked={value === parameterOptionValues.utmZoneAdjust.default}
                    inline
                    label={value}
                    name="utmZoneAdjustGroup"
                    type={'radio'}
                    id={`utmZoneAdjustGroup-radio-${granuleId}`}
                    onChange={() => handleAdjustSelection('zone', granuleId, value as string)} 
                />
              )}
          </Form>
        </td>
      )
    } else if (adjustType === 'band') {
      return (
        <td>  
          <Form>              
            {parameterOptionValues.mgrsBandAdjust.values.map((value, index) => 
              <Form.Check
                  defaultChecked={value === parameterOptionValues.mgrsBandAdjust.default}
                  inline
                  label={value}
                  name="mgrsBandAdjustGroup"
                  type={'radio'}
                  id={`mgrsBandAdjustGroup-radio-${granuleId}`}
                  onChange={() => handleAdjustSelection('band', granuleId, value as string)} 
              />
            )}
          </Form>
        </td>
      )
    }
  }

  const getValuesForRow = (tableType: TableTypes, basicGranuleValues: GranuleForTable) => {
    const formattedGranulesForTable = Object.entries(basicGranuleValues).map(entry => <td>{entry[1]}</td> )
    if (tableType === 'productCustomization' && showUTMAdvancedOptions && (outputSamplingGridType === 'utm')) {
      //put two more entries in there
      formattedGranulesForTable.push(getAdjustRadioGroup('zone', basicGranuleValues.granuleId) as ReactElement)
      formattedGranulesForTable.push(getAdjustRadioGroup('band', basicGranuleValues.granuleId) as ReactElement)
    }

    return formattedGranulesForTable
  }

  const handleAdjustSelection = (adjustType: AdjustType, granuleId: string, adjustValue: string) => {
    const productToEdit = addedProducts.find(granuleObj => granuleId === granuleObj.granuleId)
    const editedProduct = {...productToEdit}
    if (adjustType === 'zone') {
      editedProduct!.utmZoneAdjust = adjustValue
    } else if (adjustType === 'band') {
      editedProduct!.mgrsBandAdjust = adjustValue
    }
    dispatch(editProduct(editedProduct as allProductParameters))
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
       <InfoCircle/>
    </OverlayTrigger>
)

  const renderColTitle = (labelEntry: string[]) => {
    let infoIcon = infoIconsToRender.includes(labelEntry[0]) ? renderInfoIcon(labelEntry[0]) : null
    return (
      <th>{labelEntry[1]} {infoIcon}</th>
    )
  }

  return (
    <div style={{backgroundColor: '#2C415C', marginTop: '10px', marginBottom: '20px'}} className='g-0 shadow'>
      <Row style={{marginRight: '0px', marginLeft: '0px', paddingBottom: '5px', paddingTop: '5px'}} className={`${colorModeClass}-sidebar-section-title`}>
        <Col><h5 className={`${colorModeClass}-text`} >{tableType === 'granuleSelection' ? 'Added Scenes' : 'Scenes to Customize'}</h5></Col>
      </Row>
      <div style={{padding: '10px 20px 20px 20px'}}>
      <div className={`table-responsive-${tableType}`}>
        <Table bordered hover className={`table-responsive-${tableType} ${colorModeClass}-table`} style={{marginBottom: '0px'}}>
          <thead>
            <tr>
              {tableType === 'granuleSelection' ? (
                <th>          
                  <Form.Check
                    inline
                    name="group1"
                    label='Remove'
                    id={`inline-select-all`}
                    className='remove-checkbox'
                    style={{cursor: 'pointer'}}
                    onChange={() => handleAllChecked()}
                    // checked={!(allChecked && !addedProducts.length)}
                  />
                </th>
              ): (
                null
              )}
              {tableType === 'granuleSelection' ? Object.entries(granuleSelectionLabels).map(labelEntry => renderColTitle(labelEntry)) : Object.entries((showUTMAdvancedOptions && (outputSamplingGridType === 'utm')) ? productCustomizationLabelsUTM : productCustomizationLabelsGEO).map(labelEntry => renderColTitle(labelEntry))}
            </tr>
          </thead>
          <tbody>
            {addedProducts.map((productParameterObject, index) => {
              // remove footprint from product object when mapping to table
              const { cycle, pass, scene, granuleId} = productParameterObject
              const essentialsGranule = {granuleId, cycle, pass, scene}
              return (
              <tr className={`${colorModeClass}-table hoverable-row`} onClick={() => dispatch(setGranuleFocus(granuleId))}>
                {tableType === 'granuleSelection'  ? (
                  <td>
                    <Form.Check
                      inline
                      name="group1"
                      id={`inline-select-${granuleId}`}
                      className='remove-checkbox'
                      onChange={() => handleSelectRemoveGranuleCheckbox(granuleId)}
                      checked={selectedGranules.includes(granuleId)}
                    />
                  </td>
                ): (null)
                }
                {getValuesForRow(tableType, essentialsGranule)}
              </tr>
            )})}
          </tbody>
          <tfoot>
            {tableType === 'granuleSelection' ? (
              <>
                <tr className='add-granules'>
                  <td colSpan={1}>
                    <Button disabled={selectedGranules.length === 0} style={{width: '70px'}} variant='danger' onClick={() =>  dispatch(setShowDeleteProductModalTrue())}>
                        <Trash color="white" size={18}/>
                    </Button>
                  </td>
                  <td></td>
                  <td><Form.Control value={cycle} required id="add-product-cycle" placeholder="cycle_id" onChange={event => setCycle(event.target.value)}/></td>
                  <td><Form.Control value={pass} required id="add-product-pass" placeholder="pass_id" onChange={event => setPass(event.target.value)}/></td>
                  <td><Form.Control value={scene} required id="add-product-scene" placeholder="scene_id" onChange={event => setScene(event.target.value)}/></td>
                </tr>
                <tr className='add-granules'>
                  <td>Valid Values:</td>
                  <td></td>
                  <td>{`${inputBounds.cycle.min} - ${inputBounds.cycle.max}`}</td>
                  <td>{`${inputBounds.pass.min} - ${inputBounds.pass.max}`}</td>
                  <td>{`${inputBounds.scene.min} - ${inputBounds.scene.max}`}</td>
                </tr>
              </>
              ) : 
              null
            }
          </tfoot>
        </Table>
      </div>
      {tableType === 'granuleSelection' ? <Row style={{marginTop: '5px', marginBottom: '5px'}}><Col>To enter a range of values, enter two numbers separated by a hyphen (e.g. 1-10)</Col></Row> : null}
      {tableType === 'granuleSelection' ? (
          <Row>
            <Col style={{marginTop: '10px'}}>
              <Button variant='primary' size='sm' onClick={() => handleSave()}>
                <Plus size={28}/> Add Scenes
              </Button>
            </Col>
          </Row>
        ) : null
      }
      <DeleteGranulesModal />
      </div>
    </div>
  );
}

export default GranuleTable;