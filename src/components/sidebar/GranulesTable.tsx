import { ReactElement, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { granuleAlertMessageConstant, granuleSelectionLabels, productCustomizationLabelsUTM, productCustomizationLabelsGEO, parameterOptionValues, parameterHelp, infoIconsToRender, inputBounds, granuleTableLimit,
   beforeCPS,
   afterCPSL,
   afterCPSR} from '../../constants/rasterParameterConstants';
import { Button, Col, Form, OverlayTrigger, Row, Tooltip, Spinner, Alert } from 'react-bootstrap';
import { InfoCircle, Plus, Trash } from 'react-bootstrap-icons';
import { AdjustType, AdjustValueDecoder, GranuleForTable, GranuleTableProps, InputType, SaveType, SpatialSearchResult, TableTypes, alertMessageInput, allProductParameters, cpsParams, granuleMetadata, handleSaveResult, validScene } from '../../types/constantTypes';
import { addProduct, setSelectedGranules, setGranuleFocus, addGranuleTableAlerts, editProduct, addSpatialSearchResults, clearGranuleTableAlerts, setWaitingForSpatialSearch } from './actions/productSlice';
import { setShowDeleteProductModalTrue } from './actions/modalSlice';
import DeleteGranulesModal from './DeleteGranulesModal';
import { useSearchParams } from 'react-router-dom';
import { Session } from '../../authentication/session';
import { LatLngExpression } from 'leaflet';
import { getGranuleVariables, getGranules } from '../../constants/graphqlQueries';

export const padCPSForCmrQuery = (cpsString: string): string => {
  let cpsValueToReturn = cpsString
  if (cpsString.length < 3) {
    // add 0's to beginning of string
    while(cpsValueToReturn.length < 3) {
      cpsValueToReturn = '0' + cpsValueToReturn
    }
  }
  return cpsValueToReturn
}

const GranuleTable = (props: GranuleTableProps) => {
  const { tableType } = props
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
  const spatialSearchResults = useAppSelector((state) => state.product.spatialSearchResults)
  const generateProductParameters = useAppSelector((state) => state.product.generateProductParameters)
  const showUTMAdvancedOptions = useAppSelector((state) => state.product.showUTMAdvancedOptions)
  const waitingForSpatialSearch = useAppSelector((state) => state.product.waitingForSpatialSearch)
  const spatialSearchStartDate = useAppSelector((state) => state.product.spatialSearchStartDate)
  const spatialSearchEndDate = useAppSelector((state) => state.product.spatialSearchEndDate)
  const startTutorial = useAppSelector((state) => state.app.startTutorial)
  const userHasCorrectEdlPermissions = useAppSelector((state) => state.app.userHasCorrectEdlPermissions)

  const dispatch = useAppDispatch()
  
  const [allChecked, setAllChecked] = useState(false)
  const {outputSamplingGridType} = generateProductParameters

  // search parameters
  const [searchParams, setSearchParams] = useSearchParams()

  // set the default url state parameters
  useEffect(() => {
    // if any cycle scene and pass parameters in url, add them to table
    const cyclePassSceneParameters = searchParams.get('cyclePassScene')
    if (cyclePassSceneParameters) {
      setWaitingForScenesToBeAdded(true)
      const sceneParamArray = Array.from(new Set(cyclePassSceneParameters.split('-')))
      sceneParamArray.forEach((sceneParams, index) => {
        const splitSceneParams = sceneParams.split('_')
        const cpsParams: cpsParams = {
          cycleParam: splitSceneParams[0],
          passParam: splitSceneParams[1],
          sceneParam: splitSceneParams[2]
        }
        handleSave('urlParameter', sceneParamArray.length, index, [cpsParams])
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableType === 'granuleSelection' ? null : addedProducts, startTutorial ? searchParams : null])

  const getValidationObject = (cycleToUse: number, passToUse: number, sceneToUse: number[], granuleJsonData: SpatialSearchResult[]) => {
    const validationObject = {} as validScene
    if(granuleJsonData.length !== 0) {
      let responseTiles: string[] = []
      let granuleMetadata: granuleMetadata = {}
      granuleJsonData.forEach((item: SpatialSearchResult) => {
        const {granuleUr, polygons, producerGranuleId, timeEnd, timeStart} = item
        const responseTileString = granuleUr.match(`${beforeCPS}([0-9]+(_[0-9]+)+)(${afterCPSR}|${afterCPSL})`)?.[1].split('_').map(item2 => parseInt(item2)).join('_') as string
        responseTiles.push(responseTileString)
        const polygonToUse = polygons ? getGranuleFootprint(polygons[0]) : []
        const timeStartToUse = new Date(timeStart)
        const timeEndToUse = new Date(timeEnd)
        granuleMetadata[responseTileString] = {polygons: polygonToUse, producerGranuleId, timeStart: timeStartToUse, timeEnd: timeEndToUse}
      })

      // go through each cycle pass scene combo and see if it is in the return results TODO
      sceneToUse.forEach(sceneInput => {
        const sceneInputId = `${cycleToUse}_${passToUse}_${sceneInput}`
        const validityBool = responseTiles.includes(sceneInputId)
        validationObject[sceneInputId] = validityBool ? {'valid': validityBool, polygons: granuleMetadata[sceneInputId].polygons, timeEnd: granuleMetadata[sceneInputId].timeEnd, timeStart: granuleMetadata[sceneInputId].timeStart, producerGranuleId: granuleMetadata[sceneInputId].producerGranuleId} : {valid: false}
      })
    }
    return validationObject
  }

  const validateCPS = async (cycleToUse: number, passToUse: number, sceneToUse: number[], saveType: SaveType) => {
    let validationObjectToReturn = {}
    if(saveType === 'spatialSearch') {
      // use spatial search data from redux
      return getValidationObject(cycleToUse, passToUse, sceneToUse, spatialSearchResults)
    } else {
      // make calls to get the data
      const session = await Session.getCurrent();
      if (session === null) {
        throw new Error('No current session');
      }
      const authToken = await session.getAccessToken();
      if (authToken === null) {
        throw new Error('Failed to get authentication token');
      }
      validationObjectToReturn = await fetch('https://graphql.earthdata.nasa.gov/api', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: getGranules, variables: getGranuleVariables(cycleToUse, passToUse, sceneToUse)})
      }).then(async data => {
        const responseJson = await data.json()
        return getValidationObject(cycleToUse, passToUse, sceneToUse, responseJson.data.granules.items)
      })
    }

      return validationObjectToReturn
  }
  
  const validateSceneAvailability = async (cycleToUse: number, passToUse: number, sceneToUse: number[], saveType: SaveType): Promise<validScene> => {
    try {
      return validateCPS(cycleToUse, passToUse, sceneToUse, saveType)
    } catch(err) {
      console.log(err)
      return {}
    }
  }

  // Spatial search use effect
  useEffect(() => {
    dispatch(clearGranuleTableAlerts())
      const fetchData = async () => {
        let scenesFoundArray: string[] = []
        let addedScenes: string[] = []
        if (spatialSearchResults.length < 1000) {
          for(let i=0; i<spatialSearchResults.length; i++) {
            if ((addedProducts.length + scenesFoundArray.filter(result => result === 'found something').length) >= granuleTableLimit) {
              // don't let more than 10 be added
              scenesFoundArray.push('hit granule limit')
            } else {
              const cpsParams: cpsParams = {
                cycleParam: spatialSearchResults[i].cycle,
                passParam: spatialSearchResults[i].pass,
                sceneParam: spatialSearchResults[i].scene
              }
              await handleSave('spatialSearch', spatialSearchResults.length, i, [cpsParams]).then(results => {
                results.forEach(result => {
                  if(result.savedScenes) {
                    addedScenes.push(...(result.savedScenes).map(productObject => productObject.granuleId))
                  }
                  scenesFoundArray.push(result.result)
                })
              })
            }
          }
          if(addedScenes.length > 0) {
            // add parameters
            addSearchParamToCurrentUrlState({'cyclePassScene': addedScenes.join('-')})
          }
        } else {
          // If too many spatial search results, the search doesn't work because there too many granules and a limit was reached.
          // In this scenario, make an alert that indicates that the search area was too large.
          // TODO: remove this alert when there is a fix implemented for cmr spatial search limit.
          // The valid granules are sometimes not a part of the first 1000 results which is the bug here.
          scenesFoundArray.push('spatialSearchAreaTooLarge')
        }
        dispatch(setWaitingForSpatialSearch(false))
        return scenesFoundArray
      }
    
      // call the function
      fetchData()
        .then((noScenesFoundResults) => {
          if((noScenesFoundResults.includes('noScenesFound') && !noScenesFoundResults.includes('found something'))) setSaveGranulesAlert('noScenesFound')
          if(noScenesFoundResults.includes('hit granule limit')) setSaveGranulesAlert('granuleLimit')
          if(noScenesFoundResults.includes('spatialSearchAreaTooLarge')) setSaveGranulesAlert('spatialSearchAreaTooLarge')
        })
        // make sure to catch any error
        .catch(console.error);

      // clear spatial results out of redux after use
      if(spatialSearchResults.length !== 0) dispatch(addSpatialSearchResults([] as SpatialSearchResult[]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spatialSearchResults])

  const addSearchParamToCurrentUrlState = (newPairsObject: object, remove?: string) => {
    const currentSearchParams = Object.fromEntries(searchParams.entries())
    const cyclePassSceneParameters = searchParams.get('cyclePassScene')
    Object.entries(newPairsObject).forEach(pair => {
      if (pair[0] === 'cyclePassScene') {
        if(cyclePassSceneParameters !== null) {
          // check if cps already exists in cyclePassSceneParameters
          const currentCpsUrlSplit = cyclePassSceneParameters.split('-')
          const paramsToAddSplit = pair[1].toString().split('-')
          // let combinedParamsArray = currentCpsUrlSplit
          let newParamsArray: string[] = []
          paramsToAddSplit.forEach((newParam: string) => {
            if(!currentCpsUrlSplit.includes(newParam)) {
              newParamsArray.push(newParam)
              // if cps combo not already in url param, add it
              // NOTE FOR WHEN I GET BACK: making sure no duplicates of cps
            }
          })
          if (newParamsArray.length > 0) {
            // if cps without adjust params is in currentCpsUrlSplit and newParamsArray has cps with added adjust params
            const newCPSParams: string[] = []
            newParamsArray.forEach(newParam => {
              currentCpsUrlSplit.forEach(oldParam => {
                const splitOldParam = oldParam.split('_')
                if(!newParam.includes(`${splitOldParam[0]}_${splitOldParam[1]}_${splitOldParam[2]}`) && !newCPSParams.includes(oldParam)) {
                  // remove old param
                  newCPSParams.push(oldParam)
                }
              })
            })
            currentSearchParams[pair[0]]  = [...newCPSParams, ...newParamsArray].join('-')
          }
        } else {
          currentSearchParams[pair[0]] = pair[1].toString()
        }
      } else {
        currentSearchParams[pair[0]] = pair[1].toString()
      }
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

  const setSaveGranulesAlert = (alert: alertMessageInput, additionalParameters?: any[]) => {
    const {message, variant} = granuleAlertMessageConstant[alert]
    dispatch(addGranuleTableAlerts({type: alert, message, variant, tableType: 'granuleSelection' }))
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

  const getGranuleFootprint = (polygons: string): LatLngExpression[] => {
    const footprintCoordinatesSingleArray = (polygons[0]).split(' ').map((coordinateString: string) => parseFloat(coordinateString))
    let footprintLatLongArray: LatLngExpression[] = []
    for(let i=0; i<footprintCoordinatesSingleArray.length; i++) {
      if(i%2 === 0) {
        //pair up current latitude and adjacent latitude
        footprintLatLongArray.push([footprintCoordinatesSingleArray[i], footprintCoordinatesSingleArray[i+1],])
      }
    }
    return footprintLatLongArray
  }

  const granuleInTimeRange = (timeStart: Date, timeEnd: Date): boolean => {
    const spatialSearchStartDateToUse = new Date(spatialSearchStartDate)
    const spatialSearchEndDateToUse = new Date(spatialSearchEndDate)
    const granuleInTimeRange: boolean = timeStart > spatialSearchStartDateToUse && timeStart < spatialSearchEndDateToUse && timeEnd > spatialSearchStartDateToUse && timeEnd < spatialSearchEndDateToUse
    return granuleInTimeRange
  }

  /**
 * Handles the save products operation based on the provided parameters.
 *
 * @param {SaveType} saveType - The type of save operation to perform.
 * @param {number} totalRuns - The total number of runs for the save operation.
 * @param {number} index - The index of the current run.
 * @param {cpsParams[]} [cpsParams] - Optional array of cpsParams (cycle, pass, and scene).
 * @return {Promise<handleSaveResult[]>} A promise that resolves to an array of handleSaveResult objects.
 */
  const handleSave = async (saveType: SaveType, totalRuns: number, index: number, cpsParams?: cpsParams[]): Promise<handleSaveResult[]> => {
    if (saveType === 'manual') dispatch(clearGranuleTableAlerts()) 
    setWaitingForScenesToBeAdded(true)
    const cpsParamsIfUndefined = 
      [{
        cycleParam: cycle,
        passParam: pass,
        sceneParam: scene,
      }]
    const cpsParamsToUse = cpsParams ?? cpsParamsIfUndefined

    const getSaveResults = async () => {
      const handleSaveResults: handleSaveResult[] = []
      for(let i=0; i<cpsParamsToUse.length; i++) {
          const cpsParam = cpsParamsToUse[i] as cpsParams
          const {cycleParam, passParam, sceneParam} = cpsParam
    
          // String(+(stringParam)) is used to remove the leading zeros
          const cycleToUse = String(+(cycleParam))
          const passToUse = String(+(passParam))
          let sceneToUse = sceneParam.split('-').map((sceneValueSplit: string) => String(+sceneValueSplit)).join('-')
          
          // check if cycle pass and scene are all within a valid range
          const validCycle = inputIsValid('cycle', cycleToUse)
          const validPass = inputIsValid('pass', passToUse)
          const validScene = inputIsValid('scene', sceneToUse)
    
          if (!validCycle || !validPass || !validScene) {
            setWaitingForScenesToBeAdded(false)
            if (!validCycle) setSaveGranulesAlert('invalidCycle')
            if (!validPass) setSaveGranulesAlert('invalidPass')
            if (!validScene) setSaveGranulesAlert('invalidScene')
            handleSaveResults.push({result: 'first step'})
          } 
          else {
            const granulesToAdd: allProductParameters[] = []
            let someGranulesAlreadyAdded = false
            let cyclePassSceneSearchParams = searchParams.get('cyclePassScene') ? String(searchParams.get('cyclePassScene')) : ''
            const sceneArray = getScenesArray(sceneToUse)
            let validScenesThatCouldNotBeAdded: string[] = []
            // check scenes availability
            if(saveType !== 'spatialSearch') {
    
            }
            const validationResult = await validateSceneAvailability(parseInt(cycleToUse), parseInt(passToUse), sceneArray.map(sceneValue => parseInt(sceneValue)), saveType).then(sceneValidityResults => {
              // return response
              setWaitingForScenesToBeAdded(false)
    
              const sceneValidityList = Object.entries(sceneValidityResults).map(validityObject => validityObject[1].valid)
              const someScenesNotAvailable = sceneValidityList.some(sceneObjectValidityEntry => {
                return !sceneObjectValidityEntry
              })
    
              const allScenesNotAvailable = sceneValidityList.every(sceneObjectValidityEntry => {
                return !sceneObjectValidityEntry
              })
    
              // TODO: make alert more verbose if some granules are added and others are not when adding more than one with scene hyphen
              sceneArray.filter(sceneNumber => sceneValidityResults[`${cycleToUse}_${passToUse}_${sceneNumber}`].valid).forEach(async sceneId => {
                if ((granulesToAdd.length + addedProducts.length) >= granuleTableLimit) {
                  validScenesThatCouldNotBeAdded.push(sceneId)
                  setSaveGranulesAlert('granuleLimit')
                } else {
                  // check if granule exists with that scene, cycle, and pass
                  const comboAlreadyAdded = alreadyAddedCyclePassScene(cycleToUse, passToUse, sceneId)
                  const cyclePassSceneInBounds = checkInBounds('cycle', cycleToUse) && checkInBounds('pass', passToUse) && checkInBounds('scene', sceneId)
                  if (cyclePassSceneInBounds && !comboAlreadyAdded) {
                    const granuleId = `${cycleToUse}_${passToUse}_${sceneId}`
                    const footprint = sceneValidityResults[granuleId].polygons as LatLngExpression[]
                    const timeStart = sceneValidityResults[granuleId].timeStart as Date
                    const timeEnd = sceneValidityResults[granuleId].timeEnd as Date
                    const producerGranuleId = sceneValidityResults[granuleId].producerGranuleId as string
                    const utmZone = producerGranuleId.substring(producerGranuleId.indexOf('_UTM') + 4, producerGranuleId.indexOf('_N') - 1)

                    // get the granuleId from it and pass it to the parameters
                    const parameters: allProductParameters = {
                      granuleId,
                      name: '',
                      cycle: cycleToUse,
                      pass: passToUse,
                      scene: sceneId,
                      outputGranuleExtentFlag: parameterOptionValues.outputGranuleExtentFlag.default as number,
                      outputSamplingGridType: parameterOptionValues.outputSamplingGridType.default as string,
                      rasterResolution: parameterOptionValues.rasterResolutionUTM.default as number,
                      utmZoneAdjust: parameterOptionValues.utmZoneAdjust.default as string,
                      mgrsBandAdjust: parameterOptionValues.mgrsBandAdjust.default as string,
                      timeStart,
                      timeEnd,
                      producerGranuleId,
                      footprint,
                      utmZone
                    }
                    // add cycle/pass/scene to url parameters
                    if (!searchParamSceneComboAlreadyInUrl(cyclePassSceneSearchParams, cycleToUse, passToUse, sceneId)) {
                      cyclePassSceneSearchParams += `${cyclePassSceneSearchParams.length === 0 ? '' : '-'}${cycleToUse}_${passToUse}_${sceneId}`
                    }
                    granulesToAdd.push(parameters)
                  } else if (comboAlreadyAdded) {
                    someGranulesAlreadyAdded = true
                  }
                }
              })
              if (saveType !== 'spatialSearch' && saveType !== 'urlParameter') {
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
              }
              return granulesToAdd
            }).then(async granulesToAdd => {
              if (granulesToAdd.length > 0) {
                // don't run time range check if granule was manually entered
                if (saveType === 'manual' || saveType === 'urlParameter') {
                  addSearchParamToCurrentUrlState({'cyclePassScene': cyclePassSceneSearchParams})
                  if (saveType !== 'urlParameter' || startTutorial) {
                    if (validScenesThatCouldNotBeAdded.length > 0) {
                      setSaveGranulesAlert('someSuccess')
                    } else {
                      setSaveGranulesAlert('success')
                    }
                  }
                  dispatch(addProduct(granulesToAdd))
                } else {
                  const productsInTimeRange: allProductParameters[] = []
                  const productsNotInTimeRange:allProductParameters[] = []
                  granulesToAdd.forEach(product => {
                    const granuleInTimeRangeResult = granuleInTimeRange(product.timeStart, product.timeEnd)
                    if (granuleInTimeRangeResult){
                      delete product.inTimeRange
                      productsInTimeRange.push(product)
                    } else if (!granuleInTimeRangeResult) {
                      delete product.inTimeRange
                      productsNotInTimeRange.push(product)  
                    }
                  })
                  if (productsInTimeRange.length > 0) {
                    setSaveGranulesAlert('success')
                    dispatch(addProduct(productsInTimeRange))
                  }
                  if (productsNotInTimeRange.length > 0) {
                    // set alerts for not in range
                    setSaveGranulesAlert('notInTimeRange')
                  }
                }
                return {result: 'found something', savedScenes: granulesToAdd}
              } else {
                if (index+1 === totalRuns){
                  return {result: 'noScenesFound'}
                } else {
                  return {result: 'not applicable'}
                }
              }
            })
            handleSaveResults.push(validationResult)
          }

      }
      return handleSaveResults
    }
  
    return getSaveResults()
    
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
    <div style={{backgroundColor: '#2C415C', marginTop: '10px', marginBottom: '20px'}} className='g-0 shadow' id={tableType === 'granuleSelection' ? 'added-scenes' : 'scenes-to-customize'}>
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
              const { cycle, pass, scene, granuleId, footprint} = productParameterObject
              const essentialsGranule = {granuleId, cycle, pass, scene}
              return (
              <tr className={`${colorModeClass}-table hoverable-row`} key={`${granuleId}-${index}`} onClick={() => {if (footprint.length !== 0) dispatch(setGranuleFocus(granuleId))}}>
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
                    <Button disabled={selectedGranules.length === 0} style={{width: '70px'}} variant='danger' onClick={() =>  dispatch(setShowDeleteProductModalTrue())} id='remove-granules-button'>
                        <Trash color="white" size={18}/>
                    </Button>
                  </td>
                  <td><Form.Control value={cycle} required id="add-product-cycle" placeholder="cycle_id" onChange={event => {
                    setCycle(event.target.value)
                    }}/></td>
                  <td><Form.Control value={pass} required id="add-product-pass" placeholder="pass_id" onChange={event => setPass(event.target.value)}/></td>
                  <td><Form.Control value={scene} required id="add-product-scene" placeholder="scene_id" onChange={event => setScene(event.target.value)}/></td>
                </tr>
                <tr className='add-granules'>
                  <td>Valid Values: {renderInfoIcon('validCPSValues')}</td>
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
      {tableType === 'granuleSelection' ? (
        <>
          <Row style={{marginTop: '5px', marginBottom: '5px'}}><Col>To add multiple scenes at once, enter two numbers into the scene input field separated by a hyphen (e.g. 1-10)</Col></Row>
          <Row><Col>
            <Alert variant='warning'>Only <b>scientific orbit</b> cycle, pass, scene values are supported at this time.</Alert>
          </Col></Row>
          <Row>
            <Col style={{marginTop: '10px'}}>
              {waitingForScenesToBeAdded || waitingForSpatialSearch ? 
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner> : 
                <Button variant='primary' size='sm' disabled={addedProducts.length >= granuleTableLimit || (cycle === '' || pass === '' || scene === '') || !userHasCorrectEdlPermissions} onClick={() => handleSave('manual', 1, 1)}>
                  <Plus size={28}/> Add Scenes
                </Button>
              }
            </Col>
          </Row>
          <Row style={{marginTop: '5px', marginBottom: '5px'}}><Col>{`${addedProducts.length}/${granuleTableLimit} scenes added`} {renderInfoIcon('granuleTableLimit')}</Col></Row>
          </>
        ) : null
      }
      <DeleteGranulesModal />
      </div>
    </div>
  );
}

export default GranuleTable;