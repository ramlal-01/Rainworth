import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, GlobeAltIcon, HomeIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEnglish, setIsEnglish] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  const langContent = {
    en: {
      title: 'RainWorth',
      home: 'Home',
      pageTitle: 'Sign In',
      subtitle: 'Welcome back! Please sign in to your account.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      signInButton: 'Sign In',
      signingIn: 'Signing In...',
      noAccount: "Don't have an account?",
      signUpLink: 'Sign up here',
      forgotPassword: 'Forgot your password?'
    },
    hi: {
      title: 'रेनवर्थ',
      home: 'होम',
      pageTitle: 'साइन इन',
      subtitle: 'वापस स्वागत है! कृपया अपने खाते में साइन इन करें।',
      emailLabel: 'ईमेल पता',
      passwordLabel: 'पासवर्ड',
      showPassword: 'पासवर्ड दिखाएं',
      hidePassword: 'पासवर्ड छुपाएं',
      signInButton: 'साइन इन',
      signingIn: 'साइन इन हो रहा है...',
      noAccount: 'कोई खाता नहीं है?',
      signUpLink: 'यहाँ साइन अप करें',
      forgotPassword: 'अपना पासवर्ड भूल गए?'
    }
  };

  const content = isEnglish ? langContent.en : langContent.hi;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Use auth context to login
      login(data.token, data.user);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-white shadow-md rounded-lg mb-6 mx-6 mt-6">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-cyan-500">
              <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6.309L9.278 10.38a.75.75 0 00-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l3.25-3.25a.75.75 0 10-1.06-1.06l-1.97-1.97V6z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">
            {content.title}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={toggleLanguage}
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
            {content.home}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {content.pageTitle}
              </h2>
              <p className="text-gray-600">
                {content.subtitle}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {content.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {content.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    title={showPassword ? content.hidePassword : content.showPassword}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                {isLoading ? content.signingIn : content.signInButton}
              </button>
            </form>

            {/* Links */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-600">
                {content.noAccount}{' '}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                >
                  {content.signUpLink}
                </Link>
              </p>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors duration-200"
              >
                {content.forgotPassword}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;