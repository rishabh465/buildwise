
import { supabase, ProjectDetail, MaterialCosts, LaborCosts, OverheadCosts } from './supabase';

export const getProjectById = async (projectId: string): Promise<ProjectDetail | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (error) throw error;
    return data as ProjectDetail;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

export const getProjectMaterials = async (projectId: string): Promise<MaterialCosts | null> => {
  try {
    const { data, error } = await supabase
      .from('project_materials')
      .select('*')
      .eq('project_id', projectId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, create default entry
        return createDefaultMaterials(projectId);
      }
      throw error;
    }
    
    return data as MaterialCosts;
  } catch (error) {
    console.error('Error fetching materials:', error);
    return null;
  }
};

export const getProjectLabor = async (projectId: string): Promise<LaborCosts | null> => {
  try {
    const { data, error } = await supabase
      .from('project_labor')
      .select('*')
      .eq('project_id', projectId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, create default entry
        return createDefaultLabor(projectId);
      }
      throw error;
    }
    
    return data as LaborCosts;
  } catch (error) {
    console.error('Error fetching labor:', error);
    return null;
  }
};

export const getProjectOverhead = async (projectId: string): Promise<OverheadCosts | null> => {
  try {
    const { data, error } = await supabase
      .from('project_overhead')
      .select('*')
      .eq('project_id', projectId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, create default entry
        return createDefaultOverhead(projectId);
      }
      throw error;
    }
    
    return data as OverheadCosts;
  } catch (error) {
    console.error('Error fetching overhead:', error);
    return null;
  }
};

export const createDefaultMaterials = async (projectId: string): Promise<MaterialCosts | null> => {
  try {
    const { data, error } = await supabase
      .from('project_materials')
      .insert([{ project_id: projectId }])
      .select()
      .single();
    
    if (error) throw error;
    return data as MaterialCosts;
  } catch (error) {
    console.error('Error creating default materials:', error);
    return null;
  }
};

export const createDefaultLabor = async (projectId: string): Promise<LaborCosts | null> => {
  try {
    const { data, error } = await supabase
      .from('project_labor')
      .insert([{ project_id: projectId }])
      .select()
      .single();
    
    if (error) throw error;
    return data as LaborCosts;
  } catch (error) {
    console.error('Error creating default labor:', error);
    return null;
  }
};

export const createDefaultOverhead = async (projectId: string): Promise<OverheadCosts | null> => {
  try {
    const { data, error } = await supabase
      .from('project_overhead')
      .insert([{ project_id: projectId }])
      .select()
      .single();
    
    if (error) throw error;
    return data as OverheadCosts;
  } catch (error) {
    console.error('Error creating default overhead:', error);
    return null;
  }
};

export const updateProject = async (projectId: string, data: Partial<ProjectDetail>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', projectId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const updateMaterials = async (projectId: string, data: Partial<MaterialCosts>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('project_materials')
      .update(data)
      .eq('project_id', projectId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating materials:', error);
    throw error;
  }
};

export const updateLabor = async (projectId: string, data: Partial<LaborCosts>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('project_labor')
      .update(data)
      .eq('project_id', projectId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating labor:', error);
    throw error;
  }
};

export const updateOverhead = async (projectId: string, data: Partial<OverheadCosts>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('project_overhead')
      .update(data)
      .eq('project_id', projectId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating overhead:', error);
    throw error;
  }
};
