
import React, { createContext, useContext, useState } from 'react';
import { 
  EstimatorState, 
  ProjectDetails, 
  MaterialCosts, 
  LaborCosts, 
  OverheadCosts,
  CostBreakdown,
  CostOptimization,
  OptimizationSuggestion
} from '@/types/estimator';
import { useToast } from '@/components/ui/use-toast';

// Default values
const defaultProject: ProjectDetails = {
  name: '',
  location: '',
  currency: '₹',
  area: 0,
  constructionType: '',
  floors: 1
};

const defaultMaterials: MaterialCosts = {
  cement: 0,
  sand: 0,
  aggregate: 0,
  steel: 0,
  bricks: 0,
  wood: 0,
  paint: 0,
  electrical: 0,
  plumbing: 0,
  fixtures: 0,
  windows: 0,
  doors: 0,
  roofing: 0,
  flooring: 0,
  glasswork: 0,
  tilesMarble: 0,
  miscellaneous: 0
};

const defaultLabor: LaborCosts = {
  masons: 0,
  carpenters: 0,
  painters: 0,
  electricians: 0,
  plumbers: 0,
  helpers: 0,
  supervisors: 0
};

const defaultOverhead: OverheadCosts = {
  permits: 0,
  design: 0,
  insurance: 0,
  equipment: 0,
  transportation: 0,
  utilities: 0,
  sitePreparation: 0,
  contingency: 0
};

interface EstimatorContextType {
  state: EstimatorState;
  updateProject: (project: Partial<ProjectDetails>) => void;
  updateMaterials: (materials: Partial<MaterialCosts>) => void;
  updateLabor: (labor: Partial<LaborCosts>) => void;
  updateOverhead: (overhead: Partial<OverheadCosts>) => void;
  calculateCosts: () => void;
  generateOptimization: () => void;
  resetEstimator: () => void;
  formatCurrency: (value: number) => string;
}

const EstimatorContext = createContext<EstimatorContextType | undefined>(undefined);

