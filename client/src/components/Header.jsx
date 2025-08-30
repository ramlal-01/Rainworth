import React from 'react';
import { GlobeAltIcon, HomeIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const Header = ({ title, homeLabel, isEnglish, onToggleLanguage }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-white shadow-md rounded-lg mb-6">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <div className="w-12 h-12 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-cyan-500">
            <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6.309L9.278 10.38a.75.75 0 00-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l3.25-3.25a.75.75 0 10-1.06-1.06l-1.97-1.97V6z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative inline-block text-left">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex justify-center items-center rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200 shadow-sm"
          >
            <GlobeAltIcon className="h-5 w-5 mr-2 text-white" />
            {isEnglish ? 'English' : 'हिंदी'}
          </button>
        </div>

        <Link
          to="/"
          className="inline-flex justify-center items-center rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 text-gray-700"
        >
          <HomeIcon className="h-5 w-5 mr-2 text-gray-500" />
          {homeLabel}
        </Link>
      </div>
    </header>
  );
};

export default Header;


