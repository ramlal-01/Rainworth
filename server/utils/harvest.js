// Roof type → runoff coefficient
export const ROOF_RUNOFF = {
  Concrete: 0.85,
  Tile: 0.65,
  Sheet: 0.75
};

// Recommend structure based on annual harvest
export const STRUCTURE_OPTIONS = {
  smallTank: { type: "Storage Tank", cost: 15000 },
  mediumTank: { type: "Storage Tank", cost: 30000 },
  rechargeWell: { type: "Recharge Well", cost: 50000 }
};

export function recommendStructure(annualHarvest) {
  if (annualHarvest < 10000) return STRUCTURE_OPTIONS.smallTank;
  if (annualHarvest < 30000) return STRUCTURE_OPTIONS.mediumTank;
  return STRUCTURE_OPTIONS.rechargeWell;
}

// Calculate recharge frequency (tank 5000 L default)
export function calculateRechargeFrequency(annualHarvest, tankCapacity = 5000) {
  return Math.ceil(annualHarvest / tankCapacity);
}

// Calculate monthly & annual harvest
export function calculateHarvest(monthlyRainfall, roofArea, roofType) {
  const runoffCoeff = ROOF_RUNOFF[roofType] || 0.8;
  const monthlyHarvest = {};
  let annualHarvest = 0;

  for (let month in monthlyRainfall) {
    const water = monthlyRainfall[month] * roofArea * runoffCoeff;
    monthlyHarvest[month] = +water.toFixed(2);
    annualHarvest += water;
  }

  return { monthlyHarvest, annualHarvest, runoffCoeff };
}

// Calculate monthly & annual consumption
export const calculateConsumption = (numDwellers, dailyConsumptionPerPerson = 135) => {
  const daysInMonth = { JAN:31,FEB:28,MAR:31,APR:30,MAY:31,JUN:30,JUL:31,AUG:31,SEP:30,OCT:31,NOV:30,DEC:31 };
  const monthlyConsumption = {};
  let annualConsumption = 0;

  for (let month in daysInMonth) {
    const cons = numDwellers * dailyConsumptionPerPerson * daysInMonth[month];
    monthlyConsumption[month] = +cons.toFixed(2);
    annualConsumption += cons;
  }

  return { monthlyConsumption, annualConsumption };
};

// Calculate surplus water for recharge
export const calculateSurplus = (monthlyHarvest, monthlyConsumption) => {
  const monthlySurplus = {};
  let annualSurplus = 0;

  for (let month in monthlyHarvest) {
    const surplus = Math.max(0, monthlyHarvest[month] - monthlyConsumption[month]);
    monthlySurplus[month] = +surplus.toFixed(2);
    annualSurplus += surplus;
  }

  return { monthlySurplus, annualSurplus };
};
