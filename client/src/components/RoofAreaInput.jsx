import React from 'react';

const RoofAreaInput = ({
  label,
  placeholder,
  value,
  unit,
  units,
  onAreaChange,
  onUnitChange,
  apiButtonLabel,
  onFetchFromApi
}) => {
  return (
    <div className="col-span-1 md:col-span-2">
      <label htmlFor="roofArea" className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="flex rounded-lg shadow-sm">
        <input
          type="number"
          name="roofArea"
          id="roofArea"
          value={value}
          onChange={onAreaChange}
          placeholder={placeholder}
          className="flex-1 block w-full rounded-l-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2"
        />
        <select
          name="roofAreaUnit"
          value={unit}
          onChange={onUnitChange}
          className="rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 p-2"
        >
          {units.map((u) => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
        <button
          type="button"
          className="w-full sm:w-auto px-4 py-2 border border-blue-400 bg-blue-400 text-white rounded-r-lg shadow-sm text-sm font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          onClick={onFetchFromApi}
        >
          {apiButtonLabel}
        </button>
      </div>
    </div>
  );
};

export default RoofAreaInput;


