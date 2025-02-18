"use client";


import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { restaurantQuery } from "./components/query";
import Header from "./components/Header";

import Restaurants from "./components/RestaurantList";
import ExploreCountries from "./components/ExploreCountries";
import "leaflet/dist/leaflet.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "tailwindcss/tailwind.css";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [userLocation, setUserLocation] = useState("");
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [countries, setCountries] = useState([
    { name: "Cyprus", code: "CY" },
    { name: "Georgia", code: "GE" },
    { name: "Estonia", code: "EE" },
    { name: "Germany", code: "DE" },
    { name: "Denmark", code: "DK" },
    { name: "Greece", code: "GR" },

  ]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [getRestaurants, { data, loading, error }] = useLazyQuery(restaurantQuery);

  const getlocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          await reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Location access denied. Please enable location permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleFindRestaurants = () => {
    if (!position) return;

    const [lat, lon] = position;
    getRestaurants({
      variables: { latitude: lat, longitude: lon },
    });
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      const displayName = data.display_name || "Location not found";
      setUserLocation(displayName);
      setInputValue(displayName); // Update the text input field

      const city =
        data.address.city ||
        data.address.state ||
        data.address.town ||
        data.address.village ||
        data.address.hamlet ||
        "";

      if (city) {
      
        
        const existing = countries.find(
          (c) => c.name.toLowerCase() === city.toLowerCase()
        );
        if (!existing) {
          const newCity = { name: city, code: "custom" };
          setCountries((prev) => [...prev, newCity]);
          setSelectedCountry(newCity);
        } else {
          setSelectedCountry(existing);
        }
      }
    } catch (error) {
      console.error("Error fetching address: ", error);
    }
  };

  const handleLocationChange = async (selected: any) => {
    setSelectedCountry(selected);
    setInputValue(selected.name); // Update the text input field
    await fetchCoordinates(selected.name);
  };

  const fetchCoordinates = async (placeName: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${placeName}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setUserLocation(display_name);
      } else {
        console.error("Coordinates not found");
      }
    } catch (error) {
      console.error("Error fetching coordinates: ", error);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 2) {
      await fetchAutocompleteSuggestions(value);
    } else {
      setAutocompleteSuggestions([]);
    }
  };

  const fetchAutocompleteSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setAutocompleteSuggestions(data);
    } catch (error) {
      console.error("Error fetching autocomplete suggestions: ", error);
    }
  };

  const handleSuggestionClick = async (suggestion: any) => {
    setInputValue(suggestion.display_name);
    setAutocompleteSuggestions([]);
    setPosition([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    setUserLocation(suggestion.display_name);

    // Update the dropdown with the selected location
    const city =
      suggestion.address.city ||
      suggestion.address.state ||
      suggestion.address.town ||
      suggestion.address.village ||
      suggestion.address.hamlet ||
      "";

    if (city) {
      const existing = countries.find(
        (c) => c.name.toLowerCase() === city.toLowerCase()
      );
      if (!existing) {
        const newCity = { name: city, code: "custom" };
        setCountries((prev) => [...prev, newCity]);
        setSelectedCountry(newCity);
      } else {
        setSelectedCountry(existing);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="relative z-10 p-4">
        <Header
          selectedCountry={selectedCountry}
          countries={countries}
          handleLocationChange={handleLocationChange}
        />
        <Map
          position={position}
          inputValue={inputValue}
          autocompleteSuggestions={autocompleteSuggestions}
          handleInputChange={handleInputChange}
          handleSuggestionClick={handleSuggestionClick}
          getlocation={getlocation}
          handleFindRestaurants={handleFindRestaurants}
        />
        <Restaurants data={data} />
        <ExploreCountries
          countries={countries}
          handleLocationChange={handleLocationChange}
        />
      </div>
    </div>
  );
}