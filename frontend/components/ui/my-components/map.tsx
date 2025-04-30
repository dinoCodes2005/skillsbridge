/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
"use client";

//Map component Component from library
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useContext, useEffect, useState } from "react";
import { useProfile } from "./profileProvider";

//Map's styling
const defaultMapContainerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "12px",
  overflow: "hidden",
};

//K2's coordinates

//Default zoom level, can be adjusted
const defaultMapZoom = 18;

//Map options
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "satellite",
};

const MapComponent = () => {
  const { profile, location, setLocation, currentAddress, setCurrentAddress } =
    useProfile();
  const [mapCenter, setMapCenter] = useState({
    lat: 35.8799866,
    lng: 76.5048004,
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((e) => {
      setMapCenter({
        lat: e.coords.latitude,
        lng: e.coords.longitude,
      });
    });
  }, []);

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMapCenter({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      setLocation({
        type: "Point",
        coordinates: [e.latLng.lng(), e.latLng.lat()],
      });
    }
  };

  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={mapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      >
        <Marker
          position={mapCenter}
          draggable
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </div>
  );
};

export { MapComponent };
