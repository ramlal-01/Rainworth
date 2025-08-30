import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    alert('Test form button clicked!');
    
    const testData = {
      name: "Test Delhi Assessment",
      location: "Delhi, India",
      residenceType: "Independent House",
      numberOfDwellers: 4,
      numberOfFlats: 1,
      openSpaceArea: 100,
      roofType: "Concrete",
      roofArea: 50
    };

    try {
      console.log('Sending test data:', testData);
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        alert(`Success! Project ID: ${result.project._id}`);
        navigate(`/dashboard/${result.project._id}`);
      } else {
        const errorText = await response.text();
        alert(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Network Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8">Test Form</h1>
      
      <div className="max-w-md mx-auto">
        <p className="mb-4">This will create a test project for Delhi, India</p>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg disabled:bg-gray-400"
        >
          {isSubmitting ? 'Creating Project...' : 'Create Test Project'}
        </button>
      </div>
    </div>
  );
};

export default TestForm;