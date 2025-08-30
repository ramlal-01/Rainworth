// src/pages/MapPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MapPage = () => {
  const [area, setArea] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get initial area from navigation state if coming from form
  useEffect(() => {
    if (location.state?.area) {
      setArea(parseFloat(location.state.area) || 0);
    }
  }, [location.state]);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAB9Jidcvla2HYAc50YzHsCZegfLNXnSrA&libraries=drawing,geometry,places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.initMap = initMap;

    return () => {
      document.head.removeChild(script);
      delete window.initMap;
    };
  }, []);

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map-container"), {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 5,
      mapTypeId: "satellite"
    });

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_LEFT,
        drawingModes: ["polygon"]
      },
      polygonOptions: { 
        editable: true,
        fillColor: '#2c7da0',
        strokeColor: '#2c7da0',
        fillOpacity: 0.4
      }
    });
    
    drawingManager.setMap(map);

    let selectedShape = null;

    window.google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => {
      if (selectedShape) selectedShape.setMap(null);
      selectedShape = event.overlay;
      updateArea(selectedShape);
      
      window.google.maps.event.addListener(selectedShape.getPath(), "set_at", () => updateArea(selectedShape));
      window.google.maps.event.addListener(selectedShape.getPath(), "insert_at", () => updateArea(selectedShape));
    });

    // Locate Me button functionality
    document.getElementById("locate-btn")?.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const loc = new window.google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          map.setCenter(loc);
          map.setZoom(16);
          new window.google.maps.Marker({ 
            position: loc, 
            map, 
            title: "Your Location",
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
          });
        });
      } else {
        alert("Geolocation not supported");
      }
    });

    // Search button functionality
    document.getElementById("search-btn")?.addEventListener("click", () => {
      const query = document.getElementById("search-input").value.trim();
      if (!query) return;
      
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: query }, (results, status) => {
        if (status === "OK" && results[0]) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(16);
          new window.google.maps.Marker({
            position: results[0].geometry.location,
            map,
            title: results[0].formatted_address
          });
        } else {
          alert("Location not found");
        }
      });
    });
  };

  const updateArea = (shape) => {
    const areaValue = window.google.maps.geometry.spherical.computeArea(shape.getPath());
    setArea(areaValue);
  };

  const handleUseThisArea = () => {
  // Save area to localStorage
  localStorage.setItem('measuredArea', area.toString());
  localStorage.setItem('areaTimestamp', Date.now().toString());
  navigate(-1);
};

  const handleBack = () => {
    // Go back without sending any data
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-700 text-white flex-wrap gap-4">
        <button 
          onClick={handleBack}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded font-bold transition-colors shadow-sm"
        >
          ← Back
        </button>
        
        <h2 className="text-xl font-bold">Measure Rooftop Area</h2>
        
        <div className="bg-white bg-opacity-20 px-4 py-2 rounded text-black">
          Calculated Area: <span className="font-bold text-lg text-black">{area.toFixed(2)} m²</span>
        </div>
        
        <button 
          onClick={handleUseThisArea}
          disabled={area === 0}
          className={`px-6 py-2 rounded font-bold transition-colors shadow-sm ${
            area === 0 
              ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
              : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white'
          }`}
        >
          Use This Area
        </button>
      </div>

      {/* Map Controls */}
      <div className="flex items-center gap-4 p-3 bg-gray-50 flex-wrap">
        <div className="flex flex-1 max-w-md">
          <input 
            id="search-input"
            type="text" 
            placeholder="Search location..." 
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            id="search-btn"
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded-r transition-colors shadow-sm"
          >
            🔍 Search
          </button>
        </div>
        
        <button 
          id="locate-btn"
          className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded transition-colors shadow-sm whitespace-nowrap"
        >
          📍 Locate Me
        </button>
      </div>

      {/* Map Container */}
      <div id="map-container" className="flex-1 w-full"></div>

      {/* Instructions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>Use the polygon tool (↗) on the top left to draw your rooftop area</li>
          <li>Click on the map to create points around your rooftop</li>
          <li>Double-click or complete the shape to finish drawing</li>
          <li>Drag points to adjust the shape if needed</li>
          <li>Click "Use This Area" when done</li>
        </ol>
      </div>
    </div>
  );
};

export default MapPage;