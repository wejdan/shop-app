import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import Loader from "../UI/Loader";
import Button from "../UI/Button";
import toast from "react-hot-toast";
import { reverseGeocode } from "../../services/addresses";

const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ClickableMap = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });

  return null;
};

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (!isNaN(center.lat) && !isNaN(center.lng)) {
      map.setView(center, map.getZoom());
    }
  }, [center]);
  return null;
}

const MyMap = ({ address, setAddress, location, setLocation }) => {
  const [loading, setLoading] = useState(false);

  const markerRef = useRef(null);
  useEffect(() => {
    // Ensure reverseGeocode is not called when location is {lat: 0, lng: 0}
    if (location.lat !== 0 || location.lng !== 0) {
      reverseGeocode(location)
        .then(setAddress)
        .catch((error) => {
          console.error("Error during reverse geocoding:", error);
          toast.error("Could not fetch address.");
        });
    }
  }, [location]);
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [location, address]);
  const getCurrentLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        toast.dismiss();
        console.error("Error fetching location: ", error);
        toast.error("Error fetching location. Please try again.");
      }
    );
  };

  const handleMapClick = (latlng) => {
    setLocation(latlng);
  };

  return (
    <div style={{ position: "relative", height: "300px", width: "600px" }}>
      <Button
        type="button"
        isLoading={loading}
        style={{
          position: "absolute",
          zIndex: 1000,
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        onClick={getCurrentLocation}
      >
        {loading ? "Getting Your Location..." : "Get Current Location"}
      </Button>
      <MapContainer
        center={location}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={location} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <ClickableMap onMapClick={handleMapClick} />
        {location.lat !== 0 && location.lng !== 0 && (
          <Marker ref={markerRef} icon={customIcon} position={location}>
            <Popup ref={markerRef}>{address || "Fetching address..."}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MyMap;
