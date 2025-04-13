import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEstimator } from '@/contexts/EstimatorContext';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar,
  Treemap,
  AreaChart,
  Area
} from 'recharts';

// Vibrant color palette
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#556FB5', '#F8CB2E', '#9B5DE5', 
  '#F15BB5', '#FEE440', '#00BBF9', '#00F5D4', '#9B89B3',
  '#845EC2', '#D65DB1', '#FF6F91', '#FF9671', '#FFC75F',
  '#2EC4B6', '#E84855', '#3185FC', '#35A7FF', '#8FB8ED'
];

const CostDistributionCharts: React.FC = () => {
  const { state, formatCurrency } = useEstimator();

  // Make sure we have data
  if (!state.breakdown) {
    return <div>No cost data available.</div>;
  }

  // Prepare data for charts
  const pieData = [
    { name: 'Materials', value: state.breakdown.materials.total },
    { name: 'Labor', value: state.breakdown.labor.total },
    { name: 'Overhead', value: state.breakdown.overhead.total },
  ];

  const materialsData = Object.entries(state.breakdown.materials.items)
    .filter(([_, value]) => value > 0)
    .map(([key, value], index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      fill: COLORS[index % COLORS.length]
    }));

  const laborData = Object.entries(state.breakdown.labor.items)
    .filter(([_, value]) => value > 0)
    .map(([key, value], index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      fill: COLORS[(index + 5) % COLORS.length]
    }));

  const overheadData = Object.entries(state.breakdown.overhead.items)
    .filter(([_, value]) => value > 0)
    .map(([key, value], index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      fill: COLORS[(index + 10) % COLORS.length]
    }));

  // Prepare data for the line chart comparing category costs
  const costByCategory = [
    { name: 'Materials', value: state.breakdown.materials.total },
    { name: 'Labor', value: state.breakdown.labor.total },
    { name: 'Overhead', value: state.breakdown.overhead.total },
  ];

  // Prepare data for the radar chart
  const topItems = [
    ...Object.entries(state.breakdown.materials.items)
      .filter(([_, value]) => value > 0)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([key, value]) => ({ name: `M: ${key}`, value, full: state.breakdown?.total || 1 })),
    ...Object.entries(state.breakdown.labor.items)
      .filter(([_, value]) => value > 0)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 2)
      .map(([key, value]) => ({ name: `L: ${key}`, value, full: state.breakdown?.total || 1 })),
    ...Object.entries(state.breakdown.overhead.items)
      .filter(([_, value]) => value > 0)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 2)
      .map(([key, value]) => ({ name: `O: ${key}`, value, full: state.breakdown?.total || 1 })),
  ];

  // Prepare data for the area chart
  const costBreakdownByPercentage = [
    { name: 'Project', materials: Math.round((state.breakdown.materials.total / state.breakdown.total) * 100), 
      labor: Math.round((state.breakdown.labor.total / state.breakdown.total) * 100),
      overhead: Math.round((state.breakdown.overhead.total / state.breakdown.total) * 100) }
  ];

  // Prepare data for the treemap
  const treemapData = [
    {
      name: 'Materials',
      children: Object.entries(state.breakdown.materials.items)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => ({
          name: key,
          size: value,
          value
        }))
    },
    {
      name: 'Labor',
      children: Object.entries(state.breakdown.labor.items)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => ({
          name: key,
          size: value,
          value
        }))
    },
    {
      name: 'Overhead',
      children: Object.entries(state.breakdown.overhead.items)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => ({
          name: key,
          size: value,
          value
        }))
    }
  ];

  // Combine and find top 5 items across all categories
  const allItems = [
    ...Object.entries(state.breakdown.materials.items).map(([name, value]) => ({ name: `Mat: ${name}`, value })),
    ...Object.entries(state.breakdown.labor.items).map(([name, value]) => ({ name: `Lab: ${name}`, value })),
    ...Object.entries(state.breakdown.overhead.items).map(([name, value]) => ({ name: `Ovh: ${name}`, value }))
  ];

  const topItemsData = allItems
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <CardTitle>Cost Distribution</CardTitle>
        <CardDescription>
          Visual breakdown of project costs by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="h-[350px] flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-4">Cost Distribution by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Bar Chart */}
          <div className="h-[350px] flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-4">Cost Comparison by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pieData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="value" name="Amount">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Line Chart */}
          <div className="h-[350px] flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-4">Cost Trend by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={costByCategory}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke={COLORS[15]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="h-[350px] flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-4">Top Cost Contributors</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topItems}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                <Radar name="Cost" dataKey="value" stroke={COLORS[3]} fill={COLORS[3]} fillOpacity={0.5} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Area Chart */}
          <div className="h-[350px] flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-4">Cost Distribution Percentage</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={costBreakdownByPercentage}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="materials" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} />
                <Area type="monotone" dataKey="labor" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} />
                <Area type="monotone" dataKey="overhead" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Horizontal Bar Chart for Top 5 Items */}
          <div className="h-[350px] flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-4">Top 5 Cost Items</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical" // Set layout to vertical for horizontal bars
                data={topItemsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 40, // Adjust left margin for labels
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value, true)} /> 
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} // Adjust width for longer labels
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                {/* No Legend needed for single bar */}
                <Bar dataKey="value" name="Cost" barSize={20}>
                  {topItemsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treemap Chart */}
        <div className="h-[400px] flex flex-col items-center justify-center mb-8">
          <h3 className="text-lg font-medium mb-4">Hierarchical Cost Structure</h3>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill={COLORS[0]}
            >
              {treemapData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostDistributionCharts;
