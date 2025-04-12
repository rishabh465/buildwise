
import {
  sandPrices, aggregatePrices, cementPrices, steelPrices, brickPrices,
  woodPrices, paintPrices, electricalFixturePrices, plumbingFixturePrices,
  fixturePrices, windowPrices, doorPrices, roofingPrices, flooringPrices,
  glassPrices, tilesPrices, laborRates, permitPrices, designPrices,
  insurancePrices, equipmentRates, transportationRatePerKm, utilitiesPrices,
  sitePreparationPrices
} from './pricingData';

import type { 
  MaterialDetails, LaborDetails, OverheadDetails, ProjectDetails,
  MaterialCosts, LaborCosts, OverheadCosts, CostBreakdown
} from '@/types/estimator';

// Calculate material costs from material details
export const calculateMaterialCosts = (materials: MaterialDetails): MaterialCosts => {
  return {
    sand: sandPrices[materials.sandType as keyof typeof sandPrices] * materials.sandAmount || 0,
    aggregate: aggregatePrices[materials.aggregateType as keyof typeof aggregatePrices] * materials.aggregateAmount || 0,
    cement: cementPrices[materials.cementType as keyof typeof cementPrices] * materials.cementAmount || 0,
    steel: steelPrices[materials.steelType as keyof typeof steelPrices] * materials.steelAmount || 0,
    bricks: brickPrices[materials.brickType as keyof typeof brickPrices] * materials.brickAmount / 1000 || 0,
    wood: woodPrices[materials.woodType as keyof typeof woodPrices] * materials.woodAmount || 0,
    paint: paintPrices[materials.paintType as keyof typeof paintPrices] * materials.paintAmount || 0,
    electrical: electricalFixturePrices[materials.electricalFixtureType as keyof typeof electricalFixturePrices] * materials.electricalFixtureAmount || 0,
    plumbing: plumbingFixturePrices[materials.plumbingFixtureType as keyof typeof plumbingFixturePrices] * materials.plumbingFixtureAmount || 0,
    fixtures: fixturePrices[materials.fixtureType as keyof typeof fixturePrices] * materials.fixtureAmount || 0,
    windows: windowPrices[materials.windowType as keyof typeof windowPrices] * materials.windowAmount || 0,
    doors: doorPrices[materials.doorType as keyof typeof doorPrices] * materials.doorAmount || 0,
    roofing: roofingPrices[materials.roofingType as keyof typeof roofingPrices] * materials.roofingAmount || 0,
    flooring: flooringPrices[materials.flooringType as keyof typeof flooringPrices] * materials.flooringAmount || 0,
    glasswork: glassPrices[materials.glassType as keyof typeof glassPrices] * materials.glassAmount || 0,
    tilesMarble: tilesPrices[materials.tilesType as keyof typeof tilesPrices] * materials.tilesAmount || 0,
    miscellaneous: 0 // Miscellaneous is set to 0 by default
  };
};

// Calculate labor costs from labor details
export const calculateLaborCosts = (labor: LaborDetails): LaborCosts => {
  // Calculate for 30 days (average project month)
  const daysInMonth = 30;
  
  return {
    masons: laborRates.mason * labor.masons * daysInMonth || 0,
    carpenters: laborRates.carpenter * labor.carpenters * daysInMonth || 0,
    painters: laborRates.painter * labor.painters * daysInMonth || 0,
    electricians: laborRates.electrician * labor.electricians * daysInMonth || 0,
    plumbers: laborRates.plumber * labor.plumbers * daysInMonth || 0,
    helpers: laborRates.helper * labor.helpers * daysInMonth || 0,
    supervisors: laborRates.supervisor * labor.supervisors * daysInMonth || 0
  };
};

// Calculate overhead costs from overhead details
export const calculateOverheadCosts = (overhead: OverheadDetails): OverheadCosts => {
  // Calculate equipment cost based on selected equipment
  const equipmentCost = overhead.equipmentNeeded.reduce((total, equipment) => {
    const rate = equipmentRates[equipment as keyof typeof equipmentRates] || 0;
    return total + rate * 30; // Assuming a month rental
  }, 0);

  return {
    permits: permitPrices[overhead.permitType as keyof typeof permitPrices] || 0,
    design: designPrices[overhead.designComplexity as keyof typeof designPrices] || 0,
    insurance: insurancePrices[overhead.insuranceType as keyof typeof insurancePrices] || 0,
    equipment: equipmentCost,
    transportation: transportationRatePerKm * overhead.transportationDistance || 0,
    utilities: utilitiesPrices[overhead.utilitiesEstimate as keyof typeof utilitiesPrices] || 0,
    sitePreparation: sitePreparationPrices[overhead.sitePreparationType as keyof typeof sitePreparationPrices] || 0,
    contingency: 0 // Will be calculated as percentage of total later
  };
};

// Calculate full cost breakdown
export const calculateCostBreakdown = (
  project: ProjectDetails,
  materials: MaterialDetails,
  labor: LaborDetails,
  overhead: OverheadDetails
): CostBreakdown => {
  // Calculate individual cost categories
  const materialCosts = calculateMaterialCosts(materials);
  const laborCosts = calculateLaborCosts(labor);
  const overheadCosts = calculateOverheadCosts(overhead);
  
  // Calculate totals for each category
  const materialTotal = Object.values(materialCosts).reduce((sum, cost) => sum + cost, 0);
  const laborTotal = Object.values(laborCosts).reduce((sum, cost) => sum + cost, 0);
  
  // Calculate subtotal before contingency
  const subtotal = materialTotal + laborTotal + (
    overheadCosts.permits + 
    overheadCosts.design + 
    overheadCosts.insurance +
    overheadCosts.equipment +
    overheadCosts.transportation +
    overheadCosts.utilities +
    overheadCosts.sitePreparation
  );
  
  // Calculate contingency based on percentage
  const contingency = subtotal * (overhead.contingencyPercentage / 100);
  overheadCosts.contingency = contingency;
  
  // Calculate overhead total with contingency
  const overheadTotal = Object.values(overheadCosts).reduce((sum, cost) => sum + cost, 0);
  
  // Calculate grand total
  const total = materialTotal + laborTotal + overheadTotal;
  
  return {
    materials: {
      total: materialTotal,
      items: materialCosts as unknown as Record<string, number>
    },
    labor: {
      total: laborTotal,
      items: laborCosts as unknown as Record<string, number>
    },
    overhead: {
      total: overheadTotal,
      items: overheadCosts as unknown as Record<string, number>
    },
    total
  };
};
