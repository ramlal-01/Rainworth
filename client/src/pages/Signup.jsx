import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, GlobeAltIcon, HomeIcon, UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEnglish, setIsEnglish] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  const langContent = {
    en: {
      title: 'RainWorth',
      home: 'Home',
      pageTitle: 'Create Account',
      subtitle: 'Join RainWorth to start your rainwater harvesting journey.',
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      signUpButton: 'Create Account',
      signingUp: 'Creating Account...',
      haveAccount: 'Already have an account?',
      signInLink: 'Sign in here',
      passwordMismatch: 'Passwords do not match',
      passwordMinLength: 'Password must be at least 6 characters'
    },
    hi: {
      title: 'रेनवर्थ',
      home: 'होम',
      pageTitle: 'खाता बनाएं',
      subtitle: 'अपनी वर्षा जल संचयन यात्रा शुरू करने के लिए रेनवर्थ में शामिल हों।',
      nameLabel: 'पूरा नाम',
      emailLabel: 'ईमेल पता',
      passwordLabel: 'पासवर्ड',
      confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
      showPassword: 'पासवर्ड दिखाएं',
      hidePassword: 'पासवर्ड छुपाएं',
      signUpButton: 'खाता बनाएं',
      signingUp: 'खाता बनाया जा रहा है...',
      haveAccount: 'पहले से खाता है?',
      signInLink: 'यहाँ साइन इन करें',
      passwordMismatch: 'पासवर्ड मेल नहीं खाते',
      passwordMinLength: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए'
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

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError(content.passwordMinLength);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(content.passwordMismatch);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Auto login after successful signup
      const loginResponse = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        // Use auth context to login
        login(loginData.token, loginData.user);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        // If auto-login fails, redirect to login page
        navigate('/login');
      }
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
          {/* Signup Card */}
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
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {content.nameLabel}
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="John Doe"
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {content.emailLabel}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
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
                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="••••••••"
                  />
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {content.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="••••••••"
                  />
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    title={showConfirmPassword ? content.hidePassword : content.showPassword}
                  >
                    {showConfirmPassword ? (
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
                {isLoading ? content.signingUp : content.signUpButton}
              </button>
            </form>

            {/* Links */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {content.haveAccount}{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                >
                  {content.signInLink}
                </Link>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-tint text-blue-600"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Water Analysis</h3>
              <p className="text-xs text-gray-600">Detailed water harvesting calculations</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-chart-bar text-green-600"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Smart Reports</h3>
              <p className="text-xs text-gray-600">Generate comprehensive PDF reports</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-leaf text-purple-600"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Sustainability</h3>
              <p className="text-xs text-gray-600">Track your environmental impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;