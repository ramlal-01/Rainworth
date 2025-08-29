import React from 'react';

const OpenSpaceInputs = ({ label, lengthPlaceholder, breadthPlaceholder, lengthValue, breadthValue, onLengthChange, onBreadthChange }) => {
  return (
    <div className="col-span-1 md:col-span-2 space-y-1">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="number"
          name="openSpaceLength"
          value={lengthValue}
          onChange={onLengthChange}
          placeholder={lengthPlaceholder}
          className="flex-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 p-2"
        />
        <input
          type="number"
          name="openSpaceBreadth"
          value={breadthValue}
          onChange={onBreadthChange}
          placeholder={breadthPlaceholder}
          className="flex-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 p-2"
        />
      </div>
    </div>
  );
};

export default OpenSpaceInputs;


