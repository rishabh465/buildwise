
export interface ProjectDetails {
  name: string;
  location: string;
  currency: string;
  area: number;
  constructionType: string;
  floors: number;
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
  materials: MaterialCosts;
  labor: LaborCosts;
  overhead: OverheadCosts;
  breakdown: CostBreakdown | null;
  optimization: CostOptimization | null;
  isCalculated: boolean;
  isOptimized: boolean;
  errors: Record<string, string>;
}
