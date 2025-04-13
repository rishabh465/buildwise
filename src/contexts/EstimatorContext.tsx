import React, { createContext, useContext, useState } from 'react';
import { 
  EstimatorState, 
  ProjectDetails, 
  MaterialDetails,
  LaborDetails,
  OverheadDetails,
  CostBreakdown,
  CostOptimization,
  OptimizationSuggestion as AppOptimizationSuggestion
} from '@/types/estimator';
import { useToast } from '@/components/ui/use-toast';
import { calculateCostBreakdown } from '@/lib/costCalculator';
import { generateOptimizations, generatePrediction, savePredictionToDatabase, saveOptimizationsToDatabase, calculateSafeOptimizedTotal } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { OptimizationSuggestion as DBOptimizationSuggestion } from '@/lib/supabase';

const defaultProject: ProjectDetails = {
  name: '',
  location: '',
  currency: '₹',
  area: 0,
  constructionType: '',
  floors: 1
};

const defaultMaterials: MaterialDetails = {
  sandType: '',
  sandAmount: 0,
  aggregateType: '',
  aggregateAmount: 0,
  cementType: '',
  cementAmount: 0,
  steelType: '',
  steelAmount: 0,
  brickType: '',
  brickAmount: 0,
  woodType: '',
  woodAmount: 0,
  paintType: '',
  paintAmount: 0,
  electricalFixtureType: '',
  electricalFixtureAmount: 0,
  plumbingFixtureType: '',
  plumbingFixtureAmount: 0,
  fixtureType: '',
  fixtureAmount: 0,
  windowType: '',
  windowAmount: 0,
  doorType: '',
  doorAmount: 0,
  roofingType: '',
  roofingAmount: 0,
  flooringType: '',
  flooringAmount: 0,
  glassType: '',
  glassAmount: 0,
  tilesType: '',
  tilesAmount: 0
};

const defaultLabor: LaborDetails = {
  masons: 0,
  carpenters: 0,
  painters: 0,
  electricians: 0,
  plumbers: 0,
  helpers: 0,
  supervisors: 0
};

const defaultOverhead: OverheadDetails = {
  permitType: '',
  designComplexity: '',
  insuranceType: '',
  equipmentNeeded: [],
  transportationDistance: 0,
  utilitiesEstimate: '',
  sitePreparationType: '',
  contingencyPercentage: 5
};

interface EstimatorContextType {
  state: EstimatorState;
  currentProjectId: string | null;
  updateProject: (project: Partial<ProjectDetails>) => void;
  updateMaterials: (materials: Partial<MaterialDetails>) => void;
  updateLabor: (labor: Partial<LaborDetails>) => void;
  updateOverhead: (overhead: Partial<OverheadDetails>) => void;
  calculateCosts: () => void;
  generateOptimization: () => Promise<void>;
  resetEstimator: () => void;
  formatCurrency: (value: number) => string;
  saveAsProject: () => Promise<string | null>;
  loadProject: (projectId: string) => Promise<void>;
  setCurrentProjectId: (id: string | null) => void;
}

const EstimatorContext = createContext<EstimatorContextType | undefined>(undefined);

