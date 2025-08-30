import axios from "axios";

export const getCoordinates = async (location, apiKey) => {
  const geoRes = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`
  );

  if (!geoRes.data || geoRes.data.length === 0) return null;

  return {
    lat: geoRes.data[0].lat,
    lon: geoRes.data[0].lon
  };
};


export const getMonthlyRainfall = async (lat, lon) => {
  try {
    const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=PRECTOTCORR&community=RE&longitude=${lon}&latitude=${lat}&format=JSON`;
    const res = await axios.get(url);

    const data = res.data.properties.parameter.PRECTOTCORR;

    // Convert mm/day → approximate mm/month
    const daysInMonth = {
      JAN: 31, FEB: 28, MAR: 31, APR: 30, MAY: 31, JUN: 30,
      JUL: 31, AUG: 31, SEP: 30, OCT: 31, NOV: 30, DEC: 31
    };

    const monthlyRainfall = {};
    for (let month in daysInMonth) {
      monthlyRainfall[month] = +(data[month] * daysInMonth[month]).toFixed(2); 
    }

    return monthlyRainfall;

  } catch (err) {
    console.error("Error fetching monthly rainfall:", err.message);
    return undefined;
  }
};


// export const calculateHarvest = (monthlyRainfall, roofArea, runoffCoeff) => {
//   if (!monthlyRainfall) return { monthlyHarvest: {}, annualHarvest: 0 };

//   const monthlyHarvest = {};
//   let annualHarvest = 0;

//   for (let month in monthlyRainfall) {
//     const water = monthlyRainfall[month] * roofArea * runoffCoeff; // liters if mm * m²
//     monthlyHarvest[month] = water;
//     annualHarvest += water;
//   }

//   return { monthlyHarvest, annualHarvest };
// };