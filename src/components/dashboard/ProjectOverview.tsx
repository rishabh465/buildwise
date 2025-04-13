import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEstimator } from '@/contexts/EstimatorContext';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const ProjectOverview: React.FC = () => {
  const navigate = useNavigate();
  const { state, formatCurrency } = useEstimator();
  const { toast } = useToast();
  
  const handleOptimize = () => {
    navigate('/optimize');
  };
  
  const handleSaveProject = async () => {
    try {
      if (!state.project.name) {
        toast({
          variant: "destructive",
          title: "Missing project name",
          description: "Please provide a project name before saving."
        });
        return;
      }
      
      // Insert project details into the database
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([{
          name: state.project.name,
          location: state.project.location,
          construction_type: state.project.constructionType,
          area: state.project.area,
          floors: state.project.floors,
          estimated_cost: state.breakdown?.total || 0
        }])
        .select();
      
      if (projectError) throw projectError;
      
      toast({
        title: "Project saved",
        description: "Your project has been saved successfully."
      });
      
      if (projectData && projectData[0]) {
        setTimeout(() => navigate(`/projects`), 1500);
      }
    } catch (error: any) {
      toast({
        variant: "destructive", 
        title: "Error saving project",
        description: error.message || "Failed to save the project"
      });
    }
  };
  
  return (
    <Card className="mb-8 shadow-md">
      <CardHeader>
        <CardTitle>Project Summary</CardTitle>
        <CardDescription>
          Overview of project details and total cost
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Project Name</p>
            <p className="font-medium">{state.project.name || 'Unnamed Project'}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{state.project.location || 'Not specified'}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Construction Type</p>
            <p className="font-medium">
              {state.project.constructionType ? 
                state.project.constructionType.charAt(0).toUpperCase() + state.project.constructionType.slice(1) : 
                'Not specified'}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Area</p>
            <p className="font-medium">{state.project.area} sq. ft.</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Number of Floors</p>
            <p className="font-medium">{state.project.floors}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="rounded-lg bg-muted p-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Estimated Cost</p>
              <h2 className="text-3xl font-bold">{formatCurrency(state.breakdown?.total || 0)}</h2>
              <p className="text-sm text-muted-foreground mt-2">Indian Rupees</p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-6 md:mt-0">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Materials</p>
                <p className="font-semibold">{formatCurrency(state.breakdown?.materials.total || 0)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {state.breakdown ? Math.round((state.breakdown.materials.total / state.breakdown.total) * 100) : 0}%
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Labor</p>
                <p className="font-semibold">{formatCurrency(state.breakdown?.labor.total || 0)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {state.breakdown ? Math.round((state.breakdown.labor.total / state.breakdown.total) * 100) : 0}%
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overhead</p>
                <p className="font-semibold">{formatCurrency(state.breakdown?.overhead.total || 0)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {state.breakdown ? Math.round((state.breakdown.overhead.total / state.breakdown.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
          <Button 
            variant="outline"
            onClick={handleOptimize}
            className="gap-2"
          >
            Cost Optimization <ArrowRight className="h-4 w-4" />
          </Button>
          
          {/* Remove the Save Project Button */}
          {/* 
          <Button
            onClick={handleSaveProject}
            className="gap-2"
          >
            Save Project
          </Button>
          */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectOverview;
