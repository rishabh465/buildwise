
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimator } from '@/contexts/EstimatorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
  AreaChart, Area,
  ScatterChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap,
} from 'recharts';
import { Download, FileText, PieChart as PieChartIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
  '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FF595E',
  '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93', '#FF99C8'
];

const AREA_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

interface SaveProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, location: string) => Promise<void>;
}

const SaveProjectDialog = ({ open, onOpenChange, onSave }: SaveProjectDialogProps) => {
  const { state } = useEstimator();
  const [name, setName] = useState(state.project.name || '');
  const [location, setLocation] = useState(state.project.location || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(name, location);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Project</DialogTitle>
          <DialogDescription>
            Save this cost estimation as a project for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input 
              id="project-name" 
              placeholder="Enter project name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-location">Location</Label>
            <Input 
              id="project-location" 
              placeholder="Enter project location" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isSaving}>
            {isSaving ? 'Saving...' : 'Save Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProjectOverview = () => {
  const navigate = useNavigate();
  const { state, formatCurrency } = useEstimator();
  const { toast } = useToast();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  
  const materialData = Object.entries(state.breakdown?.materials.items || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number
  }));
  
  const laborData = Object.entries(state.breakdown?.labor.items || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number
  }));
  
  const overheadData = Object.entries(state.breakdown?.overhead.items || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number
  }));
  
  const categorySummary = [
    { name: 'Materials', value: state.breakdown?.materials.total || 0 },
    { name: 'Labor', value: state.breakdown?.labor.total || 0 },
    { name: 'Overhead', value: state.breakdown?.overhead.total || 0 }
  ];

  // Prepare data for area chart showing cost distribution over project phases
  const projectPhases = ['Planning', 'Foundation', 'Structure', 'Exterior', 'Interior', 'Finishing'];
  
  // Create simulated phase-wise distribution based on total costs
  const phaseCostData = projectPhases.map((phase, index) => {
    const totalCost = state.breakdown?.total || 0;
    const materialWeight = [0.1, 0.3, 0.25, 0.15, 0.15, 0.05][index];
    const laborWeight = [0.05, 0.25, 0.3, 0.15, 0.15, 0.1][index];
    const overheadWeight = [0.3, 0.2, 0.15, 0.1, 0.1, 0.15][index];
    
    return {
      name: phase,
      Materials: Math.round((state.breakdown?.materials.total || 0) * materialWeight),
      Labor: Math.round((state.breakdown?.labor.total || 0) * laborWeight),
      Overhead: Math.round((state.breakdown?.overhead.total || 0) * overheadWeight),
    };
  });

  // Prepare data for radar chart showing cost distribution by area
  const areaMetrics = [
    { subject: 'Foundation', A: Math.round((state.breakdown?.total || 0) * 0.15) },
    { subject: 'Structure', A: Math.round((state.breakdown?.total || 0) * 0.25) },
    { subject: 'Walls', A: Math.round((state.breakdown?.total || 0) * 0.15) },
    { subject: 'Roofing', A: Math.round((state.breakdown?.total || 0) * 0.1) },
    { subject: 'Plumbing', A: Math.round((state.breakdown?.total || 0) * 0.1) },
    { subject: 'Electrical', A: Math.round((state.breakdown?.total || 0) * 0.1) },
    { subject: 'Finishing', A: Math.round((state.breakdown?.total || 0) * 0.15) },
  ];

  // Treemap data
  const treemapData = [
    {
      name: 'Cost Distribution',
      children: [
        { 
          name: 'Materials', 
          children: materialData.map(item => ({ name: item.name, size: item.value }))
        },
        { 
          name: 'Labor', 
          children: laborData.map(item => ({ name: item.name, size: item.value }))
        },
        { 
          name: 'Overhead', 
          children: overheadData.map(item => ({ name: item.name, size: item.value }))
        }
      ]
    }
  ];

  // Handle navigation to different pages
  const handleViewReport = () => {
    navigate('/report');
  };

  const handleOptimize = () => {
    navigate('/optimize');
  };

  // Handle saving the project
  const handleSaveProject = async (name: string, location: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error('User not logged in');
      }

      const projectData = {
        name,
        location,
        construction_type: state.project.constructionType,
        area: state.project.area,
        floors: state.project.floors,
        currency: state.project.currency,
        user_id: userId
      };

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([projectData])
        .select('id')
        .single();

      if (projectError) throw projectError;
      
      toast({
        title: "Project saved successfully",
        description: "Your project has been saved to your account."
      });
      
      navigate(`/projects`);
      
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        variant: "destructive",
        title: "Error saving project",
        description: error.message || 'Failed to save project. Please try again.'
      });
    }
  };

  // Custom treemap content
  const CustomizedContent = ({ root, depth, x, y, width, height, index, name, colors }: any) => {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth < 2 ? colors[Math.floor(index / 3) % colors.length] : colors[index % colors.length],
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
          >
            {name}
          </text>
        )}
        {depth === 1 && (
          <text
            x={x + 4}
            y={y + 18}
            fill="#fff"
            fontSize={12}
            fillOpacity={0.9}
          >
            {index + 1}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Project Cost Dashboard</h2>
          <p className="text-muted-foreground">
            Detailed breakdown of estimated construction costs
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleViewReport} className="gap-2">
            <FileText className="h-4 w-4" /> View Report
          </Button>
          <Button onClick={handleOptimize} className="gap-2">
            Optimize Costs
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => setSaveDialogOpen(true)} 
            className="gap-2"
          >
            <Download className="h-4 w-4" /> Save as Project
          </Button>
        </div>
      </div>

      {/* Project Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(state.breakdown?.total || 0)}
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              Estimated cost based on all inputs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Cost per sq. ft.</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency((state.breakdown?.total || 0) / (state.project.area || 1))}
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              Based on {state.project.area} sq. ft. area
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span>{state.project.constructionType || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Floors:</span>
                <span>{state.project.floors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{state.project.location || 'Not specified'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Cost Category Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
          <TabsTrigger value="overhead">Overhead</TabsTrigger>
          <TabsTrigger value="phased">Phased View</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
                <CardDescription>Breakdown of project costs by category</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-full max-w-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySummary}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categorySummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Comparison</CardTitle>
                <CardDescription>Visual comparison of cost categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categorySummary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value / 1000}K`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="value" fill="#8884d8" name="Amount">
                        {categorySummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost by Area</CardTitle>
                <CardDescription>Distribution of costs across different construction areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={areaMetrics}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} tickFormatter={(value) => `₹${value / 1000}K`} />
                      <Radar name="Cost" dataKey="A" stroke="#FF6384" fill="#FF6384" fillOpacity={0.6} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Phase Costs</CardTitle>
                <CardDescription>Cost distribution across different project phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={phaseCostData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value / 1000}K`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Area type="monotone" dataKey="Materials" stackId="1" stroke="#FF6384" fill="#FF6384" />
                      <Area type="monotone" dataKey="Labor" stackId="1" stroke="#36A2EB" fill="#36A2EB" />
                      <Area type="monotone" dataKey="Overhead" stackId="1" stroke="#FFCE56" fill="#FFCE56" />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="materials" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Material Costs Distribution</CardTitle>
                <CardDescription>Breakdown of material expenses</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-full max-w-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={materialData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {materialData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Material Cost Comparison</CardTitle>
                <CardDescription>Comparison of material costs by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={materialData.sort((a, b) => b.value - a.value).slice(0, 10)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `₹${value / 1000}K`} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="value" name="Cost">
                        {materialData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="labor" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Labor Costs Distribution</CardTitle>
                <CardDescription>Breakdown of labor expenses</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-full max-w-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={laborData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {laborData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Labor Cost Comparison</CardTitle>
                <CardDescription>Comparison of labor costs by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={laborData.sort((a, b) => b.value - a.value)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `₹${value / 1000}K`} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="value" name="Cost">
                        {laborData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="overhead" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overhead Costs Distribution</CardTitle>
                <CardDescription>Breakdown of overhead expenses</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-full max-w-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overheadData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {overheadData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 6) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </P
                    ieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Overhead Cost Comparison</CardTitle>
                <CardDescription>Comparison of overhead costs by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={overheadData.sort((a, b) => b.value - a.value)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `₹${value / 1000}K`} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="value" name="Cost">
                        {overheadData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 6) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="phased" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution by Project Phase</CardTitle>
                <CardDescription>Cost breakdown across different construction phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={phaseCostData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value / 1000}K`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      {['Materials', 'Labor', 'Overhead'].map((key, index) => (
                        <Area 
                          key={key}
                          type="monotone" 
                          dataKey={key} 
                          stackId="1" 
                          stroke={AREA_COLORS[index % AREA_COLORS.length]} 
                          fill={AREA_COLORS[index % AREA_COLORS.length]}
                        />
                      ))}
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cumulative Cost Analysis</CardTitle>
                <CardDescription>Phased cumulative cost projection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={phaseCostData.map((phase, index, arr) => {
                        const cumulativeTotal = arr
                          .slice(0, index + 1)
                          .reduce((sum, p) => sum + p.Materials + p.Labor + p.Overhead, 0);
                        return {
                          name: phase.name,
                          'Cumulative Cost': cumulativeTotal,
                          'Phase Cost': phase.Materials + phase.Labor + phase.Overhead
                        };
                      })}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value / 1000}K`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line type="monotone" dataKey="Cumulative Cost" stroke="#FF6384" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="Phase Cost" stroke="#36A2EB" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hierarchical Cost Breakdown</CardTitle>
                <CardDescription>Detailed hierarchical view of all project costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={treemapData}
                      dataKey="size"
                      stroke="#fff"
                      fill="#8884d8"
                      content={<CustomizedContent colors={COLORS} />}
                    >
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </Treemap>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <SaveProjectDialog 
        open={saveDialogOpen} 
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveProject}
      />
    </div>
  );
};

export default ProjectOverview;
