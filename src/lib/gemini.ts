
import { supabase } from './supabase';
import type { OptimizationSuggestion, Prediction } from './supabase';

interface ProjectData {
  project: any;
  materials: any;
  labor: any;
  overhead: any;
  breakdown: any;
}

export const generatePrediction = async (projectData: ProjectData): Promise<Prediction | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-predict', {
      body: { projectData }
    });
    
    if (error) {
      throw new Error(error.message || 'Failed to generate prediction');
    }
    
    return data.prediction;
  } catch (error) {
    console.error('Error generating prediction:', error);
    return null;
  }
};

export const generateOptimizations = async (projectData: ProjectData): Promise<OptimizationSuggestion[] | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-optimize', {
      body: { projectData }
    });
    
    if (error) {
      throw new Error(error.message || 'Failed to generate optimizations');
    }
    
    return data.optimizations;
  } catch (error) {
    console.error('Error generating optimizations:', error);
    return null;
  }
};

export const savePredictionToDatabase = async (projectId: string, prediction: Prediction): Promise<void> => {
  try {
    const { error } = await supabase
      .from('project_predictions')
      .insert([
        {
          project_id: projectId,
          predicted_total: prediction.predicted_total,
          reasoning: prediction.reasoning,
          factors: prediction.factors,
          confidence_level: prediction.confidence_level
        }
      ]);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error saving prediction:', error);
    throw error;
  }
};

export const saveOptimizationsToDatabase = async (projectId: string, optimizations: OptimizationSuggestion[]): Promise<void> => {
  try {
    const optimizationsToInsert = optimizations.map(opt => ({
      project_id: projectId,
      title: opt.title,
      description: opt.description,
      category: opt.category,
      potential_savings: opt.potentialSavings,
      implementation_complexity: opt.implementationComplexity,
      time_impact: opt.timeImpact,
      quality_impact: opt.qualityImpact
    }));
    
    const { error } = await supabase
      .from('project_optimizations')
      .insert(optimizationsToInsert);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error saving optimizations:', error);
    throw error;
  }
};

// Calculate safe optimized total to ensure it never goes negative
export const calculateSafeOptimizedTotal = (originalTotal: number, potentialSavings: number): number => {
  // Ensure savings cannot exceed 75% of the original cost
  const maxAllowedSavings = originalTotal * 0.75;
  const safeSavings = Math.min(potentialSavings, maxAllowedSavings);
  return Math.max(originalTotal - safeSavings, originalTotal * 0.25);
};
