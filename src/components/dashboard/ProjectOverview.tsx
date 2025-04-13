
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEstimator } from '@/contexts/EstimatorContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Save } from 'lucide-react';

// Color palette for charts
const COLORS = [
  '#8B5CF6', // Vivid Purple
  '#D946EF', // Magenta Pink
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#10B981', // Emerald Green
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#8B5CF6', // Violet
  '#22C55E', // Green
  '#EF4444', // Red
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const formatTooltipValue = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const ProjectOverview = () => {
  const { state, formatCurrency, saveAsProject, currentProjectId } = useEstimator();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSaveProject = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your project",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    const projectId = await saveAsProject();
    if (projectId) {
      toast({
        title: "Success",
        description: "Project saved successfully",
      });
    }
  };

  if (!state.breakdown) {
    return null;
  }
  
  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Materials', value: state.breakdown.materials.total },
    { name: 'Labor', value: state.breakdown.labor.total },
    { name: 'Overhead', value: state.breakdown.overhead.total },
  ];
  
  // Prepare data for material costs bar chart
  const materialItems = Object.entries(state.breakdown.materials.items)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Show only top 8 items
  
  // Prepare data for labor costs bar chart
  const laborItems = Object.entries(state.breakdown.labor.items)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value
    }))
    .sort((a, b) => b.value - a.value);
    
  // Prepare data for radar chart - normalized values
  const maxValue = Math.max(
    state.breakdown.materials.total, 
    state.breakdown.labor.total, 
    state.breakdown.overhead.total
  );
  
  const radarData = [
    {
      category: "Cost Distribution",
      Materials: (state.breakdown.materials.total / maxValue) * 100,
      Labor: (state.breakdown.labor.total / maxValue) * 100,
      Overhead: (state.breakdown.overhead.total / maxValue) * 100
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Cost Breakdown</h2>
        {!currentProjectId && (
          <Button 
            onClick={handleSaveProject} 
            variant="outline" 
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save as Project
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Total Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold mb-4">
                {formatCurrency(state.breakdown.total)}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Materials</p>
                  <p className="font-medium">{formatCurrency(state.breakdown.materials.total)}</p>
                  <p className="text-sm text-muted-foreground">
                    ({Math.round(state.breakdown.materials.total / state.breakdown.total * 100)}%)
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Labor</p>
                  <p className="font-medium">{formatCurrency(state.breakdown.labor.total)}</p>
                  <p className="text-sm text-muted-foreground">
                    ({Math.round(state.breakdown.labor.total / state.breakdown.total * 100)}%)
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Overhead</p>
                  <p className="font-medium">{formatCurrency(state.breakdown.overhead.total)}</p>
                  <p className="text-sm text-muted-foreground">
                    ({Math.round(state.breakdown.overhead.total / state.breakdown.total * 100)}%)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Material Cost Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={materialItems}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 65,
                }}
              >
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis />
                <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                <Legend />
                <Bar dataKey="value" name="Cost" fill="#8B5CF6">
                  {materialItems.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Labor Cost Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={laborItems}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                <Legend />
                <Bar dataKey="value" name="Cost" fill="#10B981">
                  {laborItems.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Cost Proportion Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Materials"
                  dataKey="Materials"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Labor"
                  dataKey="Labor"
                  stroke="#F97316"
                  fill="#F97316"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Overhead"
                  dataKey="Overhead"
                  stroke="#0EA5E9"
                  fill="#0EA5E9"
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {state.project.constructionType && (
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Project Name</p>
                <p className="font-medium">{state.project.name || "Unnamed Project"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{state.project.location || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Construction Type</p>
                <p className="font-medium">{state.project.constructionType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="font-medium">{state.project.area} sq.ft.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectOverview;
