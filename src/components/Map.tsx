import { useEffect, useRef } from 'react';

interface MapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

const Map: React.FC<MapProps> = ({ latitude, longitude, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map here
    // This is a placeholder for actual map implementation
    console.log(`Map initialized at ${latitude}, ${longitude}`);
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-64 bg-gray-200 rounded-lg ${className}`}
    >
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p>Карта</p>
          <p className="text-sm">Координаты: {latitude}, {longitude}</p>
        </div>
      </div>
    </div>
  );
};

export default Map;