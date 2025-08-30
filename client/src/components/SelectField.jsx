import React from 'react';

const SelectField = ({ label, name, value, onChange, options, placeholder }) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">{label}</label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 p-2 text-gray-900"
      >
        {placeholder ? <option value="" disabled>{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;


