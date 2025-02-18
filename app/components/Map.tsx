"use client";

import React from "react";
import { InputText } from "primereact/inputtext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  position: [number, number];
  inputValue: string;
  autocompleteSuggestions: any[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSuggestionClick: (suggestion: any) => void;
  getlocation: () => void;
  handleFindRestaurants: () => void;
}

const RecenterMap: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

const Map: React.FC<MapProps> = ({
  position,
  inputValue,
  autocompleteSuggestions,
  handleInputChange,
  handleSuggestionClick,
  getlocation,
  handleFindRestaurants,
}) => {
  return (
    <div className="h-[300px] md:h-[400px] lg:h-[400px] relative text-center">
      <div className="absolute inset-0 z-0">
        <MapContainer center={position} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>Your Selected Location</Popup>
          </Marker>
          <RecenterMap position={position} />
        </MapContainer>
      </div>
      <div className="absolute z-10 flex flex-col md:flex-row items-center bg-white rounded-lg p-2 max-w-3xl space-x-2 left-1/2 transform -translate-x-1/2 mt-4 md:mt-52 w-11/12 md:w-auto">
        <i className="pi pi-arrow-right text-gray-500 hidden md:block"></i>
        <div className="relative flex-1 w-full md:w-auto">
          <InputText
            value={inputValue}
            onChange={handleInputChange}
            className="flex-1 p-2 border-none outline-none w-full"
            placeholder="Enter a location"
          />
          {autocompleteSuggestions.length > 0 && (
            <div className="absolute z-20 bg-white w-full mt-1 border border-gray-300 rounded-lg shadow-lg">
              {autocompleteSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
        <i
          className="pi pi-map-marker text-gray-500 cursor-pointer"
          onClick={getlocation}
        ></i>
        <button
          onClick={handleFindRestaurants}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-sm md:text-base mt-2 md:mt-0 w-full md:w-auto"
        >
          Find Restaurants
        </button>
      </div>
    </div>
  );
};

export default Map;
