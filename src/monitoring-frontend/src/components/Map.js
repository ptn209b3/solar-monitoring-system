/* eslint-disable */

import styles from "./Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { useState, useEffect, useRef } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken =
  "pk.eyJ1IjoidGhhaWhvYTE0MDgiLCJhIjoiY2ttZnRneGN6MjFpbjJ1cWxvbWwwY2ZvYiJ9.M3hPbCBUOUpgUdxjryYI0g";

function Map({ longtitude = 106.6584306, latitude = 10.7733743 }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(longtitude.toFixed(4));
  const [lat, setLat] = useState(latitude.toFixed(4));
  const [zoom, setZoom] = useState((15).toFixed(2));

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      const center = map.current.getCenter();
      setLng(center.lng.toFixed(4));
      setLat(center.lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

  useEffect(() => {
    setLng(longtitude.toFixed(4));
    setLat(latitude.toFixed(4));
  }, [longtitude, latitude]);

  return (
    <div className={styles.root}>
      <div ref={mapContainer} className={styles.container} />
      {/* <div className={styles.bar}>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
    </div>
  );
}

export default Map;
