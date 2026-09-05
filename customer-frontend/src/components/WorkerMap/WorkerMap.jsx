import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import './WorkerMap.css';

const mapContainerStyle = {
  width: '100%',
  height: '450px',
};

const defaultCenter = {
  lat: 30.9010,
  lng: 75.8573,
};

export default function WorkerMap({
  workers = [],
  customerLocation = null,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return (
      <div className="map-error">
        Unable to load Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-loading">
        Loading map...
      </div>
    );
  }

  const center = customerLocation || defaultCenter;

  return (
    <div className="worker-map">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
      >

        {/* Customer */}
        {customerLocation && (
          <MarkerF
            position={customerLocation}
            title="Your location"
          />
        )}

        {/* Workers */}
        {workers.map((worker) => {

          const latitude = Number(worker.latitude);
          const longitude = Number(worker.longitude);

          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
          ) {
            return null;
          }

          return (
            <MarkerF
              key={worker.id}
              position={{
                lat: latitude,
                lng: longitude,
              }}
              title={worker.name || 'Worker'}
            />
          );
        })}

      </GoogleMap>
    </div>
  );
}
