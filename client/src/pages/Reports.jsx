import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobeAltIcon, HomeIcon, DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/solid';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnglish, setIsEnglish] = useState(true);
  const navigate = useNavigate();

  const langContent = {
    en: {
      title: 'RainWorth',
      home: 'Home',
      pageTitle: 'My Reports',
      subtitle: 'View and download your past rainwater harvesting analysis reports.',
      noReports: 'No reports found',
      noReportsDesc: 'You haven\'t generated any reports yet. Create a project to get started.',
      createProject: 'Create New Project',
      reportId: 'Report ID',
      project: 'Project',
      generatedOn: 'Generated On',
      actions: 'Actions',
      download: 'Download',
      view: 'View',
      loading: 'Loading reports...',
      error: 'Error loading reports'
    },
    hi: {
      title: 'रेनवर्थ',
      home: 'होम',
      pageTitle: 'मेरी रिपोर्ट्स',
      subtitle: 'अपनी पिछली वर्षा जल संचयन विश्लेषण रिपोर्ट देखें और डाउनलोड करें।',
      noReports: 'कोई रिपोर्ट नहीं मिली',
      noReportsDesc: 'आपने अभी तक कोई रिपोर्ट नहीं बनाई है। शुरू करने के लिए एक प्रोजेक्ट बनाएं।',
      createProject: 'नया प्रोजेक्ट बनाएं',
      reportId: 'रिपोर्ट आईडी',
      project: 'प्रोजेक्ट',
      generatedOn: 'बनाया गया',
      actions: 'कार्य',
      download: 'डाउनलोड',
      view: 'देखें',
      loading: 'रिपोर्ट लोड हो रही हैं...',
      error: 'रिपोर्ट लोड करने में त्रुटि'
    }
  };

  const content = isEnglish ? langContent.en : langContent.hi;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`);
      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rainwater-report-${reportId.slice(-6)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto"></div>
          <h2 className="text-2xl font-semibold mt-4 text-gray-600">{content.loading}</h2>
        </div>
      </div>
    );
  }

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
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {content.pageTitle}
            </h2>
            <p className="text-gray-600">
              {content.subtitle}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{content.error}: {error}</p>
            </div>
          )}

          {reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DocumentArrowDownIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {content.noReports}
              </h3>
              <p className="text-gray-600 mb-8">
                {content.noReportsDesc}
              </p>
              <Link
                to="/form"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                {content.createProject}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">{content.reportId}</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">{content.project}</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">{content.generatedOn}</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">{content.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          RH-{report.id.slice(-6)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-900">
                          Project {report.projectId.slice(-6)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/dashboard/${report.projectId}`)}
                            className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                            title={content.view}
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            {content.view}
                          </button>
                          <button
                            onClick={() => handleDownload(report.id)}
                            className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                            title={content.download}
                          >
                            <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                            {content.download}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;