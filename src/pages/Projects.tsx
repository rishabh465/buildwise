
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase, ProjectDetail } from '@/lib/supabase';
import { 
  PlusCircle, 
  Search, 
  Building, 
  MoreVertical, 
  Trash2, 
  Eye, 
  ArrowRight,
  BarChart4
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    location: '',
    constructionType: '',
    area: 0,
    floors: 1
  });
  
  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      setProjects(data as ProjectDetail[]);
    } catch (error: any) {
      toast({
        title: "Error loading projects",
        description: error.message || "Could not load your projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      setProjects(projects.filter(project => project.id !== projectId));
      
      toast({
        title: "Project deleted",
        description: "Your project has been successfully deleted."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message || "Could not delete the project",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateProject = async () => {
    try {
      if (!newProject.name || newProject.area <= 0) {
        throw new Error("Project name and area are required");
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name: newProject.name,
            location: newProject.location,
            construction_type: newProject.constructionType,
            area: newProject.area,
            floors: newProject.floors
          }
        ])
        .select();
      
      if (error) throw error;
      
      setProjects([data[0], ...projects]);
      
      toast({
        title: "Project created",
        description: "Your new project has been created successfully."
      });
      
      setDialogOpen(false);
      setNewProject({
        name: '',
        location: '',
        constructionType: '',
        area: 0,
        floors: 1
      });
      
      // Navigate to the estimate page for the new project
      navigate(`/estimate/${data[0].id}`);
      
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message || "Could not create the project",
        variant: "destructive"
      });
    }
  };
  
  const handleViewProject = (projectId: string) => {
    navigate(`/dashboard/${projectId}`);
  };
  
  const filteredProjects = projects.filter(project => 
    project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.construction_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const constructionTypes = [
    { value: 'residential', label: 'Residential Building' },
    { value: 'commercial', label: 'Commercial Building' },
    { value: 'industrial', label: 'Industrial Building' },
    { value: 'infrastructure', label: 'Infrastructure Project' },
    { value: 'institutional', label: 'Institutional Building' },
    { value: 'healthcare', label: 'Healthcare Facility' },
    { value: 'educational', label: 'Educational Institution' },
    { value: 'hospitality', label: 'Hospitality Project' }
  ];
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container max-w-screen-xl px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground mt-2">
                Manage and organize your construction cost estimation projects
              </p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" /> New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new construction project.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input 
                      id="project-name" 
                      placeholder="Enter project name" 
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="project-location">Location</Label>
                    <Input 
                      id="project-location" 
                      placeholder="Enter project location" 
                      value={newProject.location}
                      onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="construction-type">Construction Type</Label>
                    <Select 
                      value={newProject.constructionType}
                      onValueChange={(value) => setNewProject({...newProject, constructionType: value})}
                    >
                      <SelectTrigger id="construction-type">
                        <SelectValue placeholder="Select construction type" />
                      </SelectTrigger>
                      <SelectContent>
                        {constructionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-area">Area (sq. ft.)</Label>
                      <Input 
                        id="project-area" 
                        type="number" 
                        placeholder="Enter area"
                        value={newProject.area || ''}
                        onChange={(e) => setNewProject({...newProject, area: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-floors">Floors</Label>
                      <Input 
                        id="project-floors" 
                        type="number"
                        min="1" 
                        placeholder="Enter number of floors"
                        value={newProject.floors || ''}
                        onChange={(e) => setNewProject({...newProject, floors: parseInt(e.target.value) || 1})}
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreateProject}>Create Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mb-6 flex items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <CardDescription>
                        {project.location || 'No location specified'}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
                          <BarChart4 className="mr-2 h-4 w-4" />
                          <span>View Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          asChild
                        >
                          <Link to={`/estimate/${project.id}`} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Edit Details</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Type</span>
                        <span className="capitalize">{project.construction_type || 'Not specified'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Area</span>
                        <span>{project.area} sq. ft.</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Floors</span>
                        <span>{project.floors}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Created</span>
                        <span>{project.created_at ? format(new Date(project.created_at), 'dd MMM yyyy') : 'Unknown'}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full gap-2" onClick={() => handleViewProject(project.id)}>
                      <div>
                        View Dashboard <ArrowRight className="h-4 w-4" />
                      </div>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium">No projects found</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                {searchQuery ? 
                  "No projects match your search criteria. Try adjusting your search." : 
                  "You haven't created any projects yet. Click the button below to get started."
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setDialogOpen(true)} className="gap-2">
                  <PlusCircle className="h-4 w-4" /> Create Your First Project
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;
