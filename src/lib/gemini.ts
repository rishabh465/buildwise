
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
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to generate prediction');
    }
    
    if (!data || !data.prediction) {
      console.error('Invalid response from prediction function:', data);
      throw new Error('Failed to generate prediction: Invalid response format');
    }
    
    return data.prediction;
  } catch (error) {
    console.error('Error generating prediction:', error);
    return null;
  }
};

export const generateOptimizations = async (projectData: ProjectData): Promise<AppOptimizationSuggestion[] | null> => {
  try {
    // Add logging to track the request
    console.log('Sending optimization request with data:', JSON.stringify({
      project: projectData.project,
      breakdown: projectData.breakdown
    }));
    
    const { data, error } = await supabase.functions.invoke('gemini-optimize', {
      body: { projectData }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to generate optimizations');
    }
    
    if (!data || !data.optimizations) {
      console.error('Invalid response from optimization function:', data);
      
      // Generate fallback optimizations if the API fails
      return generateFallbackOptimizations(projectData);
    }
    
    // Convert DB format to app format
    return data.optimizations.map(dbToAppOptimization);
  } catch (error) {
    console.error('Error generating optimizations:', error);
    
    // Generate fallback optimizations on error
    return generateFallbackOptimizations(projectData);
  }
};

// Generate fallback optimization suggestions when the API fails
const generateFallbackOptimizations = (projectData: ProjectData): AppOptimizationSuggestion[] => {
  console.log('Generating fallback optimizations');
  
  const fallbackSuggestions: AppOptimizationSuggestion[] = [
    {
      id: "1",
      title: "Use alternative cement mixtures",
      description: "Replace up to 30% of cement with fly ash or slag to reduce cost while maintaining strength. This is an industry-proven approach that can save on material costs without compromising quality.",
      category: "materials",
      potentialSavings: Math.round(projectData.breakdown?.materials?.total * 0.08) || 50000,
      implementationComplexity: "low",
      timeImpact: "minimal",
      qualityImpact: "none"
    },
    {
      id: "2",
      title: "Optimize labor scheduling",
      description: "Implement just-in-time labor scheduling and reduce overlapping crews. Analyze the critical path of your project and schedule workers only when they're needed to reduce idle time and labor costs.",
      category: "labor",
      potentialSavings: Math.round(projectData.breakdown?.labor?.total * 0.12) || 75000,
      implementationComplexity: "medium",
      timeImpact: "minimal",
      qualityImpact: "none"
    },
    {
      id: "3",
      title: "Bulk material procurement",
      description: "Negotiate volume discounts by consolidating material orders across project phases. Work with suppliers to lock in favorable pricing in exchange for larger order quantities.",
      category: "procurement",
      potentialSavings: Math.round(projectData.breakdown?.materials?.total * 0.07) || 40000,
      implementationComplexity: "low",
      timeImpact: "none",
      qualityImpact: "none"
    },
    {
      id: "4",
      title: "Reduce equipment rental periods",
      description: "Analyze equipment usage patterns and schedule equipment only when needed, rather than for the entire project duration. Consider renting equipment only for specific phases.",
      category: "other",
      potentialSavings: Math.round(projectData.breakdown?.overhead?.total * 0.15) || 25000,
      implementationComplexity: "low",
      timeImpact: "none",
      qualityImpact: "none"
    },
    {
      id: "5",
      title: "Optimize structural design",
      description: "Review the structural design to identify areas where materials can be reduced without compromising safety or code compliance. Modern analysis tools can help identify over-designed elements.",
      category: "design",
      potentialSavings: Math.round(projectData.breakdown?.materials?.total * 0.09) || 60000,
      implementationComplexity: "high",
      timeImpact: "moderate",
      qualityImpact: "minimal"
    }
  ];
  
  return fallbackSuggestions;
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
