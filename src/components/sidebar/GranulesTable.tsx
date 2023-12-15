import { ReactElement, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { granuleAlertMessageConstant, granuleSelectionLabels, productCustomizationLabelsUTM, productCustomizationLabelsGEO, parameterOptionValues, parameterHelp, infoIconsToRender, inputBounds, sampleFootprint, granuleTableLimit, spatialSearchCollectionConceptId } from '../../constants/rasterParameterConstants';
import { Button, Col, Form, OverlayTrigger, Row, Tooltip, Spinner } from 'react-bootstrap';
import { InfoCircle, Plus, Trash } from 'react-bootstrap-icons';
import { AdjustType, AdjustValueDecoder, GranuleForTable, GranuleTableProps, InputType, SpatialSearchResult, TableTypes, alertMessageInput, allProductParameters, validScene } from '../../types/constantTypes';
import { addProduct, setSelectedGranules, setGranuleFocus, addGranuleTableAlerts, removeGranuleTableAlerts, editProduct, addSpatialSearchResults, setWaitingForFootprintSearch } from './actions/productSlice';
import { setShowDeleteProductModalTrue } from './actions/modalSlice';
import DeleteGranulesModal from './DeleteGranulesModal';
import { graphQLClient } from '../../user/userData';
import { useSearchParams } from 'react-router-dom';
import { Session } from '../../authentication/session';
import { LatLngExpression } from 'leaflet';

const GranuleTable = (props: GranuleTableProps) => {
  const { tableType } = props
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
  const spatialSearchResults = useAppSelector((state) => state.product.spatialSearchResults)
  const granuleTableAlerts = useAppSelector((state) => state.product.granuleTableAlerts)
  const generateProductParameters = useAppSelector((state) => state.product.generateProductParameters)
  const showUTMAdvancedOptions = useAppSelector((state) => state.product.showUTMAdvancedOptions)
  const waitingForSpatialSearch = useAppSelector((state) => state.product.waitingForSpatialSearch)
  const waitingForFootprintSearch = useAppSelector((state) => state.product.waitingForFootprintSearch)
  const spatialSearchStartDate = useAppSelector((state) => state.product.spatialSearchStartDate)
  const spatialSearchEndDate = useAppSelector((state) => state.product.spatialSearchEndDate)

  const dispatch = useAppDispatch()
  
  const [allChecked, setAllChecked] = useState(false)
  const {outputSamplingGridType} = generateProductParameters

  // search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // set the default url state parameters
  useEffect(() => {
    // if any cycle scene and pass parameters in url, add them to table
    const cyclePassSceneParameters = searchParams.get('cyclePassScene')
    if (cyclePassSceneParameters) {
      const sceneParamArray = Array.from(new Set(cyclePassSceneParameters.split('-')))
      sceneParamArray.forEach(sceneParams => {
        const splitSceneParams = sceneParams.split('_')
        if (splitSceneParams.length > 3) {
          // update zone and band adjust values
          const zoneAdjustValue = adjustParamDecoder('value', splitSceneParams[3])
          const bandAdjustValue = adjustParamDecoder('value', splitSceneParams[4])
          const productToEdit = addedProducts.find(granuleObj => granuleObj.cycle === splitSceneParams[0] && granuleObj.pass === splitSceneParams[1] && granuleObj.scene === splitSceneParams[2])
          if (productToEdit?.utmZoneAdjust !== zoneAdjustValue || productToEdit?.mgrsBandAdjust !== bandAdjustValue) {
            const editedProduct = {...productToEdit, utmZoneAdjust: zoneAdjustValue, mgrsBandAdjust: bandAdjustValue}
            dispatch(editProduct(editedProduct as allProductParameters))
          }
        }
        handleSave(splitSceneParams[0], splitSceneParams[1], splitSceneParams[2])
      })
    }
  }, [tableType === 'granuleSelection' ? null : addedProducts])

  useEffect(() => {
    if (spatialSearchResults.length > 0) {
      spatialSearchResults.forEach(spatialSearchResult => handleSave(spatialSearchResult.cycle, spatialSearchResult.pass, spatialSearchResult.scene))
      // clear spatial results out of redux after use
      if(spatialSearchResults.length !== 0) dispatch(addSpatialSearchResults([] as SpatialSearchResult[]))
    }
  }, [spatialSearchResults])

  const addSearchParamToCurrentUrlState = (newPairsObject: object, remove?: string) => {
      const currentSearchParams = Object.fromEntries(searchParams.entries())
      Object.entries(newPairsObject).forEach(pair => {
          currentSearchParams[pair[0]] = pair[1].toString()
      })
      
      // remove unused search param
      if (remove) {
          delete currentSearchParams[remove]
      }
      setSearchParams(currentSearchParams)
  }

  // add granules
  const [cycle, setCycle] = useState('');
  const [pass, setPass] = useState('');
  const [scene, setScene] = useState('');
  const allAddedGranules = addedProducts.map(parameterObject => parameterObject.granuleId)
  const [waitingForScenesToBeAdded, setWaitingForScenesToBeAdded] = useState(false)

const validateSceneAvailability = async (cycleToUse: number, passToUse: number, sceneToUse: number[]): Promise<validScene> => {
  try {
    // build grapql availableScene query with all cycle/pass/scene combos requested
    let queryAliasString = ``
    for(const specificScene of sceneToUse) {
      const comboId = `${cycleToUse}_${passToUse}_${specificScene}`
      queryAliasString += ` s_${comboId}: availableScene(cycle: ${cycleToUse}, pass: ${passToUse}, scene: ${specificScene}) `
    }
    const queryAliasObject = `{${queryAliasString}}`
    const res: {availableScene: boolean} = await graphQLClient.request(queryAliasObject, {cycle: cycleToUse, pass: passToUse, scene: sceneToUse[0]}).then(response => {
      const responseToReturn = Object.fromEntries(Object.entries(response as {availableScene: boolean}).map(responseObj => [responseObj[0].replace('s_', ''), responseObj[1]]))
      return responseToReturn as {availableScene: boolean}
    })
    return res
  } catch (err) {
      console.log (err)
      return {}
  }
}

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

  const setSaveGranulesAlert = (alert: alertMessageInput) => {
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
    return parseInt(inputValue) >= inputBounds[inputType].min && parseInt(inputValue) <= inputBounds[inputType].max && !isNaN(+(inputValue.trim()))
  }

  const inputIsValid = (inputType: InputType, inputValue: string): boolean => {
    let validInput = false
    // TODO: error checking if not in the 1-10 format
    // check for more than one -
    // check for characters other than integers and one -
    if (inputValue.includes('-')) {
      const inputBoundsValue = inputValue.split('-')
      // const allInputsValidNumbers = inputBoundsValue.every(inputString => !isNaN(+inputString))
      const min: string = inputBoundsValue[0].trim()
      const max: string = inputBoundsValue[1].trim()
      const minIsValid = checkInBounds(inputType, min)
      const maxIsValid = checkInBounds(inputType, max)
      validInput = minIsValid && maxIsValid
    } else {
      const validInBounds = checkInBounds(inputType, inputValue.trim())
      validInput = validInBounds
    }
    return validInput
  }

  const searchParamSceneComboAlreadyInUrl = (cyclePassSceneSearchParams: string, cycleValue: string, passValue: string, sceneValue: string): boolean => {
    let searchParamSceneComboAlreadyInUrlResult: boolean = false
    if (cyclePassSceneSearchParams) {
      const sceneParamArray = cyclePassSceneSearchParams.split('-')
      const relevantParam = sceneParamArray.find(param => param.includes(`${cycleValue}_${passValue}_${sceneValue}`))
      if (relevantParam) {
        searchParamSceneComboAlreadyInUrlResult = true
      }
    }
    return searchParamSceneComboAlreadyInUrlResult
  }
  
  const alreadyAddedCyclePassScene = (cycleValue: string, passValue: string, sceneValue: string): boolean => {
    let existingValue = false
    const cyclePassSceneParameters = searchParams.get('cyclePassScene')
    addedProducts.forEach(product => {
      if (product.cycle === cycleValue && product.pass === passValue && product.scene === sceneValue) {   
        existingValue = true
      } else {
        if (cyclePassSceneParameters) {
          const sceneParamArray = cyclePassSceneParameters.split('-')
          const relevantParam = sceneParamArray.find(param => param.includes(`${cycleValue}_${passValue}_${sceneValue}`))
          if (relevantParam) {
            existingValue = true
          }
        }
      }
    })
    return existingValue
  }

  const getSceneFootprint = async (collectionId: string, granuleId: string) => {
    try {
      // get session token to use in spatial search query
      const session = await Session.getCurrent();
      if (session === null) {
        throw new Error('No current session');
      }
      const authToken = await session.getAccessToken();
      if (authToken === null) {
        throw new Error('Failed to get authentication token');
      }
      dispatch(setWaitingForFootprintSearch(true))
      const footprintSearchUrl = `https://cmr.earthdata.nasa.gov/search/granules.json?collection_concept_id=${collectionId}&producer_granule_id\[\]=${granuleId}&options[producer_granule_id][pattern]=true`
      const footprintResult = await fetch(footprintSearchUrl, {
        method: 'GET',
        credentials: 'omit',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then(response => response.json()).then(data => {
        const timeStart = new Date(data.feed.entry[0].time_start)
        const timeEnd = new Date(data.feed.entry[0].time_end)
        const spatialSearchStartDateToUse = new Date(spatialSearchStartDate)
        const spatialSearchEndDateToUse = new Date(spatialSearchEndDate)
        const granuleInTimeRange: boolean = timeStart > spatialSearchStartDateToUse && timeStart < spatialSearchEndDateToUse && timeEnd > spatialSearchStartDateToUse && timeEnd < spatialSearchEndDateToUse
        const footprintCoordinatesSingleArray = (data.feed.entry[0].polygons[0][0]).split(' ').map((coordinateString: string) => parseFloat(coordinateString))
        let footprintLatLongArray: LatLngExpression[] = []
        for(let i=0; i<footprintCoordinatesSingleArray.length; i++) {
          if(i%2 === 0) {
            //pair up current latitude and adjacent latitude
            footprintLatLongArray.push([footprintCoordinatesSingleArray[i], footprintCoordinatesSingleArray[i+1]])
          }
        }
        return [footprintLatLongArray,granuleInTimeRange]
      })
      dispatch(setWaitingForFootprintSearch(false))
      return footprintResult
    } catch (err) {
      dispatch(setWaitingForFootprintSearch(false))
      console.log (err)
      if (err instanceof Error) {
          return err
        } else {
          return 'something happened'
        }
    }
  }

  const padCPSForCmrQuery = (cpsString: string): string => {
    let cpsValueToReturn = cpsString
    if (cpsString.length < 3) {
      // add 0's to beginning of string
      while(cpsValueToReturn.length < 3) {
        cpsValueToReturn = '0' + cpsValueToReturn
      }
    }
    return cpsValueToReturn
  }

  const handleSave = async (cycleParam?: string, passParam?: string, sceneParam?: string) => {
    setWaitingForScenesToBeAdded(true)
    const cycleToUse = cycleParam ?? cycle
    const passToUse = passParam ?? pass
    const sceneToUse = sceneParam ?? scene
    // check if cycle pass and scene are all within a valid range
    const validCycle = inputIsValid('cycle', cycleToUse)
    const validPass = inputIsValid('pass', passToUse)
    const validScene = inputIsValid('scene', sceneToUse)

    if (!validCycle || !validPass || !validScene) {
      setWaitingForScenesToBeAdded(false)
      if (!validCycle) setSaveGranulesAlert('invalidCycle')
      if (!validPass) setSaveGranulesAlert('invalidPass')
      if (!validScene) setSaveGranulesAlert('invalidScene')
    } else if (addedProducts.length >= granuleTableLimit) {
      setSaveGranulesAlert('granuleLimit')
    } else {
      const granulesToAdd: allProductParameters[] = []
      let someGranulesAlreadyAdded = false
      let cyclePassSceneSearchParams = searchParams.get('cyclePassScene') ? String(searchParams.get('cyclePassScene')) : ''
      const sceneArray = getScenesArray(sceneToUse)
      // check scenes availability
      await validateSceneAvailability(parseInt(cycleToUse), parseInt(passToUse), sceneArray.map(sceneId => parseInt(sceneId))).then(scenesAvailable => {
        // return response
        setWaitingForScenesToBeAdded(false)
        const someScenesNotAvailable = Object.entries(scenesAvailable).some(sceneObjectValidityEntry => {
          return !sceneObjectValidityEntry[1]
        })

        const allScenesNotAvailable = Object.entries(scenesAvailable).every(sceneObjectValidityEntry => {
          return !sceneObjectValidityEntry[1]
        })

        // TODO: make alert more verbose if some granules are added and others are not when adding more than one with scene hyphen
        sceneArray.filter(sceneNumber => scenesAvailable[`${cycleToUse}_${passToUse}_${sceneNumber}`]).forEach(async sceneId => {
          // check if granule exists with that scene, cycle, and pass
          const comboAlreadyAdded = alreadyAddedCyclePassScene(cycleToUse, passToUse, sceneId)
          const cyclePassSceneInBounds = checkInBounds('cycle', cycleToUse) && checkInBounds('pass', passToUse) && checkInBounds('scene', sceneId)
          if (cyclePassSceneInBounds && !comboAlreadyAdded) {
            // get the granuleId from it and pass it to the parameters
            const parameters: allProductParameters = {
              granuleId: `${cycleToUse}_${passToUse}_${sceneId}`,
              name: '',
              cycle: cycleToUse,
              pass: passToUse,
              scene: sceneId,
              outputGranuleExtentFlag: parameterOptionValues.outputGranuleExtentFlag.default as number,
              outputSamplingGridType: parameterOptionValues.outputSamplingGridType.default as string,
              rasterResolution: parameterOptionValues.rasterResolutionUTM.default as number,
              utmZoneAdjust: parameterOptionValues.utmZoneAdjust.default as string,
              mgrsBandAdjust: parameterOptionValues.mgrsBandAdjust.default as string,
              footprint: sampleFootprint
            }
            // add cycle/pass/scene to url parameters
            if (!searchParamSceneComboAlreadyInUrl(cyclePassSceneSearchParams, cycleToUse, passToUse, sceneId)) {
              cyclePassSceneSearchParams += `${cyclePassSceneSearchParams.length === 0 ? '' : '-'}${cycleToUse}_${passToUse}_${sceneId}`
            }
            granulesToAdd.push(parameters)
          } else if (comboAlreadyAdded) {
            someGranulesAlreadyAdded = true
          }
        })
        // check if any granules could not be found or they were already added    
        if (someGranulesAlreadyAdded) {
          setSaveGranulesAlert('alreadyAdded')
        } 
        if (allScenesNotAvailable) {
          setSaveGranulesAlert('allScenesNotAvailable')
        }
        if (someScenesNotAvailable) {
          setSaveGranulesAlert('someScenesNotAvailable')
          // set granule alert to show which scenes are missing but also say that you were successful
        }
        return granulesToAdd
      }).then(async granulesToAdd => {
        if (granulesToAdd.length > 0) {
          await Promise.all(granulesToAdd.map(async granule => {
            const granuleIdForFootprint = `*${padCPSForCmrQuery(cycleToUse)}_${padCPSForCmrQuery(passToUse)}_${padCPSForCmrQuery(String(Math.floor(parseInt(granule.scene)*2)))}*`
            // const granuleIdForFootprint = `*${padCPSForCmrQuery(cycleToUse)}_${padCPSForCmrQuery(passToUse)}_${padCPSForCmrQuery(String(granule.scene))}*`
            return Promise.resolve(await getSceneFootprint(spatialSearchCollectionConceptId as string, granuleIdForFootprint).then(retrievedFootprint => {
              const validFootprintResultArray = retrievedFootprint as (boolean | LatLngExpression[])[]
              const footprintResult = validFootprintResultArray[0]
              const isInTimeRange = validFootprintResultArray[1]
              return {...granule, footprint: footprintResult, inTimeRange: isInTimeRange} as allProductParameters
            }))
          })).then(async productsWithFootprints => {
            const productsInTimeRange: allProductParameters[] = []
            const productsNotInTimeRange:allProductParameters[] = []
            productsWithFootprints.forEach(product => {
              if (product.inTimeRange){
                delete product.inTimeRange
                productsInTimeRange.push(product)
              } else if (!product.inTimeRange) {
                delete product.inTimeRange
                productsNotInTimeRange.push(product)
              }
            })
            if (productsInTimeRange.length > 0) {
              setSaveGranulesAlert('success')
              dispatch(addProduct(productsInTimeRange))
              addSearchParamToCurrentUrlState({'cyclePassScene': cyclePassSceneSearchParams})
            }
            if (productsNotInTimeRange.length > 0) {
              // set alerts for not in range
              setSaveGranulesAlert('notInTimeRange')
            }
          })
        }
      })
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
    const productToUse = addedProducts.find(product => product.granuleId === granuleId)
    const utmZoneAdjustToUse = productToUse?.utmZoneAdjust
    const mgrsBandAdjustToUse = productToUse?.mgrsBandAdjust
    if (adjustType === 'zone') {
      return (                    
        <td>  
          <Form>              
              {parameterOptionValues.utmZoneAdjust.values.map((value, index) => 
                <Form.Check
                    checked = {value === utmZoneAdjustToUse}
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
                  checked = {value === mgrsBandAdjustToUse}
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
    const {granuleId, ...restOfGranule} = basicGranuleValues
    const formattedGranulesForTable = Object.entries(restOfGranule).map((entry, index) => <td key={`${entry[0]}-${index}`}>{entry[1]}</td> )
    if (tableType === 'productCustomization' && showUTMAdvancedOptions && (outputSamplingGridType === 'utm')) {
      //put two more entries in there
      formattedGranulesForTable.push(getAdjustRadioGroup('zone', granuleId) as ReactElement)
      formattedGranulesForTable.push(getAdjustRadioGroup('band', granuleId) as ReactElement)
    }

    return formattedGranulesForTable
  }

  const adjustParamDecoder = (targetLocation: 'url' | 'value', adjustValueToConvert: string): string => {
    const adjustParamObject: AdjustValueDecoder = {
      '00': '0',
      '01': '-1',
      '10': '+1'
    }
    if (targetLocation === 'url') {
      return Object.keys(adjustParamObject).find(key => adjustParamObject[key] === adjustValueToConvert) as string
    } else {
      return adjustParamObject[adjustValueToConvert]
    }
  }

  const handleModifyingSceneSearchParams = (action: 'add' | 'remove', adjustType: AdjustType, adjustValue: string, cycleToUse: string, passToUse: string, sceneToUse: string ) => {
    const adjustParamValue: string = adjustParamDecoder('url',adjustValue)

    let cyclePassSceneSearchParams = searchParams.get('cyclePassScene') ? String(searchParams.get('cyclePassScene')) : ''
    if (cyclePassSceneSearchParams.length > 0) {
      const sceneComboParamOriginal = cyclePassSceneSearchParams.split('-').find(sceneCombo => sceneCombo.includes(`${cycleToUse}_${passToUse}_${sceneToUse}`)) as string
      const sceneComboParamToModify = sceneComboParamOriginal?.split('_') as string[]
      if (action === 'add') {
        if (sceneComboParamToModify.length === 3) {
          // add the adjust params
          if (adjustType === 'zone') {
            sceneComboParamToModify.push(adjustParamValue, '00')
          } else {
            sceneComboParamToModify.push('00', adjustParamValue)
          }
        } else {
          // replace the adjust params
          if (adjustType === 'zone') {
            sceneComboParamToModify[3] = adjustParamValue
          } else {
            sceneComboParamToModify[4] = adjustParamValue
          }
        }
      } else if (action === 'remove') {
        if (sceneComboParamToModify.length > 3) {
          // remove the adjust params
          sceneComboParamToModify.splice(sceneComboParamToModify.length - 2, 2);
        }
      }
      const recombinedSceneParams = cyclePassSceneSearchParams.replace(sceneComboParamOriginal, sceneComboParamToModify.join('_'))
      addSearchParamToCurrentUrlState({'cyclePassScene': recombinedSceneParams})
    }
  }

  const handleAdjustSelection = (adjustType: AdjustType, granuleId: string, adjustValue: string) => {
    const productToEdit = addedProducts.find(granuleObj => granuleId === granuleObj.granuleId)
    const cycleToUse = productToEdit?.cycle as string
    const passToUse = productToEdit?.pass as string
    const sceneToUse = productToEdit?.scene as string
    const editedProduct = {...productToEdit}
    
    let cyclePassSceneSearchParams = searchParams.get('cyclePassScene') ? String(searchParams.get('cyclePassScene')) : ''
    let action: 'add' | 'remove' = 'add'
    if (adjustType === 'zone') {
      editedProduct!.utmZoneAdjust = adjustValue
      if (productToEdit?.utmZoneAdjust !== '0' && productToEdit?.mgrsBandAdjust === '0' && adjustValue === '0' && cyclePassSceneSearchParams.length > 0) { // remove zone adjust params
        action = 'remove'
      } else { // set zone adjust param
        action = 'add'
      }
    } else if (adjustType === 'band') {
      editedProduct!.mgrsBandAdjust = adjustValue
      if (productToEdit?.utmZoneAdjust === '0' && productToEdit?.mgrsBandAdjust !== '0' && adjustValue === '0' && cyclePassSceneSearchParams.length > 0) { // remove band adjust params
        action = 'remove'
      } else { // set zone adjust param
        action = 'add'
      }
    }
    handleModifyingSceneSearchParams(action, adjustType, adjustValue, cycleToUse, passToUse, sceneToUse)
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
      <th key={`info-icon-${labelEntry[1]}`}>{labelEntry[1]} {infoIcon}</th>
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
                <th key={'remove-granule-checkbox'}>          
                  <Form.Check
                    inline
                    name="group1"
                    label='Remove'
                    id={`inline-select-all`}
                    className='remove-checkbox'
                    style={{cursor: 'pointer'}}
                    onChange={() => handleAllChecked()}
                  />
                </th>
              ): (
                null
              )}
              {tableType === 'granuleSelection' ? Object.entries(granuleSelectionLabels).map(labelEntry => renderColTitle(labelEntry)) : Object.entries((showUTMAdvancedOptions && (outputSamplingGridType === 'utm')) ? productCustomizationLabelsUTM : productCustomizationLabelsGEO).map(labelEntry => renderColTitle(labelEntry))}
            </tr>
          </thead>
          <tbody>
            {Array.from(new Set(addedProducts.map(obj => JSON.stringify(obj)))).map(obj => JSON.parse(obj)).map((productParameterObject, index) => {
              // remove footprint from product object when mapping to table
              const { cycle, pass, scene, granuleId} = productParameterObject
              const essentialsGranule = {granuleId, cycle, pass, scene}
              return (
              <tr className={`${colorModeClass}-table hoverable-row`} key={`${granuleId}-${index}`} onClick={() => dispatch(setGranuleFocus(granuleId))}>
                {tableType === 'granuleSelection'  ? (
                  <td key={'remove-checkbox'}>
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
                  <td><Form.Control value={cycle} required id="add-product-cycle" placeholder="cycle_id" onChange={event => setCycle(event.target.value)}/></td>
                  <td><Form.Control value={pass} required id="add-product-pass" placeholder="pass_id" onChange={event => setPass(event.target.value)}/></td>
                  <td><Form.Control value={scene} required id="add-product-scene" placeholder="scene_id" onChange={event => setScene(event.target.value)}/></td>
                </tr>
                <tr className='add-granules'>
                  <td>Valid Values:</td>
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
      {tableType === 'granuleSelection' ? <Row style={{marginTop: '5px', marginBottom: '5px'}}><Col>To add multiple scenes at once, enter two numbers into the scene input field separated by a hyphen (e.g. 1-10)</Col></Row> : null}
      {tableType === 'granuleSelection' ? (
          <Row>
            <Col style={{marginTop: '10px'}}>
              {waitingForScenesToBeAdded || waitingForSpatialSearch || waitingForFootprintSearch ? 
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner> : 
                <Button variant='primary' size='sm' onClick={() => handleSave()}>
                  <Plus size={28}/> Add Scenes
                </Button>
              }
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