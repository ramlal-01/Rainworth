import React from 'react';

const LocationInput = ({ label, placeholder, value, onChange, onUseCurrent, currentLocationLabel }) => {
  return (
    <div className="col-span-1 md:col-span-2">
      <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="flex rounded-lg shadow-sm">
        <input
          type="text"
          name="location"
          id="location"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 block w-full rounded-l-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 text-gray-900"
        />
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 rounded-r-lg border border-transparent shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          onClick={onUseCurrent}
        >
          {currentLocationLabel}
        </button>
      </div>
    </div>
  );
};

export default LocationInput;


