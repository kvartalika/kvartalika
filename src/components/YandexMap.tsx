import { useEffect, useRef, useState } from "react";

interface MapProps {
  latitude: number;
  longitude: number;
  description: string;
}

const useYmaps = () => {
  const [ymaps, setYmaps] = useState<any>(null);

  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => setYmaps(window.ymaps));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    script.onload = () => {
      window.ymaps.ready(() => setYmaps(window.ymaps));
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return ymaps;
};

const YandexMap = ({ latitude, longitude, description }: MapProps) => {
  const ymaps = useYmaps();
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!ymaps || mapRef.current) return;

    mapRef.current = new ymaps.Map("map", {
      center: [latitude, longitude],
      zoom: 9,
    });

    const placemark = new ymaps.Placemark(
      [latitude, longitude],
      { balloonContent: description },
      { preset: "islands#icon", iconColor: "#374151" }
    );

    mapRef.current.geoObjects.add(placemark);

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [ymaps]);

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default YandexMap;
