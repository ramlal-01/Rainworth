import React from 'react';

const NumberInput = ({ label, name, value, onChange }) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type="number"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 p-2"
      />
    </div>
  );
};

export default NumberInput;


