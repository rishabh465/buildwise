
export interface ProjectDetails {
  name: string;
  location: string;
  currency: string;
  area: number;
  constructionType: string;
  floors: number;
}

export interface MaterialQuantities {
  sand: {
    type: string;
    amount: number;
  };
  cement: {
    type: string;
    amount: number;
  };
  aggregate: {
    type: string;
    amount: number;
  };
  steel: {
    type: string;
    amount: number;
  };
  bricks: {
    type: string;
    amount: number;
  };
  wood: {
    type: string;
    amount: number;
  };
  paint: {
    type: string;
    amount: number;
  };
  electrical: {
    components: string;
    complexity: string;
  };
  plumbing: {
    components: string;
    complexity: string;
  };
  fixtures: {
    type: string;
    count: number;
  };
  windows: {
    type: string;
    count: number;
  };
  doors: {
    type: string;
    count: number;
  };
  roofing: {
    type: string;
    area: number;
  };
  flooring: {
    type: string;
    area: number;
  };
  glasswork: {
    type: string;
    area: number;
  };
  tilesMarble: {
    type: string;
    area: number;
  };
}

export interface LaborDetails {
  masons: {
    count: number;
    days: number;
  };
  carpenters: {
    count: number;
    days: number;
  };
  painters: {
    count: number;
    days: number;
  };
  electricians: {
    count: number;
    days: number;
  };
  plumbers: {
    count: number;
    days: number;
  };
  helpers: {
    count: number;
    days: number;
  };
  supervisors: {
    count: number;
    days: number;
  };
}

export interface OverheadDetails {
  permits: {
    type: string;
    complexity: string;
  };
  design: {
    complexity: string;
    revisions: number;
  };
  insurance: {
    coverage: string;
    duration: number;
  };
  equipment: {
    type: string;
    duration: number;
  };
  transportation: {
    distance: number;
    frequency: number;
  };
  utilities: {
    type: string;
    duration: number;
  };
  sitePreparation: {
    complexity: string;
    area: number;
  };
  contingency: {
    percentage: number;
  };
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
  materialQuantities: MaterialQuantities;
  laborDetails: LaborDetails;
  overheadDetails: OverheadDetails;
  materials: MaterialCosts;
  labor: LaborCosts;
  overhead: OverheadCosts;
  breakdown: CostBreakdown | null;
  optimization: CostOptimization | null;
  isCalculated: boolean;
  isOptimized: boolean;
  errors: Record<string, string>;
}

export interface MaterialUnitCosts {
  [key: string]: {
    [key: string]: number;
  };
}

export interface LaborUnitCosts {
  [key: string]: number;
}

export interface OverheadUnitCosts {
  [key: string]: {
    [key: string]: number;
  };
}

export interface UnitCostDatabase {
  materials: MaterialUnitCosts;
  labor: LaborUnitCosts;
  overhead: OverheadUnitCosts;
}
