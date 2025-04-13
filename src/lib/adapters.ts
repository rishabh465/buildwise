
import { OptimizationSuggestion as DBOptimizationSuggestion } from './supabase';
import { OptimizationSuggestion as AppOptimizationSuggestion } from '@/types/estimator';

/**
 * Converts database optimization suggestion to application format
 */
export function dbToAppOptimization(dbOpt: DBOptimizationSuggestion): AppOptimizationSuggestion {
  return {
    id: dbOpt.id,
    title: dbOpt.title,
    description: dbOpt.description,
    category: dbOpt.category as any,
    potentialSavings: dbOpt.potential_savings,
    implementationComplexity: dbOpt.implementation_complexity as any,
    timeImpact: dbOpt.time_impact as any,
    qualityImpact: dbOpt.quality_impact as any
  };
}

/**
 * Converts application optimization suggestion to database format
 */
export function appToDbOptimization(appOpt: AppOptimizationSuggestion): Omit<DBOptimizationSuggestion, 'id' | 'created_at'> {
  return {
    title: appOpt.title,
    description: appOpt.description,
    category: appOpt.category,
    potential_savings: appOpt.potentialSavings,
    implementation_complexity: appOpt.implementationComplexity,
    time_impact: appOpt.timeImpact,
    quality_impact: appOpt.qualityImpact,
    project_id: ''  // This will be set by the caller
  };
}
