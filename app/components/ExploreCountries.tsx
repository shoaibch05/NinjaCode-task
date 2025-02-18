import React from "react";

interface ExploreCountriesProps {
  countries: any[];
  handleLocationChange: (selected: any) => void;
}

const ExploreCountries: React.FC<ExploreCountriesProps> = ({
  countries,
  handleLocationChange,
}) => {
  return (
    <div className="mt-16 px-4">
      <h2 className="text-xl font-bold mb-4">Explore Countries</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {countries.map((country, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white p-3 shadow-md rounded-md cursor-pointer hover:bg-gray-100"
            onClick={() => handleLocationChange(country)}
          >
            <span>{country.name}</span>
            <span className="text-gray-500">&gt;</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreCountries;