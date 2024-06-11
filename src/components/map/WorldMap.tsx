import { MapContainer, Polygon, TileLayer, Tooltip, ZoomControl, useMap, FeatureGroup, useMapEvent } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Row } from 'react-bootstrap';
import { EditControl } from 'react-leaflet-draw'
import { Session } from '../../authentication/session';
import { lineString } from '@turf/helpers';
import booleanClockwise from '@turf/boolean-clockwise';
import { afterCPSL, afterCPSR, beforeCPS, spatialSearchCollectionConceptId, spatialSearchResultLimit } from '../../constants/rasterParameterConstants';
import { addSpatialSearchResults, setMapFocus, setWaitingForSpatialSearch } from '../sidebar/actions/productSlice';
import { SpatialSearchResult } from '../../types/constantTypes';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getGranules, getSpatialSearchGranuleVariables } from '../../constants/graphqlQueries';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

const UpdateMapCenter = () => {
  const dispatch = useAppDispatch()
  const mapFocus = useAppSelector((state) => state.product.mapFocus)
  // search parameters
  const [searchParams, setSearchParams] = useSearchParams()

  // put the current center and zoom into the url parameters
  const handleMapFocus = (center: number[], zoom: number) => {
    const currentSearchParams = Object.fromEntries(searchParams.entries())
    currentSearchParams.center = `${center[0]},${center[1]}`
    currentSearchParams.zoom = String(zoom)
    setSearchParams(currentSearchParams)
    dispatch(setMapFocus({center, zoom}))
  }

  const map = useMapEvent('moveend', () => {
    const center = [map.getCenter().lat, map.getCenter().lng]
    const zoom = map.getZoom()
    if ((mapFocus.center[0] !== center[0] && mapFocus.center[1] !== center[1]) || mapFocus.zoom !== zoom) handleMapFocus(center, zoom)
  })
  return null
}

const ChangeView = () => {
  const mapFocus = useAppSelector((state) => state.product.mapFocus)
  const map = useMap()
  map.setView(mapFocus.center as LatLngExpression, mapFocus.zoom)
  return null
}

