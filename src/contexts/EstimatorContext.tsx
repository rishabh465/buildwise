
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
      // Set loading state or notification
      toast({
        title: "Generating optimization",
        description: "Analyzing your project data with AI...",
      });
      
      // In a real implementation with Gemini, we would make an API call here
      // For this implementation, we'll simulate the AI response
      
      // Prepare prompt based on project details for Gemini
      const prompt = generateGeminiPrompt(state);
      
      // Log the prompt that would be sent to Gemini
      console.log("Gemini Prompt:", prompt);
      
      // Simulate AI processing time
      setTimeout(() => {
        // Generate AI-based optimization suggestions
        const suggestions = generateAIOptimizations(state);
        
        // Calculate potential savings and optimized total
        const potentialSavings = suggestions.reduce((total, suggestion) => total + suggestion.potentialSavings, 0);
        const optimizedTotal = state.breakdown.total - potentialSavings;

        const optimization: CostOptimization = {
          suggestions,
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
      }, 1500);

    } catch (error) {
      console.error("Error generating optimization:", error);
      
      toast({
        variant: "destructive",
        title: "Optimization Error",
        description: "Failed to generate optimization suggestions. Please try again.",
      });
    }
  };
  
  // Helper function to generate prompt for Gemini
  const generateGeminiPrompt = (state: EstimatorState): string => {
    const { project, materials, labor, overhead, breakdown } = state;
    
    // Create a structured prompt for Gemini
    return `
    As a construction cost optimization expert, analyze the following construction project details and suggest cost-saving measures:
    
    Project Name: ${project.name}
    Location: ${project.location}
    Construction Type: ${project.constructionType}
    Area: ${project.area} sq. ft.
    Floors: ${project.floors}
    
    Current Cost Breakdown:
    - Total Cost: ${breakdown ? formatCurrency(breakdown.total) : 'Not calculated'}
    - Materials: ${breakdown ? formatCurrency(breakdown.materials.total) : 'Not calculated'}
    - Labor: ${breakdown ? formatCurrency(breakdown.labor.total) : 'Not calculated'}
    - Overhead: ${breakdown ? formatCurrency(breakdown.overhead.total) : 'Not calculated'}
    
    Key Material Costs:
    - Cement: ${formatCurrency(materials.cement)}
    - Steel: ${formatCurrency(materials.steel)}
    - Bricks: ${formatCurrency(materials.bricks)}
    - Wood: ${formatCurrency(materials.wood)}
    
    Labor Costs:
    - Masons: ${formatCurrency(labor.masons)}
    - Carpenters: ${formatCurrency(labor.carpenters)}
    - Electricians: ${formatCurrency(labor.electricians)}
    - Plumbers: ${formatCurrency(labor.plumbers)}
    
    Please provide 5 specific cost optimization suggestions that could reduce the overall project cost. 
    For each suggestion:
    1. Provide a clear title
    2. Write a detailed description of the suggestion
    3. Estimate the potential savings in INR
    4. Rate the implementation complexity (low, medium, high)
    5. Assess the impact on project timeline (none, minimal, moderate, significant)
    6. Assess the impact on quality (none, minimal, moderate, significant)
    7. Categorize the suggestion (materials, labor, design, scheduling, procurement, other)
    `;
  };
  
  // Function to generate AI-based optimization suggestions
  const generateAIOptimizations = (state: EstimatorState): OptimizationSuggestion[] => {
    // In a real implementation, these would come from Gemini AI
    // For now, we'll generate smart suggestions based on the project data
    
    const suggestions: OptimizationSuggestion[] = [];
    const { materials, labor, overhead, breakdown } = state;
    
    // Only proceed if we have breakdown data
    if (!breakdown) return [];
    
    // Analyze cement costs
    if (materials.cement > 0) {
      suggestions.push({
        id: '1',
        category: 'materials',
        title: 'Optimize cement usage with alternative binders',
        description: 'Replace a portion of cement with fly ash or GGBS (Ground Granulated Blast-furnace Slag). These supplementary cementitious materials can reduce cement consumption by 20-30% while maintaining strength properties.',
        potentialSavings: materials.cement * 0.18,
        implementationComplexity: 'low',
        timeImpact: 'none',
        qualityImpact: 'minimal'
      });
    }
    
    // Analyze steel costs
    if (materials.steel > 0 && materials.steel > materials.cement) {
      suggestions.push({
        id: '2',
        category: 'design',
        title: 'Structural optimization for steel efficiency',
        description: 'Consider redesigning reinforcement layouts using BIM (Building Information Modeling) to optimize steel placement. Advanced structural analysis can reduce steel quantities by 10-15% without compromising strength.',
        potentialSavings: materials.steel * 0.12,
        implementationComplexity: 'medium',
        timeImpact: 'minimal',
        qualityImpact: 'none'
      });
    }
    
    // Analyze labor costs
    if (labor.helpers > 0 && labor.supervisors > 0) {
      suggestions.push({
        id: '3',
        category: 'labor',
        title: 'Optimize workforce scheduling and productivity',
        description: 'Implement lean construction techniques and daily task planning to improve labor productivity. By optimizing crew sizes and work sequences, labor costs can be reduced while maintaining the schedule.',
        potentialSavings: (labor.helpers + labor.supervisors) * 0.15,
        implementationComplexity: 'medium',
        timeImpact: 'none',
        qualityImpact: 'none'
      });
    }
    
    // Analyze procurement approach
    if ((materials.cement + materials.steel + materials.bricks) > 0) {
      suggestions.push({
        id: '4',
        category: 'procurement',
        title: 'Bulk material procurement strategy',
        description: 'Consolidate material orders and schedule deliveries to match construction phases. Negotiate bulk pricing with suppliers for major materials, potentially saving 7-10% on key materials.',
        potentialSavings: (materials.cement + materials.steel + materials.bricks) * 0.08,
        implementationComplexity: 'low',
        timeImpact: 'none',
        qualityImpact: 'none'
      });
    }
    
    // Analyze overhead costs
    if (overhead.equipment > 0) {
      suggestions.push({
        id: '5',
        category: 'other',
        title: 'Equipment sharing and rental optimization',
        description: 'Instead of full-time equipment rental, analyze usage patterns and schedule equipment only when needed. Consider sharing equipment between work zones or using smaller, more efficient machinery where appropriate.',
        potentialSavings: overhead.equipment * 0.22,
        implementationComplexity: 'low',
        timeImpact: 'minimal',
        qualityImpact: 'none'
      });
    }
    
    // If we have high design costs
    if (overhead.design > breakdown.total * 0.05) {
      suggestions.push({
        id: '6',
        category: 'design',
        title: 'Design standardization for repetitive elements',
        description: 'Standardize design elements that are repeated throughout the project, such as door/window sizes, bathroom layouts, or structural components. This reduces design time, material waste, and improves construction efficiency.',
        potentialSavings: overhead.design * 0.15,
        implementationComplexity: 'medium',
        timeImpact: 'minimal',
        qualityImpact: 'none'
      });
    }
    
    // Take the top 5 suggestions by potential savings
    return suggestions.sort((a, b) => b.potentialSavings - a.potentialSavings).slice(0, 5);
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
