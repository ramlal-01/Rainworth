// // src/pages/MapPage.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const MapPage = () => {
//   const [area, setArea] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get initial area from navigation state if coming from form
//   useEffect(() => {
//     if (location.state?.area) {
//       setArea(parseFloat(location.state.area) || 0);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     // Load Google Maps script
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAB9Jidcvla2HYAc50YzHsCZegfLNXnSrA&libraries=drawing,geometry,places&callback=initMap`;
//     script.async = true;
//     script.defer = true;
//     document.head.appendChild(script);

//     window.initMap = initMap;

//     return () => {
//       document.head.removeChild(script);
//       delete window.initMap;
//     };
//   }, []);

//   const initMap = () => {
//     const map = new window.google.maps.Map(document.getElementById("map-container"), {
//       center: { lat: 20.5937, lng: 78.9629 },
//       zoom: 5,
//       mapTypeId: "satellite"
//     });

//     const drawingManager = new window.google.maps.drawing.DrawingManager({
//       drawingMode: null,
//       drawingControl: true,
//       drawingControlOptions: {
//         position: window.google.maps.ControlPosition.TOP_LEFT,
//         drawingModes: ["polygon"]
//       },
//       polygonOptions: { 
//         editable: true,
//         fillColor: '#2c7da0',
//         strokeColor: '#2c7da0',
//         fillOpacity: 0.4
//       }
//     });
    
//     drawingManager.setMap(map);

//     let selectedShape = null;

//     window.google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => {
//       if (selectedShape) selectedShape.setMap(null);
//       selectedShape = event.overlay;
//       updateArea(selectedShape);
      
//       window.google.maps.event.addListener(selectedShape.getPath(), "set_at", () => updateArea(selectedShape));
//       window.google.maps.event.addListener(selectedShape.getPath(), "insert_at", () => updateArea(selectedShape));
//     });

//     // Locate Me button functionality
//     document.getElementById("locate-btn")?.addEventListener("click", () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition((pos) => {
//           const loc = new window.google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
//           map.setCenter(loc);
//           map.setZoom(16);
//           new window.google.maps.Marker({ 
//             position: loc, 
//             map, 
//             title: "Your Location",
//             icon: {
//               url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
//             }
//           });
//         });
//       } else {
//         alert("Geolocation not supported");
//       }
//     });

//     // Search button functionality
//     document.getElementById("search-btn")?.addEventListener("click", () => {
//       const query = document.getElementById("search-input").value.trim();
//       if (!query) return;
      
//       const geocoder = new window.google.maps.Geocoder();
//       geocoder.geocode({ address: query }, (results, status) => {
//         if (status === "OK" && results[0]) {
//           map.setCenter(results[0].geometry.location);
//           map.setZoom(16);
//           new window.google.maps.Marker({
//             position: results[0].geometry.location,
//             map,
//             title: results[0].formatted_address
//           });
//         } else {
//           alert("Location not found");
//         }
//       });
//     });
//   };

//   const updateArea = (shape) => {
//     const areaValue = window.google.maps.geometry.spherical.computeArea(shape.getPath());
//     setArea(areaValue);
//   };

//   const handleUseThisArea = () => {
//   // Save area to localStorage
//   localStorage.setItem('measuredArea', area.toString());
//   localStorage.setItem('areaTimestamp', Date.now().toString());
//   navigate(-1);
// };

//   const handleBack = () => {
//     // Go back without sending any data
//     navigate(-1);
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 bg-blue-700 text-white flex-wrap gap-4">
//         <button 
//           onClick={handleBack}
//           className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded font-bold transition-colors shadow-sm"
//         >
//           ← Back
//         </button>
        
//         <h2 className="text-xl font-bold">Measure Rooftop Area</h2>
        
//         <div className="bg-white bg-opacity-20 px-4 py-2 rounded text-black">
//           Calculated Area: <span className="font-bold text-lg text-black">{area.toFixed(2)} m²</span>
//         </div>
        
//         <button 
//           onClick={handleUseThisArea}
//           disabled={area === 0}
//           className={`px-6 py-2 rounded font-bold transition-colors shadow-sm ${
//             area === 0 
//               ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
//               : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white'
//           }`}
//         >
//           Use This Area
//         </button>
//       </div>

//       {/* Map Controls */}
//       <div className="flex items-center gap-4 p-3 bg-gray-50 flex-wrap">
//         <div className="flex flex-1 max-w-md">
//           <input 
//             id="search-input"
//             type="text" 
//             placeholder="Search location..." 
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button 
//             id="search-btn"
//             className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded-r transition-colors shadow-sm"
//           >
//             🔍 Search
//           </button>
//         </div>
        
//         <button 
//           id="locate-btn"
//           className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded transition-colors shadow-sm whitespace-nowrap"
//         >
//           📍 Locate Me
//         </button>
//       </div>

//       {/* Map Container */}
//       <div id="map-container" className="flex-1 w-full"></div>

//       {/* Instructions */}
//       <div className="p-4 bg-gray-50 border-t border-gray-200">
//         <h3 className="text-lg font-semibold text-blue-700 mb-2">Instructions:</h3>
//         <ol className="list-decimal list-inside space-y-1 text-gray-700">
//           <li>Use the polygon tool (↗) on the top left to draw your rooftop area</li>
//           <li>Click on the map to create points around your rooftop</li>
//           <li>Double-click or complete the shape to finish drawing</li>
//           <li>Drag points to adjust the shape if needed</li>
//           <li>Click "Use This Area" when done</li>
//         </ol>
//       </div>
//     </div>
//   );
// };

// export default MapPage;

// code --->2
// src/pages/MapPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MapPage = () => {
  const [area, setArea] = useState(0);
  const [drawingMode, setDrawingMode] = useState('curvedSurface'); // 'curvedSurface' or 'polygon'
  const [isDrawing, setIsDrawing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.area) {
      setArea(parseFloat(location.state.area) || 0);
    }
  }, [location.state]);

  useEffect(() => {
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

    let selectedShape = null;
    let startPoint = null;
    let endPoint = null;
    let polygon = null;

    const createRectangleShape = (start, end) => {
      if (selectedShape) selectedShape.setMap(null);

      const paths = [
        start,
        { lat: start.lat(), lng: end.lng() },
        end,
        { lat: end.lat(), lng: start.lng() },
        start
      ];

      polygon = new window.google.maps.Polygon({
        paths,
        strokeColor: '#2c7da0',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#2c7da0',
        fillOpacity: 0.35,
        editable: true,
        draggable: true
      });

      polygon.setMap(map);
      selectedShape = polygon;
      setArea(window.google.maps.geometry.spherical.computeArea(polygon.getPath()));

      polygon.getPath().forEach((path) => {
        window.google.maps.event.addListener(path, 'set_at', () => {
          setArea(window.google.maps.geometry.spherical.computeArea(polygon.getPath()));
        });
      });
    };

    window.google.maps.event.addListener(map, 'click', (event) => {
      if (drawingMode === 'curvedSurface') {
        if (!startPoint) {
          startPoint = event.latLng;
          setIsDrawing(true);
          new window.google.maps.Marker({
            position: startPoint,
            map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 5,
              fillColor: '#2c7da0',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff'
            }
          });
        } else {
          endPoint = event.latLng;
          createRectangleShape(startPoint, endPoint);
          startPoint = null;
          endPoint = null;
          setIsDrawing(false);
        }
      }
    });

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        editable: true,
        fillColor: '#2c7da0',
        strokeColor: '#2c7da0',
        fillOpacity: 0.35
      }
    });
    drawingManager.setMap(map);

    window.google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => {
      if (selectedShape) selectedShape.setMap(null);
      selectedShape = event.overlay;

      if (event.type === 'polygon') {
        const areaValue = window.google.maps.geometry.spherical.computeArea(selectedShape.getPath());
        setArea(areaValue);

        window.google.maps.event.addListener(selectedShape.getPath(), "set_at", () => {
          setArea(window.google.maps.geometry.spherical.computeArea(selectedShape.getPath()));
        });
        window.google.maps.event.addListener(selectedShape.getPath(), "insert_at", () => {
          setArea(window.google.maps.geometry.spherical.computeArea(selectedShape.getPath()));
        });
      }
    });

    const setDrawingModeHandler = (mode) => {
      setDrawingMode(mode);
      startPoint = null;
      endPoint = null;
      setIsDrawing(false);

      if (selectedShape) {
        selectedShape.setMap(null);
        selectedShape = null;
      }

      if (mode === 'polygon') drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
      else drawingManager.setDrawingMode(null);
    };

    document.getElementById("curved-btn")?.addEventListener("click", () => setDrawingModeHandler('curvedSurface'));
    document.getElementById("polygon-btn")?.addEventListener("click", () => setDrawingModeHandler('polygon'));

    document.getElementById("clear-btn")?.addEventListener("click", () => {
      if (selectedShape) selectedShape.setMap(null);
      selectedShape = null;
      startPoint = null;
      endPoint = null;
      setIsDrawing(false);
      setArea(0);
      drawingManager.setDrawingMode(null);
    });

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
            icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
          });
        });
      } else alert("Geolocation not supported");
    });

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
        } else alert("Location not found");
      });
    });
  };

  const handleUseThisArea = () => {
    localStorage.setItem('measuredArea', area.toString());
    localStorage.setItem('areaTimestamp', Date.now().toString());
    navigate(-1);
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-700 text-white flex-wrap gap-4">
        <button 
          onClick={handleBack}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded font-bold shadow-sm"
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
          className={`px-6 py-2 rounded font-bold shadow-sm ${
            area === 0 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
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
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
          />
          <button 
            id="search-btn"
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded-r shadow-sm"
          >
            🔍 Search
          </button>
        </div>
        <button 
          id="locate-btn"
          className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded shadow-sm whitespace-nowrap"
        >
          📍 Locate Me
        </button>
      </div>

      {/* Drawing Mode */}
      <div className="flex items-center gap-3 p-3 bg-gray-100 flex-wrap">
        <span className="font-semibold text-gray-700">Shape Type:</span>

        <button 
          id="curved-btn"
          className={`px-3 py-2 rounded shadow-sm text-sm ${
            drawingMode === 'curvedSurface' 
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          ▭ Curved Surface
        </button>

        <button 
          id="polygon-btn"
          className={`px-3 py-2 rounded shadow-sm text-sm ${
            drawingMode === 'polygon' 
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          ⬡ Custom Polygon
        </button>

        <button 
          id="clear-btn"
          className="px-3 py-2 bg-red-500 text-white rounded shadow-sm text-sm hover:bg-red-600 ml-auto"
        >
          🗑️ Clear
        </button>
      </div>

      {/* Drawing Status */}
      {isDrawing && (
        <div className="px-3 py-2 bg-yellow-100 text-yellow-800 text-sm">
          ⚡ Click on map to set the second point for {drawingMode}
        </div>
      )}

      {/* Map Container */}
      <div id="map-container" className="flex-1 w-full"></div>
    </div>
  );
};

export default MapPage;