const WorldMap = () => {
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  const mapFocus = useAppSelector((state) => state.product.mapFocus)
  const userHasCorrectEdlPermissions = useAppSelector((state) => state.app.userHasCorrectEdlPermissions)
  const dispatch = useAppDispatch()
  const footprintStyleOptions = { color: 'limegreen' }
    // search parameters
    const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    // if center and zoom are in url params, set the current center to them
    const center = searchParams.get('center')
    const zoom = searchParams.get('zoom')
    if (center && zoom) {
      const centerParamSplit = center.split(',')
      const centerToUse: number[] = [parseFloat(centerParamSplit[0]), parseFloat(centerParamSplit[1])]
      const zoomToUse = parseInt(zoom)
      if (centerToUse !== mapFocus.center || zoomToUse !== mapFocus.zoom) {
        dispatch(setMapFocus({center: centerToUse, zoom: zoomToUse}))
      }
    }

    // TODO: implement search polygon search param
    // const searchPolygon = searchParams.get('searchPolygon')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getScenesWithinCoordinates = async (coordinatesToSearch: {lat: number, lng: number}[][]) => {
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
      dispatch(setWaitingForSpatialSearch(true))

      const polygonUrlString = coordinatesToSearch.map((polygon) => {
        let polygonCoordinates = polygon.map(({lng, lat}) => [lng, lat])
        // close the polygon
        polygonCoordinates.push(polygonCoordinates[0])

        // if coordinates to search in polygon are clockwise, switch them to counter clockwise
        const lineStringFeature = lineString(polygonCoordinates)
        const clockwise = booleanClockwise(lineStringFeature)
        if (clockwise) {
          polygonCoordinates = polygonCoordinates.reverse()
        }

        // create string with polygon array
        // let polygonString = '&polygon[]='
        let polygonString = ''
        polygonCoordinates.forEach((lngLatPair, index) => {
          polygonString += `${index === 0 ? '' : ',' }${lngLatPair[0]},${lngLatPair[1]}`
        })
        return polygonString
      }).join()

      const spatialSearchResponse = await fetch('https://graphql.earthdata.nasa.gov/api', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: getGranules, variables: getSpatialSearchGranuleVariables(polygonUrlString, spatialSearchCollectionConceptId, spatialSearchResultLimit) })
      }).then(async data => {
        const responseJson = await data.json()
        // TODO: make subsequent calls to get granules in spatial search area till everything is found.

        const updatedGranules = responseJson.data.granules.items.map((item: any) => {
          const itemCopy = structuredClone(item)
          const cpsString = item.granuleUr.match(`${beforeCPS}([0-9]+(_[0-9]+)+)(${afterCPSR}|${afterCPSL})`)?.[1]
          itemCopy.cpsString = cpsString
          return itemCopy
        })
        const cpsStringTracker: string[] = []
        const updatedGranulesToUse = updatedGranules.filter((updatedGranuleObject: any) => {
          // if cpsString not in tracker, it has not been repeated yet. Add to tracker and return
          const granuleRepeated = cpsStringTracker.includes(updatedGranuleObject.cpsString)
          if(!granuleRepeated) cpsStringTracker.push(updatedGranuleObject.cpsString)
          return !granuleRepeated
          // if cpsString in tracker, it has been repeated. Do not return
        })
        const spatialSearchResults = updatedGranulesToUse.map((updatedGranuleObject: any) => {
          const {producerGranuleId, granuleUr, cpsString, polygons, timeStart, timeEnd} = updatedGranuleObject
          // const utmZone = producerGranuleId
          const cyclePassSceneStringArray = cpsString.split('_').map((id: string) => parseInt(id).toString())
          const tileValue = parseInt(cyclePassSceneStringArray?.[2] as string)
          const sceneToUse = String(Math.floor(tileValue))
          const returnObject: SpatialSearchResult = {
            cycle: cyclePassSceneStringArray?.[0],
            pass: cyclePassSceneStringArray?.[1],
            scene : sceneToUse,
            producerGranuleId,
            granuleUr,
            timeStart,
            timeEnd,
            polygons
          }
          return returnObject
        })
        return spatialSearchResults
      })
      dispatch(addSpatialSearchResults(spatialSearchResponse as SpatialSearchResult[]))
    } catch (err) {
      if (err instanceof Error) {
          return err
        } else {
          return 'something happened'
        }
    }
  }

  const onCreate = async (createEvent: any) => {
    const searchPolygonLatLngs = createEvent.layer.getLatLngs()[0]
    
    // TODO: implement search polygon search param
    // const currentSearchParams = Object.fromEntries(searchParams.entries())
    // const searchPolygonLatLngsString = searchPolygonLatLngs.map((latLngObject: {lat: number, lng: number}) => `${latLngObject.lat},${latLngObject.lng}`).join('_')
    // currentSearchParams.searchPolygon = searchPolygonLatLngsString
    // setSearchParams(currentSearchParams)

    await getScenesWithinCoordinates([searchPolygonLatLngs])
    // set the new map focus location to what it was when polygon created so it will stay the same after map reload
    dispatch(setMapFocus({center: [createEvent.layer._renderer._center.lat, createEvent.layer._renderer._center.lng], zoom: createEvent.target._zoom}))
  }

  const onEdit = async (editEvent: any) => {
    if (Object.keys(editEvent.layers._layers).length !== 0) {
      const coordinatesToSearch = Object.entries(editEvent.layers._layers).map((newLayer: [string, any]) => newLayer[1].editing.latlngs[0][0])
      await getScenesWithinCoordinates(coordinatesToSearch)
    }
  }

  return (
    <Row style={{height: '100%', paddingTop: '70px', paddingBottom: '0px', marginRight: '0%'}}>
      <MapContainer className='Map-container' spatial-search-map
        id='spatial-search-map'  
        zoom={7} scrollWheelZoom={true} zoomControl={false} 
      >
          {(useLocation().pathname.includes('selectScenes') && userHasCorrectEdlPermissions) ? (
            <FeatureGroup>
              <EditControl 
                position="topright" 
                onCreated={(createEvent) => onCreate(createEvent)} 
                onEdited={(editEvent) => onEdit(editEvent)} 
                draw={{
                  rectangle: false,
                  polyline: false,
                  circle: false,
                  circlemarker: false,
                  marker: false
                }} 
              />
            </FeatureGroup>
            ) : null
          }
          <div style={{float:'right', width:'49%', height:'100%'}} id='map-tutorial-target'/>
          <TileLayer
            url='https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            attribution='Esri, Maxar, Earthstar Geographics, and the GIS User Community'
            maxZoom = {18}
            noWrap
            bounds={
              [
                [-89.9999, -179.9999],
                [89.9999, 179.9999]
              ]
            }
          />
          <UpdateMapCenter />
          <ChangeView />
          <ZoomControl position='bottomright'/>
          {addedProducts.map((productObject, index) => (
          <Polygon key={`product-on-map-${index}`} positions={productObject.footprint as LatLngExpression[]} pathOptions={footprintStyleOptions}>
            <Tooltip>{[<h6 key={`footprint-cycle-tooltip-${index}`}>{`Cycle: ${productObject.cycle}`}</h6>, <h6 key={`footprint-pass-tooltip-${index}`}>{`Pass: ${productObject.pass}`}</h6>, <h6 key={`footprint-scene-tooltip-${index}`}>{`Scene: ${productObject.scene}`}</h6>, <h6 key={`footprint-filename-tooltip-${index}`}>{`File Name: ${productObject.producerGranuleId}`}</h6>]}</Tooltip>
          </Polygon>
          ))}
      </MapContainer>
    </Row>
  );
}

export default WorldMap;