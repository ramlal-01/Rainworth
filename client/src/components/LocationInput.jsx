import React from 'react';

const LocationInput = ({ label, placeholder, value, onChange, onUseCurrent, currentLocationLabel, isGettingLocation = false }) => {
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
          disabled={isGettingLocation}
          className={`inline-flex items-center px-4 py-2 rounded-r-lg border border-transparent shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
            isGettingLocation 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600'
          }`}
          onClick={onUseCurrent}
        >
          {isGettingLocation ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Getting Location...
            </>
          ) : (
            <>
              📍 {currentLocationLabel}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LocationInput;


