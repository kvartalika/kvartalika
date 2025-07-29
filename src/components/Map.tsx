import React from 'react';
import './Map.css';

const Map: React.FC = () => {
    return (
        <div className="map-container">
            <div className="map-placeholder">
                <div className="map-marker">
                    <div className="marker-icon">📍</div>
                    <div className="marker-label">Квартира находится здесь</div>
                </div>
                <div className="map-content">
                    <img src="/map-placeholder.jpg" alt="Карта расположения" className="map-image" />
                </div>
            </div>
        </div>
    );
};

export default Map;