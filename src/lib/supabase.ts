
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkdpwdaddcymcvclcczc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrZHB3ZGFkZGN5bWN2Y2xjY3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTQ1MzcsImV4cCI6MjA2MDAzMDUzN30.0wcx59ehCpZe9VNNuinJVGpyuQ2MBm5qf0PnhykSX9U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export type ProjectDetail = {
  id: string;
  name: string;
  location: string;
  currency: string;
  construction_type: string;
  area: number;
  floors: number;
  created_at: string;
  updated_at: string;
}

export type MaterialCosts = {
  id: string;
  project_id: string;
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
  tiles_marble: number;
  miscellaneous: number;
}

export type LaborCosts = {
  id: string;
  project_id: string;
  masons: number;
  carpenters: number;
  painters: number;
  electricians: number;
  plumbers: number;
  helpers: number;
  supervisors: number;
}

export type OverheadCosts = {
  id: string;
  project_id: string;
  permits: number;
  design: number;
  insurance: number;
  equipment: number;
  transportation: number;
  utilities: number;
  site_preparation: number;
  contingency: number;
}

export type Prediction = {
  id: string;
  project_id: string;
  predicted_total: number;
  reasoning: string;
  factors: string[];
  confidence_level: string;
  created_at: string;
}

export type OptimizationSuggestion = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  category: string;
  potential_savings: number;
  implementation_complexity: string;
  time_impact: string;
  quality_impact: string;
  created_at: string;
}
