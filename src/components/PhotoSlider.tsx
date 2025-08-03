import { useState, useCallback, useMemo, memo } from 'react';

interface PhotoSliderProps {
  images: string[];
  alt?: string;
  className?: string;
  showDots?: boolean;
  showNav?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const PhotoSlider = memo(({
  images,
  alt = 'Photo slider',
  className = '',
  showDots = true,
  showNav = true,
  autoPlay = false,
  autoPlayInterval = 5000
}: PhotoSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useMemo(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextSlide, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className={`photo-slider bg-gray-200 rounded-2xl flex items-center justify-center h-64 ${className}`}>
        <div className="text-gray-500 text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Нет изображений</p>
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`photo-slider ${className}`}>
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
    );
  }

  return (
    <div className={`photo-slider ${className}`}>
      <div className="relative h-64 md:h-80 lg:h-96">
        {/* Main Image */}
        <div className="relative h-full overflow-hidden rounded-2xl">
          <img
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
          />
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          {/* Image counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Navigation arrows */}
        {showNav && (
          <>
            <button
              onClick={prevSlide}
              className="photo-slider-nav prev"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="photo-slider-nav next"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots indicator */}
        {showDots && images.length > 1 && (
          <div className="photo-slider-dots">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`photo-slider-dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex 
                      ? 'border-white scale-110' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

PhotoSlider.displayName = 'PhotoSlider';

export default PhotoSlider;