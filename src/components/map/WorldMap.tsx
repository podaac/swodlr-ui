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
import { useLocation } from 'react-router-dom';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

function UpdateMapCenter() {
  const dispatch = useAppDispatch()
  const mapFocus = useAppSelector((state) => state.product.mapFocus)

  const map = useMapEvent('moveend', () => {
    const center = [map.getCenter().lat, map.getCenter().lng]
    const zoom = map.getZoom()
    if ((mapFocus.center[0] !== center[0] && mapFocus.center[1] !== center[1]) || mapFocus.zoom !== zoom) dispatch(setMapFocus({center, zoom}))
  })
  return null
}

const WorldMap = () => {
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  const mapFocus = useAppSelector((state) => state.product.mapFocus)
  const dispatch = useAppDispatch()
  const footprintStyleOptions = { color: 'limegreen' }

  const ChangeView = () => {
    const map = useMap()
    map.setView(mapFocus.center as LatLngExpression, mapFocus.zoom)
    return null
  }

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
      }).then(response => response.text()).then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");
        const references: SpatialSearchResult[] = Array.from(new Set(Array.from(xml.getElementsByTagName("name")).map(nameElement => {
          return (nameElement.textContent)?.match(`${beforeCPS}([0-9]+(_[0-9]+)+)(${afterCPSR}|${afterCPSL})`)?.[1]
        }))).map(foundIdString => {
          const cyclePassSceneStringArray = foundIdString?.split('_').map(id => parseInt(id).toString())
          const tileValue = parseInt(cyclePassSceneStringArray?.[2] as string)
          // const sceneToUse = String(Math.floor(tileValue / 2))
          const sceneToUse = String(Math.floor(tileValue))
          return {cycle: cyclePassSceneStringArray?.[0], pass: cyclePassSceneStringArray?.[1], scene : sceneToUse} as SpatialSearchResult
        })
        return references
      })
      dispatch(addSpatialSearchResults(spatialSearchResponse as SpatialSearchResult[]))
      dispatch(setWaitingForSpatialSearch(false))
    } catch (err) {
      dispatch(setWaitingForSpatialSearch(false))
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
                // onDeleted={(deleteEvent) => onDelete(deleteEvent)} 
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
          />
          <UpdateMapCenter />
          <ChangeView />
          <ZoomControl position='bottomright'/>
          {addedProducts.map((productObject, index) => (
          <Polygon key={`product-on-map-${index}`} positions={productObject.footprint as LatLngExpression[]} pathOptions={footprintStyleOptions}>
            <Tooltip sticky>{[<h6 key={`footprint-cycle-tooltip-${index}`}>{`Cycle: ${productObject.cycle}`}</h6>, <h6 key={`footprint-pass-tooltip-${index}`}>{`Pass: ${productObject.pass}`}</h6>, <h6 key={`footprint-scene-tooltip-${index}`}>{`Scene: ${productObject.scene}`}</h6>]}</Tooltip>
          </Polygon>
          ))}
      </MapContainer>
    </Row>
  );
}

export default WorldMap;