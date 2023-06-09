import { MapContainer, Polygon, TileLayer, Tooltip, ZoomControl, useMap } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { useAppSelector } from '../../redux/hooks'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useState } from 'react';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  const granuleFocus = useAppSelector((state) => state.product.granuleFocus)
  const [previousGranuleFocus, setPreviousGranuleFocus] = useState(granuleFocus)

  const ChangeView = () => {
    const map = useMap();
    if (previousGranuleFocus !== granuleFocus) {
      map.setView(granuleFocus, 8);
      setPreviousGranuleFocus(granuleFocus)
    }
    return null
  }
  
  return (
    <MapContainer className='Map-container' center={[33.854457, -118.709093]} zoom={7} scrollWheelZoom={true} zoomControl={false}>
        <TileLayer
          url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
          attribution="&copy; NASA Blue Marble, image service by OpenGeo"
          maxNativeZoom={8}
        />
        <ChangeView />
        <ZoomControl position='bottomright'/>
        {addedProducts.map(productObject => (
        <Polygon positions={productObject.footprint as LatLngExpression[]}>
          <Tooltip sticky>{productObject.granuleId}</Tooltip>
        </Polygon>
        ))}
    </MapContainer>
  );
}

export default Map;