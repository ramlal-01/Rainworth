import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation add karo
import Header from '../components/Header.jsx';
import LocationInput from '../components/LocationInput.jsx';
import SelectField from '../components/SelectField.jsx';
import NumberInput from '../components/NumberInput.jsx';
import OpenSpaceInputs from '../components/OpenSpaceInputs.jsx';
import SubmitButton from '../components/SubmitButton.jsx';

const Form = () => {
  const [formData, setFormData] = useState({
    location: '',
    roofArea: '',
    roofAreaUnit: 'm²',
    residenceType: '',
    roofType: '',
    dwellers: '',
    openSpaceLength: '',
    openSpaceBreadth: ''
  });

  const [isEnglish, setIsEnglish] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Ab yeh kaam karega

  // Hardcoded language content for demonstration
  const langContent = {
    en: {
      title: 'RainWorth',
      home: 'Home',
      mainHeading: 'Rainwater Harvesting Assessment',
      subHeading: 'Please provide the following details to calculate your property\'s water potential.',
      locationLabel: 'Location',
      locationManual: 'Enter location manually',
      locationCurrent: 'Use Current Location',
      roofAreaLabel: 'Roof Area',
      roofAreaManual: 'Enter roof area',
      roofAreaApi: 'Get from Satellite',
      roofAreaUnits: [
        { value: 'm²', label: 'Square Meter (m²)' },
        { value: 'ft²', label: 'Square Foot (ft²)' },
        { value: 'yard', label: 'Square Yard (Gaj)' },
        { value: 'ha', label: 'Hectare (ha)' },
        { value: 'acre', label: 'Acre' },
        { value: 'km²', label: 'Square Kilometer (km²)' },
      ],
      residenceTypeLabel: 'Residence Type',
      residenceTypes: [
        { value: 'house', label: 'Independent House' },
        { value: 'apartment_individual', label: 'Apartment (Individual Flat)' },
        { value: 'apartment_building', label: 'Apartment (Entire Building)' },
        { value: 'colony', label: 'Colony' },
        { value: 'ngo_govt', label: 'Government/NGO' },
      ],
      roofTypeLabel: 'Roof Type',
      roofTypes: [
        { value: 'concrete', label: 'Concrete' },
        { value: 'tile', label: 'Tile' },
        { value: 'sheet', label: 'Sheet' },
      ],
      dwellersLabel: 'Number of Dwellers',
      openSpaceLabel: 'Open Space Dimensions',
      openSpacePlaceholderLength: 'Length (m)',
      openSpacePlaceholderBreadth: 'Width (m)',
      calculateButton: 'Calculate Water Potential'
    },
    hi: {
      title: 'रेनवर्थ',
      home: 'होम',
      mainHeading: 'वर्षा जल संचयन मूल्यांकन',
      subHeading: 'अपनी संपत्ति की जल क्षमता की गणना के लिए कृपया निम्नलिखित विवरण प्रदान करें।',
      locationLabel: 'स्थान',
      locationManual: 'स्थान मैन्युअल रूप से दर्ज करें',
      locationCurrent: 'वर्तमान स्थान का उपयोग करें',
      roofAreaLabel: 'छत का क्षेत्रफल',
      roofAreaManual: 'छत का क्षेत्रफल दर्ज करें',
      roofAreaApi: 'सैटेलाइट से प्राप्त करें',
      roofAreaUnits: [
        { value: 'm²', label: 'वर्ग मीटर (m²)' },
        { value: 'ft²', label: 'वर्ग फुट (ft²)' },
        { value: 'yard', label: 'वर्ग गज (गज)' },
        { value: 'ha', label: 'हेक्टेयर (ha)' },
        { value: 'acre', label: 'एकड़' },
        { value: 'km²', label: 'वर्ग किलोमीटर (km²)' },
      ],
      residenceTypeLabel: 'निवास का प्रकार',
      residenceTypes: [
        { value: 'house', label: 'स्वतंत्र घर' },
        { value: 'apartment_individual', label: 'अपार्टमेंट (व्यक्तिगत फ्लैट)' },
        { value: 'apartment_building', label: 'अपार्टमेंट (पूरी इमारत)' },
        { value: 'colony', label: 'कॉलोनी' },
        { value: 'ngo_govt', label: 'सरकारी/गैर-सरकारी संगठन' },
      ],
      roofTypeLabel: 'छत का प्रकार',
      roofTypes: [
        { value: 'concrete', label: 'कंक्रीट' },
        { value: 'tile', label: 'टाइल' },
        { value: 'sheet', label: 'शीट' },
      ],
      dwellersLabel: 'निवासियों की संख्या',
      openSpaceLabel: 'खुली जगह का आयाम',
      openSpacePlaceholderLength: 'लंबाई (मीटर)',
      openSpacePlaceholderBreadth: 'चौड़ाई (मीटर)',
      calculateButton: 'जल क्षमता की गणना करें'
    }
  };

  const content = isEnglish ? langContent.en : langContent.hi;

  // Function to get current location
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    
    try {
      // Get user's coordinates
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      console.log('Got coordinates:', latitude, longitude);

      // Use reverse geocoding to get city name
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=1ae831541622ce6d45c976ef01eb06b0`
      );

      if (!response.ok) {
        throw new Error('Failed to get location information');
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        const locationInfo = data[0];
        // Construct location string: City, State, Country
        let locationString = locationInfo.name;
        if (locationInfo.state) {
          locationString += `, ${locationInfo.state}`;
        }
        locationString += `, ${locationInfo.country}`;
        
        console.log('Location found:', locationString);
        
        // Update the form data
        setFormData(prevState => ({ 
          ...prevState, 
          location: locationString 
        }));
      } else {
        throw new Error('No location information found');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      if (error.code === 1) {
        alert('Location access denied. Please enable location services and try again.');
      } else if (error.code === 2) {
        alert('Location unavailable. Please check your internet connection.');
      } else if (error.code === 3) {
        alert('Location request timed out. Please try again.');
      } else {
        alert(`Error getting location: ${error.message}`);
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'roofAreaUnit') {
      // Convert area when unit changes
      const currentArea = parseFloat(formData.roofArea) || 0;
      const currentUnit = formData.roofAreaUnit;
      const newUnit = value;
      
      // Convert current area to square meters first, then to new unit
      let areaInSquareMeters = 0;
      
      // Convert from current unit to square meters
      switch (currentUnit) {
        case 'm²':
          areaInSquareMeters = currentArea;
          break;
        case 'ft²':
          areaInSquareMeters = currentArea * 0.092903;
          break;
        case 'yard':
          areaInSquareMeters = currentArea * 0.836127;
          break;
        case 'ha':
          areaInSquareMeters = currentArea * 10000;
          break;
        case 'acre':
          areaInSquareMeters = currentArea * 4046.86;
          break;
        case 'km²':
          areaInSquareMeters = currentArea * 1000000;
          break;
        default:
          areaInSquareMeters = currentArea;
      }
      
      // Convert from square meters to new unit
      let convertedArea = 0;
      switch (newUnit) {
        case 'm²':
          convertedArea = areaInSquareMeters;
          break;
        case 'ft²':
          convertedArea = areaInSquareMeters / 0.092903;
          break;
        case 'yard':
          convertedArea = areaInSquareMeters / 0.836127;
          break;
        case 'ha':
          convertedArea = areaInSquareMeters / 10000;
          break;
        case 'acre':
          convertedArea = areaInSquareMeters / 4046.86;
          break;
        case 'km²':
          convertedArea = areaInSquareMeters / 1000000;
          break;
        default:
          convertedArea = areaInSquareMeters;
      }
      
      setFormData(prevState => ({ 
        ...prevState, 
        [name]: value,
        roofArea: convertedArea.toFixed(2)
      }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    console.log('Calculating water potential with data:', formData);
    
    // Validate required fields
    if (!formData.location || !formData.roofArea || !formData.residenceType || !formData.roofType || !formData.dwellers) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Map frontend values to backend expected enum values
      const residenceTypeMapping = {
        'house': 'Independent House',
        'apartment_individual': 'Apartment',
        'apartment_building': 'Apartment',
        'colony': 'Colony',
        'ngo_govt': 'Colony' // Map to closest available option
      };

      const roofTypeMapping = {
        'concrete': 'Concrete',
        'tile': 'Tile',
        'sheet': 'Sheet'
      };

      // Prepare data for backend API
      const projectData = {
        name: `${formData.location} Assessment`,
        location: formData.location,
        residenceType: residenceTypeMapping[formData.residenceType] || formData.residenceType,
        numberOfDwellers: parseInt(formData.dwellers),
        numberOfFlats: formData.residenceType === 'apartment_building' ? parseInt(formData.dwellers) : 1,
        openSpaceArea: parseFloat(formData.openSpaceLength) * parseFloat(formData.openSpaceBreadth) || 0,
        roofType: roofTypeMapping[formData.roofType] || formData.roofType,
        roofArea: parseFloat(formData.roofArea)
      };

      console.log('Submitting project data:', projectData);

      // Submit to backend API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || 'Failed to submit project data');
      }

      const result = await response.json();
      console.log('Project created successfully:', result);

      // Navigate to dashboard with project ID
      navigate(`/dashboard/${result.project._id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      alert(`Error submitting form: ${error.message}. Please check the console for more details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSatelliteClick = () => {
    // Navigate to map page with current area value (if any)
    navigate('/map', { 
      state: { 
        area: formData.roofArea || '0',
        unit: formData.roofAreaUnit 
      } 
    });
  };

  // Check if we're returning from map with area data
  // useEffect(() => {
  //   if (location.state?.fromMap && location.state?.area) {
  //     setFormData(prev => ({
  //       ...prev,
  //       roofArea: location.state.area.toString()
  //     }));
      
  //     // Clear the state to avoid reusing on refresh
  //     navigate(location.pathname, { replace: true, state: {} });
  //   }
  // }, [location.state, navigate, location.pathname]);

  // Check for measured area from localStorage - YEH ADD KARO
  useEffect(() => {
    const checkForMapArea = () => {
      const measuredArea = localStorage.getItem('measuredArea');
      const areaTimestamp = localStorage.getItem('areaTimestamp');
      
      console.log('Checking localStorage - Area:', measuredArea, 'Timestamp:', areaTimestamp);
      
      if (measuredArea && areaTimestamp) {
        // Check if data is fresh (within last 10 seconds)
        const timeDiff = Date.now() - parseInt(areaTimestamp);
        console.log('Time difference:', timeDiff, 'ms');
        
        if (timeDiff < 10000) { // 10 seconds
          console.log('Setting area from localStorage:', measuredArea);
          setFormData(prev => ({
            ...prev,
            roofArea: measuredArea
          }));
        } else {
          console.log('Data too old, ignoring');
        }
        
        // Clear storage regardless
        localStorage.removeItem('measuredArea');
        localStorage.removeItem('areaTimestamp');
      }
    };

    checkForMapArea();

    // Also check on focus in case user comes back to tab
    window.addEventListener('focus', checkForMapArea);
    
    return () => {
      window.removeEventListener('focus', checkForMapArea);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* A. Header */}
      <Header
        className=""
        title={content.title}
        homeLabel={content.home}
        isEnglish={isEnglish}
        onToggleLanguage={() => setIsEnglish(!isEnglish)}
      />
      
      {/* B. Form Section */}
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <main className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl w-full transform transition-transform duration-500 hover:scale-[1.01] border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">{content.mainHeading}</h2>
            <p className="text-gray-600 text-lg">
              {content.subHeading}
            </p>
          </div>
        
        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location Input */}
          <LocationInput
            label={content.locationLabel}
            placeholder={content.locationManual}
            value={formData.location}
            onChange={handleChange}
            onUseCurrent={getCurrentLocation}
            currentLocationLabel={content.locationCurrent}
            isGettingLocation={isGettingLocation}
          />

          {/* Roof Area Input - DIRECTLY IN FORM COMPONENT */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{content.roofAreaLabel}</label>
            
            <div className="flex gap-2">
              <input
                type="number"
                name="roofArea"
                value={formData.roofArea}
                onChange={handleChange}
                placeholder={content.roofAreaManual}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              
              <select
                name="roofAreaUnit"
                value={formData.roofAreaUnit}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                {content.roofAreaUnits.map((unitOption) => (
                  <option key={unitOption.value} value={unitOption.value}>
                    {unitOption.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* <button
              type="button"
              onClick={handleSatelliteClick}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-colors mt-2"
            >
              📡 {content.roofAreaApi}
            </button> */}
            <button
  type="button"
  onClick={handleSatelliteClick}
  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-colors mt-2"
>
  📡 {content.roofAreaApi}
</button>
          </div>

          {/* Residence Type Dropdown */}
          <SelectField
            label={content.residenceTypeLabel}
            name="residenceType"
            value={formData.residenceType}
            onChange={handleChange}
            options={content.residenceTypes}
            placeholder={isEnglish ? 'Select...' : 'चुनें...'}
          />

          {/* Roof Type Dropdown */}
          <SelectField
            label={content.roofTypeLabel}
            name="roofType"
            value={formData.roofType}
            onChange={handleChange}
            options={content.roofTypes}
            placeholder={isEnglish ? 'Select...' : 'चुनें...'}
          />

          {/* Number of Dwellers */}
          <NumberInput
            label={content.dwellersLabel}
            name="dwellers"
            value={formData.dwellers}
            onChange={handleChange}
          />

          {/* Open Space */}
          <OpenSpaceInputs
            label={content.openSpaceLabel}
            lengthPlaceholder={content.openSpacePlaceholderLength}
            breadthPlaceholder={content.openSpacePlaceholderBreadth}
            lengthValue={formData.openSpaceLength}
            breadthValue={formData.openSpaceBreadth}
            onLengthChange={(e) => setFormData({ ...formData, openSpaceLength: e.target.value })}
            onBreadthChange={(e) => setFormData({ ...formData, openSpaceBreadth: e.target.value })}
          />

          {/* C. Call to Action Button */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-lg text-lg font-bold rounded-full text-white transition-all duration-200 transform ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 hover:scale-105'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500`}
            >
              {isSubmitting ? 'Calculating...' : content.calculateButton}
            </button>
          </div>


        </form>
        </main>
      </div>
    </div>
  );
};

export default Form;