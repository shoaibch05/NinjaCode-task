import React from "react";
import { Dropdown } from "primereact/dropdown";
import Image from "next/image";

interface HeaderProps {
  selectedCountry: any;
  countries: any[];
  handleLocationChange: (selected: any) => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedCountry,
  countries,
  handleLocationChange,
}) => {
  return (
    <div className="flex flex-wrap text-center  items-center justify-center md:justify-between p-4 bg-white shadow-md md:flex-nowrap">
      <Image
        priority
        src="/logo.svg"
        width={200}
        height={50}
        alt="logo"
        className="text-2xl text-center"
      />
      
      <div className="w-full md:w-auto flex justify-center mt-2 md:mt-0">
        <Dropdown
          value={selectedCountry}
          onChange={(e) => handleLocationChange(e.value)}
          options={countries}
          optionLabel="name"
          className="p-inputtext-sm w-full md:w-auto"
          placeholder="Select a Country"
        />
      </div>
      
      <div className="flex  gap-2 mt-2 md:mt-0">
        <button className="border border-slate-500 font-bold py-2 px-4 rounded-full text-sm md:text-base">
          Login
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-sm md:text-base">
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Header;
