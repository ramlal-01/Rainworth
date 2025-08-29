import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import LocationInput from '../components/LocationInput.jsx';
import RoofAreaInput from '../components/RoofAreaInput.jsx';
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
        { value: 'm²', label: 'वर्ग मीटर ($m^2$)' },
        { value: 'ft²', label: 'वर्ग फुट ($ft^2$)' },
        { value: 'yard', label: 'वर्ग गज (गज)' },
        { value: 'ha', label: 'हेक्टेयर (ha)' },
        { value: 'acre', label: 'एकड़' },
        { value: 'km²', label: 'वर्ग किलोमीटर ($km^2$)' },
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
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    console.log('Calculating water potential with data:', formData);
    // This is a placeholder for your backend API call
  };

  return (
    <div className="min-h-screen bg-white">
      {/* A. Header */}
      <Header
        title={content.title}
        homeLabel={content.home}
        isEnglish={isEnglish}
        onToggleLanguage={() => setIsEnglish(!isEnglish)}
      />
      
      {/* B. Form Section */}
      <main className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl max-w-4xl mx-auto transform transition-transform duration-500 hover:scale-[1.01]">
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

          {/* Roof Area Input */}
          <RoofAreaInput
            label={content.roofAreaLabel}
            placeholder={content.roofAreaManual}
            value={formData.roofArea}
            unit={formData.roofAreaUnit}
            units={content.roofAreaUnits}
            onAreaChange={handleChange}
            onUnitChange={handleChange}
            apiButtonLabel={content.roofAreaApi}
            onFetchFromApi={() => {
              console.log('Fetching roof area via Google Earth API');
            }}
          />

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
          <SubmitButton label={content.calculateButton} />
        </form>
      </main>
    </div>
  );
};

export default Form;
