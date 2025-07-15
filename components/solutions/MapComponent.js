import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ events }) => {
  return (
    <div className="h-96">
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map(event => (
          <Marker key={event.id} position={[event.latitude, event.longitude]}>
            <Popup>
              <div>
                <h3 className="font-bold">{event.title}</h3>
                <p>{event.description}</p>
                <a href={`/events/${event.id}`} className="text-blue-500 hover:underline">View Details</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;