export const EstimatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  
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

  const updateMaterials = (materials: Partial<MaterialDetails>) => {
    setState((prev) => ({
      ...prev,
      materials: { ...prev.materials, ...materials },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const updateLabor = (labor: Partial<LaborDetails>) => {
    setState((prev) => ({
      ...prev,
      labor: { ...prev.labor, ...labor },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const updateOverhead = (overhead: Partial<OverheadDetails>) => {
    setState((prev) => ({
      ...prev,
      overhead: { ...prev.overhead, ...overhead },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const calculateCosts = () => {
    try {
      const breakdown = calculateCostBreakdown(
        state.project, 
        state.materials, 
        state.labor, 
        state.overhead
      );

      setState((prev) => ({
        ...prev,
        breakdown,
        isCalculated: true,
        errors: {}
      }));

      toast({
        title: "Cost calculation complete",
        description: `Total estimated cost: ${formatCurrency(breakdown.total)}`,
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

  const generateOptimization = async () => {
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
      
      // Call the AI service
      const dbOptimizations = await generateOptimizations({
        project: state.project,
        materials: state.materials,
        labor: state.labor,
        overhead: state.overhead,
        breakdown: state.breakdown
      });
      
      if (!dbOptimizations) {
        throw new Error("Failed to generate optimizations");
      }

      // Transform DB optimizations to app format
      const optimizations: AppOptimizationSuggestion[] = dbOptimizations.map(opt => ({
        id: opt.id,
        title: opt.title,
        description: opt.description,
        category: opt.category as any,
        potentialSavings: opt.potential_savings,
        implementationComplexity: opt.implementation_complexity as any,
        timeImpact: opt.time_impact as any,
        qualityImpact: opt.quality_impact as any
      }));

      // Calculate potential savings and optimized total
      const potentialSavings = optimizations.reduce((total, suggestion) => 
        total + suggestion.potentialSavings, 0);
      
      // Use safe calculation
      const optimizedTotal = calculateSafeOptimizedTotal(state.breakdown.total, potentialSavings);

      const optimization: CostOptimization = {
        suggestions: optimizations,
        potentialSavings,
        optimizedTotal
      };

      setState((prev) => ({
        ...prev,
        optimization,
        isOptimized: true
      }));

      // Save optimizations to the database if we have a project ID
      if (currentProjectId && user) {
        await saveOptimizationsToDatabase(currentProjectId, optimizations);
      }

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

  const saveAsProject = async (): Promise<string | null> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to save your project.",
      });
      return null;
    }

    if (!state.project.name) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Project name is required",
      });
      return null;
    }

    try {
      // First, insert the project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: state.project.name,
          location: state.project.location,
          currency: state.project.currency,
          construction_type: state.project.constructionType,
          area: state.project.area,
          floors: state.project.floors,
          user_id: user.id
        })
        .select('id')
        .single();

      if (projectError) throw projectError;
      
      const projectId = projectData.id;
      setCurrentProjectId(projectId);
      
      // Save the project's prediction if we have calculated costs
      if (state.breakdown) {
        const prediction = await generatePrediction({
          project: state.project,
          materials: state.materials,
          labor: state.labor,
          overhead: state.overhead,
          breakdown: state.breakdown
        });
        
        if (prediction) {
          await savePredictionToDatabase(projectId, prediction);
        }
      }
      
      // Save optimizations if they exist
      if (state.isOptimized && state.optimization) {
        await saveOptimizationsToDatabase(projectId, state.optimization.suggestions);
      }
      
      toast({
        title: "Project Saved",
        description: "Your project has been saved successfully.",
      });
      
      return projectId;
    } catch (error) {
      console.error("Error saving project:", error);
      
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Failed to save your project. Please try again.",
      });
      
      return null;
    }
  };

  const loadProject = async (projectId: string) => {
    try {
      setCurrentProjectId(projectId);
      
      // Get project details
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
        
      if (projectError) throw projectError;
      
      // Update state with project details
      updateProject({
        name: project.name,
        location: project.location,
        currency: project.currency,
        constructionType: project.construction_type,
        area: project.area,
        floors: project.floors
      });

      // For this version we'll load a previously saved calculation directly,
      // in the future we could load the detailed inputs for materials, labor, etc.
      
      // Get prediction
      const { data: prediction, error: predictionError } = await supabase
        .from('project_predictions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (!predictionError && prediction) {
        // Simulate a breakdown based on the prediction
        const total = prediction.predicted_total;
        const breakdown: CostBreakdown = {
          materials: {
            total: total * 0.6,
            items: {}
          },
          labor: {
            total: total * 0.3,
            items: {}
          },
          overhead: {
            total: total * 0.1,
            items: {}
          },
          total
        };
        
        setState(prev => ({
          ...prev,
          breakdown,
          isCalculated: true
        }));
      }
      
      // Get optimizations
      const { data: dbOptimizations, error: optimizationsError } = await supabase
        .from('project_optimizations')
        .select('*')
        .eq('project_id', projectId);
        
      if (!optimizationsError && dbOptimizations && dbOptimizations.length > 0) {
        // Transform DB optimizations to our app format
        const suggestions: AppOptimizationSuggestion[] = dbOptimizations.map(opt => ({
          id: opt.id,
          title: opt.title,
          description: opt.description,
          category: opt.category as any,
          potentialSavings: opt.potential_savings,
          implementationComplexity: opt.implementation_complexity as any,
          timeImpact: opt.time_impact as any,
          qualityImpact: opt.quality_impact as any
        }));
        
        const potentialSavings = suggestions.reduce((total, suggestion) => 
          total + suggestion.potentialSavings, 0);
          
        const optimizedTotal = calculateSafeOptimizedTotal(prediction?.predicted_total || 0, potentialSavings);
        
        setState(prev => ({
          ...prev,
          optimization: {
            suggestions,
            potentialSavings,
            optimizedTotal
          },
          isOptimized: true
        }));
      }
      
      toast({
        title: "Project Loaded",
        description: `Successfully loaded project: ${project.name}`,
      });
    } catch (error) {
      console.error("Error loading project:", error);
      
      toast({
        variant: "destructive",
        title: "Load Error",
        description: "Failed to load the project. Please try again.",
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

    setCurrentProjectId(null);

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
        currentProjectId,
        updateProject,
        updateMaterials,
        updateLabor,
        updateOverhead,
        calculateCosts,
        generateOptimization,
        resetEstimator,
        formatCurrency,
        saveAsProject,
        loadProject,
        setCurrentProjectId
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
