/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
"use client";

//Map component Component from library
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useContext, useEffect, useState } from "react";
import { useProfile } from "../providers/profileProvider";
import { io } from "socket.io-client";
import axios from "axios";
import { useProblem } from "../providers/problemProvider";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_WEBSOCKET_URL);

//Map's styling
const defaultMapContainerStyle = {
  width: "80%",
  height: "800px",
  borderRadius: "12px",
  overflow: "hidden",
};

//Default zoom level, can be adjusted
const defaultMapZoom = 18;

//Map options
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "roadmap",
};

export const RealtimeMapComponent = () => {
  const { problem } = useProblem();
  const { profile, location, setLocation, currentAddress, setCurrentAddress } =
    useProfile();
  const [mapCenter, setMapCenter] = useState({
    lat: 35.8799866,
    lng: 76.5048004,
  });

  const [currentLocation, setCurrentLocation] = useState({
    lat: 35.8799866,
    lng: 76.5048004,
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((e) => {
      setMapCenter({
        lat: e.coords.latitude,
        lng: e.coords.longitude,
      });
      setCurrentLocation({
        lat: e.coords.latitude,
        lng: e.coords.longitude,
      });
    });
  }, []);

  console.log("Current Location:", currentLocation);
  // Setup socket connection
  useEffect(() => {
    // On component mount, establish the WebSocket connection
    socket.on("connect", () => {
      console.log("Frontend message : Connected to server with ID:", socket.id);
    });

    socket.on("problem", async (data) => {
      try {
        const response = await axios.get("");
      } catch (error) {
        console.log("Could not fetch the nearby problems.");
      }
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
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

  const markerIcon = {
    url: "/gps.svg",
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 40),
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
          position={{
            lat: currentLocation.lat,
            lng: currentLocation.lng,
          }}
          draggable
          onDragEnd={handleMarkerDragEnd}
          icon={markerIcon}
        />
      </GoogleMap>
    </div>
  );
};
