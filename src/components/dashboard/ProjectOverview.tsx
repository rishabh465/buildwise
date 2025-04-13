import React from 'react';
import { useEstimator } from '@/contexts/EstimatorContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

interface ProjectOverviewProps {
  projectId: string;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ projectId }) => {
  const { state, formatCurrency } = useEstimator();

  // Ensure breakdown is not null before accessing its properties
  if (!state.breakdown) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>
            A summary of your project costs will appear here once the estimate is calculated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>No data available. Please calculate the estimate first.</p>
        </CardContent>
      </Card>
    );
  }

  const { breakdown, optimization, project } = state;

  // Data for Cost Breakdown Pie Chart
  const pieChartData = [
    { name: 'Materials', value: breakdown.materials.total },
    { name: 'Labor', value: breakdown.labor.total },
    { name: 'Overhead', value: breakdown.overhead.total },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Data for Cost Trend Bar Chart (Dummy Data - Replace with actual data if available)
  const barChartData = [
    { name: 'Jan', materials: 2400, labor: 1398, overhead: 2210 },
    { name: 'Feb', materials: 2210, labor: 2900, overhead: 2210 },
    { name: 'Mar', materials: 2290, labor: 4800, overhead: 2210 },
    { name: 'Apr', materials: 2000, labor: 3908, overhead: 2210 },
    { name: 'May', materials: 2181, labor: 4800, overhead: 2210 },
    { name: 'Jun', materials: 2500, labor: 4300, overhead: 2210 },
    { name: 'Jul', materials: 2100, labor: 1398, overhead: 2210 },
    { name: 'Aug', materials: 2900, labor: 4800, overhead: 2210 },
    { name: 'Sep', materials: 2780, labor: 3908, overhead: 2210 },
    { name: 'Oct', materials: 1890, labor: 4800, overhead: 2210 },
    { name: 'Nov', materials: 2390, labor: 4300, overhead: 2210 },
    { name: 'Dec', materials: 3490, labor: 4300, overhead: 2210 },
  ];

  // Calculate percentage values for the progress bars
  const totalCost = breakdown.total;
  const materialsPercentage = (breakdown.materials.total / totalCost) * 100;
  const laborPercentage = (breakdown.labor.total / totalCost) * 100;
  const overheadPercentage = (breakdown.overhead.total / totalCost) * 100;

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Project Summary Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
          <CardDescription>Overview of key project details and costs</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Project Details</h3>
            <div className="space-y-1">
              <p>
                <strong>Name:</strong> {project.name}
              </p>
              <p>
                <strong>Location:</strong> {project.location}
              </p>
              <p>
                <strong>Area:</strong> {project.area} sq. ft.
              </p>
              <p>
                <strong>Construction Type:</strong> {project.constructionType}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Cost Estimate</h3>
            <div className="space-y-1">
              <p>
                <strong>Total Cost:</strong> {formatCurrency(breakdown.total)}
              </p>
              {optimization && (
                <>
                  <p>
                    <strong>Optimized Cost:</strong> {formatCurrency(optimization.optimizedTotal)}
                  </p>
                  <p>
                    <strong>Potential Savings:</strong> {formatCurrency(optimization.potentialSavings)}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>Distribution of costs across different categories</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cost Breakdown Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Materials</span>
                <span className="text-sm text-muted-foreground">{formatCurrency(breakdown.materials.total)}</span>
              </div>
              <Progress value={materialsPercentage} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Labor</span>
                <span className="text-sm text-muted-foreground">{formatCurrency(breakdown.labor.total)}</span>
              </div>
              <Progress value={laborPercentage} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overhead</span>
                <span className="text-sm text-muted-foreground">{formatCurrency(breakdown.overhead.total)}</span>
              </div>
              <Progress value={overheadPercentage} />
            </div>
          </div>

          {/* Cost Breakdown Pie Chart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={300} height={300}>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Trend Analysis Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Cost Trend Analysis</CardTitle>
          <CardDescription>Monthly cost variations for different categories</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Cost Trend Bar Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value: any) => formatCurrency(value)} />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="materials" name="Materials" fill="#8884d8" />
              <Bar dataKey="labor" name="Labor" fill="#82ca9d" />
              <Bar dataKey="overhead" name="Overhead" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Optimization Suggestions Card (Conditionally Rendered) */}
      {optimization && optimization.suggestions.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Optimization Suggestions</CardTitle>
            <CardDescription>AI-powered suggestions to reduce project costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {optimization.suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-md p-4">
                <h4 className="text-lg font-semibold">{suggestion.title}</h4>
                <p className="text-muted-foreground">{suggestion.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">Category: {suggestion.category}</Badge>
                  <Badge variant="secondary">Potential Savings: {formatCurrency(suggestion.potentialSavings)}</Badge>
                  <Badge variant="secondary">Complexity: {suggestion.implementationComplexity}</Badge>
                  <Badge variant="secondary">Time Impact: {suggestion.timeImpact}</Badge>
                  <Badge variant="secondary">Quality Impact: {suggestion.qualityImpact}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectOverview;
