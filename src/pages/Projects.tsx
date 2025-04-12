
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useEstimator } from '@/contexts/EstimatorContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  MonitorSmartphone,
  ArrowRight,
  Loader2,
  LayoutDashboard,
  PlusCircle,
  ClipboardEdit
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  construction_type: string;
  area: number;
  floors: number;
  created_at: string;
  updated_at: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadProject } = useEstimator();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your projects. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [user, navigate, toast]);

  const handleViewProject = async (projectId: string) => {
    try {
      await loadProject(projectId);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error loading project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load the project. Please try again.",
      });
    }
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/estimate/${projectId}`);
  };

  const handleNewProject = () => {
    navigate('/estimate');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container max-w-screen-xl px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground mt-2">
                View and manage all your construction projects
              </p>
            </div>
            
            <Button onClick={handleNewProject} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Project
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3">Loading projects...</span>
            </div>
          ) : projects.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Projects Yet</h3>
                <p className="text-center text-muted-foreground mb-6 max-w-md">
                  You haven't created any construction projects yet. Start by creating a new project and use our AI-powered cost estimator.
                </p>
                <Button onClick={handleNewProject} className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <div className="truncate">{project.name}</div>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.location || 'No location'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MonitorSmartphone className="h-4 w-4" />
                        <span>{project.construction_type || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(project.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Area</p>
                          <p className="font-medium">{project.area} sq.ft.</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Floors</p>
                          <p className="font-medium">{project.floors}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => handleEditProject(project.id)}
                    >
                      <ClipboardEdit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      className="w-full gap-2"
                      onClick={() => handleViewProject(project.id)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;
