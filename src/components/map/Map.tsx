import { MapContainer, Polygon, TileLayer, Tooltip, ZoomControl } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { useAppSelector } from '../../redux/hooks'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  
  return (
    <MapContainer className='Map-container' center={[33.854457, -118.709093]} zoom={7} scrollWheelZoom={true} zoomControl={false}>
        <TileLayer
          url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
          attribution="&copy; NASA Blue Marble, image service by OpenGeo"
          maxNativeZoom={8}
        />
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