import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  latitude: number;
  longitude: number;
  description: string;
}

const DefaultIcon = new L.Icon({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Map = ({latitude, longitude, description}: MapProps) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={false}
      className="mx-auto z-10 w-full rounded-2xl shadow-lg aspect-[16/9] min-h-[250px] max-h-[400px] relative"
    >
      <div className='absolute bottom-0 right-0 bg-sky-50 z-2000 rounded-md'>
        <p className='px-16 font-bold text-lg'>@Кварталика</p>
      </div>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[latitude, longitude]}
        icon={DefaultIcon}
      >
        <Popup>
          {description}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;