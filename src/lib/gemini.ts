
import { supabase } from './supabase';
import type { OptimizationSuggestion, Prediction } from './supabase';
import { dbToAppOptimization, appToDbOptimization } from './adapters';
import type { OptimizationSuggestion as AppOptimizationSuggestion } from '@/types/estimator';

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

export const generateOptimizations = async (projectData: ProjectData): Promise<AppOptimizationSuggestion[] | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-optimize', {
      body: { projectData }
    });
    
    if (error) {
      throw new Error(error.message || 'Failed to generate optimizations');
    }
    
    // Convert DB format to app format
    return data.optimizations.map(dbToAppOptimization);
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

export const saveOptimizationsToDatabase = async (projectId: string, optimizations: AppOptimizationSuggestion[]): Promise<void> => {
  try {
    const optimizationsToInsert = optimizations.map(opt => {
      const dbOpt = appToDbOptimization(opt);
      dbOpt.project_id = projectId;
      return dbOpt;
    });
    
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
