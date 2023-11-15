import { MapContainer, Polygon, TileLayer, Tooltip, ZoomControl, useMap, FeatureGroup } from 'react-leaflet'
import L, { DrawEvents, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { useAppSelector } from '../../redux/hooks'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Row } from 'react-bootstrap';
import { EditControl } from 'react-leaflet-draw'
import { useState } from 'react';
import { Session } from '../../authentication/session';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

const WorldMap = () => {
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  const granuleFocus = useAppSelector((state) => state.product.granuleFocus)

  const ChangeView = () => {
    const map = useMap();
    map.setView(granuleFocus as LatLngExpression, 8);
    return null
  }

  const getScenesWithinCoordinates = async (coordinatesToSearch: number[][]) => {
    try {
      const session = await Session.getCurrent();
      if (session === null) {
        throw new Error('No current session');
      }
    
      const authToken = await session.getAccessToken();
      if (authToken === null) {
        throw new Error('Failed to get authentication token');
      }
      
      await fetch('https://cmr.earthdata.nasa.gov/search/granules?collection_concept_id=C1234567-PODAAC&polygon[]=10,10,30,10,30,20,10,20,10,10', {
        method: 'GET',
        credentials: 'omit',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then(response => response.text()).then(str => console.log(str))
      return [1,2,3]
    } catch (err) {
      console.log (err)
      if (err instanceof Error) {
          return err
        } else {
          return 'something happened'
        }
    }
  }


  const onCreate = async (createEvent: any) => {
    const { layerType, layer } = createEvent
    // if (layerType === 'polygon') {
      const {_leaflet_id} = layer
      const coordinatesToSearch = layer.getLatLngs()[0]
      // dispatch to redux store
      console.log(layer.getLatLngs()[0])
      const scenesResult = await getScenesWithinCoordinates([coordinatesToSearch])
    // }
  }

  const onEdit = (editEvent: any) => {
    const coordinatesToSearch = Object.entries(editEvent.layers._layers).map((newLayer: [string, any]) => newLayer[1].editing.latlngs[0][0])
    // dispatch to redux store
    console.log(coordinatesToSearch)
  }

  // const onDelete = (deleteEvent: any) => {
  //   console.log(deleteEvent)
  //   const coordinatesToSearch = Object.entries(deleteEvent.layers._layers).map((newLayer: [string, any]) => newLayer[1].editing.latlngs[0][0])
  // }

  return (
    <Row style={{height: '100%', paddingTop: '70px', paddingBottom: '0px', marginRight: '0%'}}>
      <MapContainer className='Map-container' center={[33.854457, -118.709093]} zoom={7} scrollWheelZoom={true} zoomControl={false}>
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
          <TileLayer
            url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
            attribution="&copy; NASA Blue Marble, image service by OpenGeo"
            maxNativeZoom={8}
          />
          <ChangeView />
          <ZoomControl position='bottomright'/>
          {addedProducts.map((productObject, index) => (
          <Polygon key={`product-on-map-${index}`} positions={productObject.footprint as LatLngExpression[]}>
            <Tooltip sticky>{productObject.granuleId}</Tooltip>
          </Polygon>
          ))}
      </MapContainer>
    </Row>
  );
}

export default WorldMap;