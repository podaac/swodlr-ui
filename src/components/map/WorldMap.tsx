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
    currentSearchParams.center = `${center[0]}_${center[1]}`
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
  const dispatch = useAppDispatch()
  const footprintStyleOptions = { color: 'limegreen' }
    // search parameters
    const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    // if center and zoom are in url params, set the current center to them
    const center = searchParams.get('center')
    const zoom = searchParams.get('zoom')
    if (center && zoom) {
      const centerParamSplit = center.split('_')
      const centerToUse: number[] = [parseFloat(centerParamSplit[0]), parseFloat(centerParamSplit[1])]
      const zoomToUse = parseInt(zoom)
      if (centerToUse !== mapFocus.center || zoomToUse !== mapFocus.zoom) {
        dispatch(setMapFocus({center: centerToUse, zoom: zoomToUse}))
      }
    }
    
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
        let polygonString = '&polygon[]='
        polygonCoordinates.forEach((lngLatPair, index) => {
          polygonString += `${index === 0 ? '' : ',' }${lngLatPair[0]},${lngLatPair[1]}`
        })
        return polygonString
      }).join()
      const spatialSearchUrl = `https://cmr.earthdata.nasa.gov/search/granules?collection_concept_id=${spatialSearchCollectionConceptId}${polygonUrlString}&page_size=${spatialSearchResultLimit}`
      const spatialSearchResponse = await fetch(spatialSearchUrl, {
        method: 'GET',
        credentials: 'omit',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then(async data => {
        const responseText = await data.text()
        // TODO: make subsequent calls to get granules in spatial search area till everything is found.
        // current issue is that 1000 (2000 total divided by 2) is limited by the cmr api.
        // const responseHeaders = data.headers
        const parser = new DOMParser();
        const xml = parser.parseFromString(responseText, "application/xml");
        const references: SpatialSearchResult[] = Array.from(new Set(Array.from(xml.getElementsByTagName("name")).map(nameElement => {
          return (nameElement.textContent)?.match(`${beforeCPS}([0-9]+(_[0-9]+)+)(${afterCPSR}|${afterCPSL})`)?.[1]
        }))).map(foundIdString => {
          const cyclePassSceneStringArray = foundIdString?.split('_').map(id => parseInt(id).toString())
          const tileValue = parseInt(cyclePassSceneStringArray?.[2] as string)
          const sceneToUse = String(Math.floor(tileValue))
          return {cycle: cyclePassSceneStringArray?.[0], pass: cyclePassSceneStringArray?.[1], scene : sceneToUse} as SpatialSearchResult
        })
        return references
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
      await getScenesWithinCoordinates([createEvent.layer.getLatLngs()[0]])
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
          {useLocation().pathname.includes('selectScenes') ? (
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
            <Tooltip>{[<h6 key={`footprint-cycle-tooltip-${index}`}>{`Cycle: ${productObject.cycle}`}</h6>, <h6 key={`footprint-pass-tooltip-${index}`}>{`Pass: ${productObject.pass}`}</h6>, <h6 key={`footprint-scene-tooltip-${index}`}>{`Scene: ${productObject.scene}`}</h6>]}</Tooltip>
          </Polygon>
          ))}
      </MapContainer>
    </Row>
  );
}

export default WorldMap;