
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useEstimator } from '@/contexts/EstimatorContext';
import { useToast } from '@/components/ui/use-toast';
import { getProjectById } from '@/lib/projects';
import ProjectOverview from '@/components/dashboard/ProjectOverview';
import CostDistributionCharts from '@/components/dashboard/CostDistributionCharts';
import DetailedCostBreakdown from '@/components/dashboard/DetailedCostBreakdown';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { state, updateProject, calculateCosts } = useEstimator();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  // Load project data if projectId is provided
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        const projectData = await getProjectById(projectId);
        
        if (!projectData) {
          throw new Error("Project not found");
        }
        
        // Update the estimator state with the project details
        updateProject({
          name: projectData.name,
          location: projectData.location,
          constructionType: projectData.construction_type,
          area: projectData.area,
          floors: projectData.floors
        });
        
        // Calculate costs based on the loaded project details
        calculateCosts();
        
      } catch (error: any) {
        console.error("Error loading project:", error);
        toast({
          variant: "destructive",
          title: "Failed to load project",
          description: error.message || "Could not load the project details.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProjectData();
  }, [projectId, updateProject, toast, calculateCosts]);

  // Redirect if no breakdown data and not loading a project
  useEffect(() => {
    if (!state.breakdown && !loading && !projectId) {
      toast({
        variant: "destructive",
        title: "No data available",
        description: "Please complete the estimation form first.",
      });
      navigate('/estimate');
    }
  }, [state.breakdown, navigate, toast, loading, projectId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 py-10">
          <div className="container max-w-screen-xl px-4">
            <div className="mb-8">
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-6 w-96" />
            </div>
            
            <Skeleton className="h-[300px] w-full mb-8" />
            <Skeleton className="h-[400px] w-full mb-8" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  if (!state.breakdown) {
    return null; // Avoid rendering if no breakdown data and not loading
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container max-w-screen-xl px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Project Cost Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Detailed cost breakdown for {state.project.name || 'your project'}
              </p>
            </div>
          </div>
          
          <ProjectOverview />
          <CostDistributionCharts />
          <DetailedCostBreakdown />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
