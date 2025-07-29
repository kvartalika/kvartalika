import React, { useState } from 'react';
import './Gallery.css';

interface GalleryProps {
    images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="gallery">
            <div className="gallery-container">
                <img
                    src={images[currentIndex] || '/construction-placeholder.jpg'}
                    alt={`Строительство ${currentIndex + 1}`}
                    className="gallery-image"
                />
                <button
                    className="gallery-btn gallery-btn-prev"
                    onClick={prevImage}
                    aria-label="Предыдущее фото"
                >
                    ‹
                </button>
                <button
                    className="gallery-btn gallery-btn-next"
                    onClick={nextImage}
                    aria-label="Следующее фото"
                >
                    ›
                </button>
            </div>
            <div className="gallery-indicators">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`gallery-indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Фото ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Gallery;