
export interface ProjectDetails {
  name: string;
  location: string;
  currency: string;
  area: number;
  constructionType: string;
  floors: number;
}

export interface MaterialDetails {
  // Sand
  sandType: string;
  sandAmount: number;
  
  // Aggregate
  aggregateType: string;
  aggregateAmount: number;
  
  // Cement
  cementType: string;
  cementAmount: number;
  
  // Steel
  steelType: string;
  steelAmount: number;
  
  // Bricks
  brickType: string;
  brickAmount: number;
  
  // Wood
  woodType: string;
  woodAmount: number;
  
  // Paint
  paintType: string;
  paintAmount: number;
  
  // Electrical
  electricalFixtureType: string;
  electricalFixtureAmount: number;
  
  // Plumbing
  plumbingFixtureType: string;
  plumbingFixtureAmount: number;
  
  // Fixtures
  fixtureType: string;
  fixtureAmount: number;
  
  // Windows
  windowType: string;
  windowAmount: number;
  
  // Doors
  doorType: string;
  doorAmount: number;
  
  // Roofing
  roofingType: string;
  roofingAmount: number;
  
  // Flooring
  flooringType: string;
  flooringAmount: number;
  
  // Glasswork
  glassType: string;
  glassAmount: number;
  
  // Tiles/Marble
  tilesType: string;
  tilesAmount: number;
}

export interface LaborDetails {
  masons: number;
  carpenters: number;
  painters: number;
  electricians: number;
  plumbers: number;
  helpers: number;
  supervisors: number;
}

export interface OverheadDetails {
  permitType: string;
  designComplexity: string;
  insuranceType: string;
  equipmentNeeded: string[];
  transportationDistance: number;
  utilitiesEstimate: string;
  sitePreparationType: string;
  contingencyPercentage: number;
}

export interface MaterialCosts {
  cement: number;
  sand: number;
  aggregate: number;
  steel: number;
  bricks: number;
  wood: number;
  paint: number;
  electrical: number;
  plumbing: number;
  fixtures: number;
  windows: number;
  doors: number;
  roofing: number;
  flooring: number;
  glasswork: number;
  tilesMarble: number;
  miscellaneous: number;
}

export interface LaborCosts {
  masons: number;
  carpenters: number;
  painters: number;
  electricians: number;
  plumbers: number;
  helpers: number;
  supervisors: number;
}

export interface OverheadCosts {
  permits: number;
  design: number;
  insurance: number;
  equipment: number;
  transportation: number;
  utilities: number;
  sitePreparation: number;
  contingency: number;
}

export interface CostOptimization {
  suggestions: OptimizationSuggestion[];
  potentialSavings: number;
  optimizedTotal: number;
}

export interface OptimizationSuggestion {
  id: string;
  category: 'materials' | 'labor' | 'design' | 'scheduling' | 'procurement' | 'other';
  title: string;
  description: string;
  potentialSavings: number;
  implementationComplexity: 'low' | 'medium' | 'high';
  timeImpact: 'none' | 'minimal' | 'moderate' | 'significant';
  qualityImpact: 'none' | 'minimal' | 'moderate' | 'significant';
}

export interface CostBreakdown {
  materials: {
    total: number;
    items: Record<string, number>;
  };
  labor: {
    total: number;
    items: Record<string, number>;
  };
  overhead: {
    total: number;
    items: Record<string, number>;
  };
  total: number;
}

export interface EstimatorState {
  project: ProjectDetails;
  materials: MaterialDetails;
  labor: LaborDetails;
  overhead: OverheadDetails;
  breakdown: CostBreakdown | null;
  optimization: CostOptimization | null;
  isCalculated: boolean;
  isOptimized: boolean;
  errors: Record<string, string>;
}
