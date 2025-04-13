
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEstimator } from '@/contexts/EstimatorContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, CartesianGrid, 
  ScatterChart, Scatter, ZAxis, LineChart, Line,
  Treemap, ComposedChart
} from 'recharts';
import { Save } from 'lucide-react';

// Enhanced color palette for charts
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

const EXTENDED_COLORS = [
  ...COLORS,
  '#3B82F6', // Blue
  '#06B6D4', // Cyan
  '#A855F7', // Purple
  '#DB2777', // Pink
  '#EA580C', // Orange
  '#16A34A', // Green
  '#CA8A04', // Yellow
  '#0369A1', // Sky
  '#4F46E5', // Indigo
  '#A21CAF', // Fuchsia
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

  // Generate time-series cost data for area chart
  const costProgressData = [
    { name: 'Planning', materials: state.breakdown.materials.total * 0.15, labor: state.breakdown.labor.total * 0.05, overhead: state.breakdown.overhead.total * 0.25 },
    { name: 'Foundation', materials: state.breakdown.materials.total * 0.25, labor: state.breakdown.labor.total * 0.15, overhead: state.breakdown.overhead.total * 0.15 },
    { name: 'Structure', materials: state.breakdown.materials.total * 0.30, labor: state.breakdown.labor.total * 0.25, overhead: state.breakdown.overhead.total * 0.15 },
    { name: 'Interior', materials: state.breakdown.materials.total * 0.20, labor: state.breakdown.labor.total * 0.30, overhead: state.breakdown.overhead.total * 0.20 },
    { name: 'Finishing', materials: state.breakdown.materials.total * 0.10, labor: state.breakdown.labor.total * 0.25, overhead: state.breakdown.overhead.total * 0.25 }
  ];

  // Generate scatter plot data for cost vs quality analysis
  const scatterData = [
    { category: 'Cement', cost: state.breakdown.materials.items.cement || 0, qualityIndex: 75, name: 'Cement' },
    { category: 'Steel', cost: state.breakdown.materials.items.steel || 0, qualityIndex: 85, name: 'Steel' },
    { category: 'Wood', cost: state.breakdown.materials.items.wood || 0, qualityIndex: 65, name: 'Wood' },
    { category: 'Paint', cost: state.breakdown.materials.items.paint || 0, qualityIndex: 60, name: 'Paint' },
    { category: 'Fixtures', cost: state.breakdown.materials.items.fixtures || 0, qualityIndex: 70, name: 'Fixtures' },
    { category: 'Electrical', cost: state.breakdown.materials.items.electrical || 0, qualityIndex: 80, name: 'Electrical' },
    { category: 'Plumbing', cost: state.breakdown.materials.items.plumbing || 0, qualityIndex: 78, name: 'Plumbing' },
  ];

  // Generate line chart data for cost trend analysis
  const costTrendData = [
    { month: 'Jan', materials: state.breakdown.materials.total * 0.05, labor: state.breakdown.labor.total * 0.03, overhead: state.breakdown.overhead.total * 0.02 },
    { month: 'Feb', materials: state.breakdown.materials.total * 0.10, labor: state.breakdown.labor.total * 0.08, overhead: state.breakdown.overhead.total * 0.09 },
    { month: 'Mar', materials: state.breakdown.materials.total * 0.18, labor: state.breakdown.labor.total * 0.15, overhead: state.breakdown.overhead.total * 0.15 },
    { month: 'Apr', materials: state.breakdown.materials.total * 0.25, labor: state.breakdown.labor.total * 0.22, overhead: state.breakdown.overhead.total * 0.22 },
    { month: 'May', materials: state.breakdown.materials.total * 0.35, labor: state.breakdown.labor.total * 0.30, overhead: state.breakdown.overhead.total * 0.28 },
    { month: 'Jun', materials: state.breakdown.materials.total * 0.42, labor: state.breakdown.labor.total * 0.40, overhead: state.breakdown.overhead.total * 0.35 },
  ];

  // Generate treemap data for cost breakdown by material category
  const treemapData = Object.entries(state.breakdown.materials.items)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value,
      color: EXTENDED_COLORS[Math.floor(Math.random() * EXTENDED_COLORS.length)]
    }));
    
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
                      <Cell key={`cell-${index}`} fill={EXTENDED_COLORS[index % EXTENDED_COLORS.length]} />
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
                    <Cell key={`cell-${index}`} fill={EXTENDED_COLORS[index % EXTENDED_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Project Timeline Cost Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={costProgressData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                <Area 
                  type="monotone" 
                  dataKey="materials" 
                  stackId="1" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  name="Materials" 
                />
                <Area 
                  type="monotone" 
                  dataKey="labor" 
                  stackId="1" 
                  stroke="#F97316" 
                  fill="#F97316" 
                  name="Labor" 
                />
                <Area 
                  type="monotone" 
                  dataKey="overhead" 
                  stackId="1" 
                  stroke="#0EA5E9" 
                  fill="#0EA5E9" 
                  name="Overhead" 
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Cost vs Quality Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid />
                <XAxis type="number" dataKey="qualityIndex" name="Quality Index" unit="%" />
                <YAxis type="number" dataKey="cost" name="Cost" />
                <ZAxis type="number" range={[100, 500]} />
                <Tooltip formatter={(value, name, props) => {
                  if (name === 'Quality Index') return `${value}%`;
                  return formatTooltipValue(value as number);
                }} />
                <Legend />
                <Scatter name="Materials" data={scatterData} fill="#8B5CF6">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXTENDED_COLORS[(index * 2) % EXTENDED_COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Monthly Cost Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={costTrendData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="materials" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  name="Materials"
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="labor" 
                  stroke="#F97316" 
                  strokeWidth={2} 
                  name="Labor" 
                />
                <Line 
                  type="monotone" 
                  dataKey="overhead" 
                  stroke="#0EA5E9" 
                  strokeWidth={2} 
                  name="Overhead" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Material Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={treemapData}
                dataKey="value"
                ratio={4/3}
                stroke="#fff"
                fill="#8884d8"
                content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
                  return (
                    <g>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        style={{
                          fill: treemapData[index]?.color || EXTENDED_COLORS[index % EXTENDED_COLORS.length],
                          stroke: '#fff',
                          strokeWidth: 2 / (depth + 1e-10),
                          strokeOpacity: 1 / (depth + 1e-10),
                        }}
                      />
                      {depth === 1 && (
                        <text
                          x={x + width / 2}
                          y={y + height / 2}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize={12}
                        >
                          {name}
                        </text>
                      )}
                    </g>
                  );
                }}
              >
                <Tooltip 
                  formatter={(value: number) => formatTooltipValue(value)} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border p-2 rounded-md shadow-md">
                          <p className="font-medium">{payload[0].payload.name}</p>
                          <p>{formatTooltipValue(payload[0].value as number)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </Treemap>
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
                    <Cell key={`cell-${index}`} fill={EXTENDED_COLORS[(index + 3) % EXTENDED_COLORS.length]} />
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
