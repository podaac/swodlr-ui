import {Container} from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet/lib'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

function Map() {
  return (
        <MapContainer style={{height: '100%'}} center={[33.854457, -118.709093]} zoom={11} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
  );
}

export default Map;