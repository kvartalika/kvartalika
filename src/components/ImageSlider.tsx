import {useState, useCallback, useEffect, type FC} from 'react';

interface ImageSliderProps {
  images: string[];
  title?: string;
  className?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  needDots?: boolean;
}

const ImageSlider: FC<ImageSliderProps> = ({
                                             images,
                                             title,
                                             className = '',
                                             showThumbnails = true,
                                             autoPlay = false,
                                             autoPlayInterval = 5000,
                                             needDots = false,
                                           }) => {
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

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextSlide, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center aspect-[4/3] ${className}`}>
        <div className="text-gray-500 text-center">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          <p>Нет изображений</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} rounded-lg overflow-hidden`}>
      {title &&
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}

      <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[4/3]">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="z-20 absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-secondary-100 p-2 rounded-full transition-all duration-200"
              aria-label="Previous slide"
              type="button"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="z-20 absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Next slide"
              type="button"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {showThumbnails && images.length > 1 && (
        <div className="z-20 mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex ? 'border-primary-500 scale-105' : 'border-gray-200 hover:border-gray-300'
              }`}
              type="button"
              aria-label={`Перейти к слайду ${index + 1}`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {needDots && !showThumbnails && images.length > 1 && (
        <div className="flex justify-center mt-3 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-primary-500 scale-110' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Слайд ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;