export const EstimatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const [state, setState] = useState<EstimatorState>({
    project: defaultProject,
    materials: defaultMaterials,
    labor: defaultLabor,
    overhead: defaultOverhead,
    breakdown: null,
    optimization: null,
    isCalculated: false,
    isOptimized: false,
    errors: {}
  });

  const updateProject = (project: Partial<ProjectDetails>) => {
    setState((prev) => ({
      ...prev,
      project: { ...prev.project, ...project },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const updateMaterials = (materials: Partial<MaterialCosts>) => {
    setState((prev) => ({
      ...prev,
      materials: { ...prev.materials, ...materials },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const updateLabor = (labor: Partial<LaborCosts>) => {
    setState((prev) => ({
      ...prev,
      labor: { ...prev.labor, ...labor },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const updateOverhead = (overhead: Partial<OverheadCosts>) => {
    setState((prev) => ({
      ...prev,
      overhead: { ...prev.overhead, ...overhead },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const calculateCosts = () => {
    try {
      // Calculate material costs
      let materialTotal = 0;
      const materialItems: Record<string, number> = {};
      
      Object.entries(state.materials).forEach(([key, value]) => {
        materialItems[key] = value;
        materialTotal += value;
      });

      // Calculate labor costs
      let laborTotal = 0;
      const laborItems: Record<string, number> = {};
      
      Object.entries(state.labor).forEach(([key, value]) => {
        laborItems[key] = value;
        laborTotal += value;
      });

      // Calculate overhead costs
      let overheadTotal = 0;
      const overheadItems: Record<string, number> = {};
      
      Object.entries(state.overhead).forEach(([key, value]) => {
        overheadItems[key] = value;
        overheadTotal += value;
      });

      // Calculate total cost
      const total = materialTotal + laborTotal + overheadTotal;

      const breakdown: CostBreakdown = {
        materials: {
          total: materialTotal,
          items: materialItems
        },
        labor: {
          total: laborTotal,
          items: laborItems
        },
        overhead: {
          total: overheadTotal,
          items: overheadItems
        },
        total
      };

      setState((prev) => ({
        ...prev,
        breakdown,
        isCalculated: true,
        errors: {}
      }));

      toast({
        title: "Cost calculation complete",
        description: `Total estimated cost: ${formatCurrency(total)}`,
      });

    } catch (error) {
      console.error("Error calculating costs:", error);
      
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: "Failed to calculate costs. Please check your inputs.",
      });

      setState((prev) => ({
        ...prev,
        errors: { 
          ...prev.errors, 
          calculation: 'Failed to calculate costs. Please check your inputs and try again.' 
        }
      }));
    }
  };

  const generateOptimization = () => {
    if (!state.breakdown) {
      toast({
        variant: "destructive",
        title: "Optimization Error",
        description: "Please calculate costs first before generating optimization suggestions.",
      });
      return;
    }

    try {
      // Mock API call to Gemini for optimization suggestions
      // In a real implementation, this would be an actual API call
      
      const mockSuggestions: OptimizationSuggestion[] = [
        {
          id: '1',
          category: 'materials',
          title: 'Alternative cement sourcing',
          description: 'Consider using PPC cement instead of OPC for non-critical components to save 15-20% on cement costs.',
          potentialSavings: state.breakdown.materials.items.cement * 0.15,
          implementationComplexity: 'low',
          timeImpact: 'none',
          qualityImpact: 'minimal'
        },
        {
          id: '2',
          category: 'materials',
          title: 'Local brick supplier',
          description: 'Source bricks from local manufacturers to reduce transportation costs and support local businesses.',
          potentialSavings: state.breakdown.materials.items.bricks * 0.10,
          implementationComplexity: 'low',
          timeImpact: 'none',
          qualityImpact: 'none'
        },
        {
          id: '3',
          category: 'labor',
          title: 'Optimize labor scheduling',
          description: 'Implement efficient work scheduling to minimize idle time and overtime costs.',
          potentialSavings: state.breakdown.labor.total * 0.08,
          implementationComplexity: 'medium',
          timeImpact: 'minimal',
          qualityImpact: 'none'
        },
        {
          id: '4',
          category: 'design',
          title: 'Structural optimization',
          description: 'Review structural designs to optimize steel usage without compromising safety.',
          potentialSavings: state.breakdown.materials.items.steel * 0.12,
          implementationComplexity: 'high',
          timeImpact: 'moderate',
          qualityImpact: 'minimal'
        },
        {
          id: '5',
          category: 'procurement',
          title: 'Bulk material purchase',
          description: 'Negotiate bulk rates for materials like cement, steel, and aggregates.',
          potentialSavings: (state.breakdown.materials.items.cement + state.breakdown.materials.items.steel + state.breakdown.materials.items.aggregate) * 0.07,
          implementationComplexity: 'medium',
          timeImpact: 'none',
          qualityImpact: 'none'
        }
      ];

      // Calculate potential savings and optimized total
      const potentialSavings = mockSuggestions.reduce((total, suggestion) => total + suggestion.potentialSavings, 0);
      const optimizedTotal = state.breakdown.total - potentialSavings;

      const optimization: CostOptimization = {
        suggestions: mockSuggestions,
        potentialSavings,
        optimizedTotal
      };

      setState((prev) => ({
        ...prev,
        optimization,
        isOptimized: true
      }));

      toast({
        title: "Optimization complete",
        description: `Potential savings identified: ${formatCurrency(potentialSavings)}`,
      });

    } catch (error) {
      console.error("Error generating optimization:", error);
      
      toast({
        variant: "destructive",
        title: "Optimization Error",
        description: "Failed to generate optimization suggestions. Please try again.",
      });
    }
  };

  const resetEstimator = () => {
    setState({
      project: defaultProject,
      materials: defaultMaterials,
      labor: defaultLabor,
      overhead: defaultOverhead,
      breakdown: null,
      optimization: null,
      isCalculated: false,
      isOptimized: false,
      errors: {}
    });

    toast({
      title: "Estimator reset",
      description: "All data has been cleared.",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <EstimatorContext.Provider
      value={{
        state,
        updateProject,
        updateMaterials,
        updateLabor,
        updateOverhead,
        calculateCosts,
        generateOptimization,
        resetEstimator,
        formatCurrency
      }}
    >
      {children}
    </EstimatorContext.Provider>
  );
};

export const useEstimator = () => {
  const context = useContext(EstimatorContext);
  if (context === undefined) {
    throw new Error('useEstimator must be used within an EstimatorProvider');
  }
  return context;
};
