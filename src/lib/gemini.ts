
import { supabase } from './supabase';
import type { OptimizationSuggestion as SupabaseOptimizationSuggestion, Prediction } from './supabase';
import type { OptimizationSuggestion as EstimatorOptimizationSuggestion } from '@/types/estimator';

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

export const generateOptimizations = async (projectData: ProjectData): Promise<EstimatorOptimizationSuggestion[] | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-optimize', {
      body: { projectData }
    });
    
    if (error) {
      throw new Error(error.message || 'Failed to generate optimizations');
    }
    
    // Convert from Supabase format to Estimator format
    const convertedOptimizations = data.optimizations.map((opt: SupabaseOptimizationSuggestion) => ({
      title: opt.title,
      description: opt.description,
      category: opt.category,
      potentialSavings: opt.potential_savings,
      implementationComplexity: opt.implementation_complexity,
      timeImpact: opt.time_impact,
      qualityImpact: opt.quality_impact
    }));
    
    return convertedOptimizations;
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

export const saveOptimizationsToDatabase = async (projectId: string, optimizations: EstimatorOptimizationSuggestion[]): Promise<void> => {
  try {
    // Convert from Estimator format to Supabase format
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
