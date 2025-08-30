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
      
      // Prepare data for backend API
      const projectData = {
        name: `${formData.location} Assessment`,
        location: formData.location,
        residenceType: formData.residenceType,
        numberOfDwellers: parseInt(formData.dwellers),
        numberOfFlats: formData.residenceType === 'apartment_building' ? parseInt(formData.dwellers) : 1,
        openSpaceArea: parseFloat(formData.openSpaceLength) * parseFloat(formData.openSpaceBreadth) || 0,
        roofType: formData.roofType,
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit project data');
      }

      const result = await response.json();
      console.log('Project created successfully:', result);

      // Navigate to dashboard with project ID
      navigate(`/dashboard/${result.project._id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error submitting form: ${error.message}. Please try again.`);
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
    <div className="min-h-screen bg-white">
      {/* A. Header */}
      <Header
        className=""
        title={content.title}
        homeLabel={content.home}
        isEnglish={isEnglish}
        onToggleLanguage={() => setIsEnglish(!isEnglish)}
      />
      
      {/* B. Form Section */}
      <main className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl w-full transform transition-transform duration-500 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-gray-700 mb-2">{content.mainHeading}</h2>
        <p className="text-gray-500 mb-8">
          {content.subHeading}
        </p>
        
        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location Input */}
          <LocationInput
          
            label={content.locationLabel}
            placeholder={content.locationManual}
            value={formData.location}
            onChange={handleChange}
            onUseCurrent={() => {
              console.log('Fetching current location via Google Maps API');
            }}
            currentLocationLabel={content.locationCurrent}
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
  );
};

export default Form;