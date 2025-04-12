
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PlusCircle, Trash2, Edit, FileText, BarChart3, Briefcase } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  construction_type: string;
  area: number;
  floors: number;
  created_at: string;
  updated_at: string;
  currency: string;
}

const Projects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setSession(session);
      fetchProjects();
    };
    
    checkAuth();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      setProjects(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to load projects",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
      
      fetchProjects();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete project",
        description: error.message,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container max-w-screen-xl px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground mt-2">
                Manage your saved construction projects
              </p>
            </div>
            
            <Button onClick={() => navigate('/estimate')} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Project
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-center">
                <p>Loading your projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/50">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-medium">No projects yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    You haven't created any construction projects yet. Start by creating a new estimate.
                  </p>
                  <Button onClick={() => navigate('/estimate')} className="mt-4">
                    Create Your First Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl truncate">{project.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <span>Created {formatDate(project.created_at)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Location:</dt>
                        <dd className="font-medium">{project.location || "Not specified"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Type:</dt>
                        <dd className="font-medium capitalize">
                          {project.construction_type || "Not specified"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Area:</dt>
                        <dd className="font-medium">{project.area} sq. ft.</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Floors:</dt>
                        <dd className="font-medium">{project.floors}</dd>
                      </div>
                    </dl>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/dashboard/${project.id}`)}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/estimate/${project.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{project.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(project.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
