import React from 'react';

const SubmitButton = ({ label }) => {
  return (
    <div className="col-span-1 md:col-span-2 mt-4">
      <button
        type="submit"
        className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-lg text-lg font-bold rounded-full text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 transform hover:scale-105"
      >
        {label}
      </button>
    </div>
  );
};

export default SubmitButton;


