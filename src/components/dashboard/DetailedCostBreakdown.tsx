import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useEstimator } from '@/contexts/EstimatorContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Enhanced color palette
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#556FB5', '#F8CB2E', '#9B5DE5', 
  '#F15BB5', '#FEE440', '#00BBF9', '#00F5D4', '#9B89B3',
  '#845EC2', '#D65DB1', '#FF6F91', '#FF9671', '#FFC75F',
  '#2EC4B6', '#E84855', '#3185FC', '#35A7FF', '#8FB8ED'
];

const DetailedCostBreakdown: React.FC = () => {
  const navigate = useNavigate();
  const { state, formatCurrency } = useEstimator();
  
  const handleOptimize = () => {
    navigate('/optimize');
  };
  
  if (!state.breakdown) {
    return <div>No breakdown data available.</div>;
  }
  
  // Prepare data for charts
  const materialsData = Object.entries(state.breakdown.materials.items)
    .filter(([_, value]) => value > 0)
    .sort(([_, a], [__, b]) => b - a)
    .map(([key, value], index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      fill: COLORS[index % COLORS.length],
      percentage: ((value as number) / state.breakdown.materials.total) * 100
    }));
    
  const laborData = Object.entries(state.breakdown.labor.items)
    .filter(([_, value]) => value > 0)
    .sort(([_, a], [__, b]) => b - a)
    .map(([key, value], index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      fill: COLORS[(index + 5) % COLORS.length],
      percentage: ((value as number) / state.breakdown.labor.total) * 100
    }));
    
  const overheadData = Object.entries(state.breakdown.overhead.items)
    .filter(([_, value]) => value > 0)
    .sort(([_, a], [__, b]) => b - a)
    .map(([key, value], index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      fill: COLORS[(index + 10) % COLORS.length],
      percentage: ((value as number) / state.breakdown.overhead.total) * 100
    }));
  
  // Custom Tooltip for better visibility
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          <p className="intro" style={{ color: payload[0].payload.fill }}>
            {`${payload[0].name}: ${formatCurrency(payload[0].value)} (${payload[0].payload.percentage.toFixed(1)}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for Pie chart to prevent overlap
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = (percent * 100).toFixed(0);

    // Only show label if percentage is significant enough to avoid clutter
    if (percent < 0.05) return null; 

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {`${name} (${percentage}%)`}
      </text>
    );
  };

  return (
    <Card className="shadow-md mt-8">
      <CardHeader>
        <CardTitle>Detailed Cost Breakdown</CardTitle>
        <CardDescription>
          Explore the detailed breakdown of each cost category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="materials">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="labor">Labor</TabsTrigger>
            <TabsTrigger value="overhead">Overhead</TabsTrigger>
          </TabsList>
          
          <TabsContent value="materials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="overflow-auto max-h-[450px]">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-background z-10">
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Material</th>
                      <th className="text-right p-2 font-semibold">Cost</th>
                      <th className="text-right p-2 font-semibold">% of Materials</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialsData.map((item) => (
                      <tr key={item.name} className="border-b hover:bg-muted/50">
                        <td className="p-2 capitalize">{item.name}</td>
                        <td className="p-2 text-right">{formatCurrency(item.value as number)}</td>
                        <td className="p-2 text-right">
                          {item.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="sticky bottom-0 bg-background font-semibold">
                    <tr className="border-t-2">
                      <td className="p-2">Total</td>
                      <td className="p-2 text-right">{formatCurrency(state.breakdown.materials.total)}</td>
                      <td className="p-2 text-right">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="h-[450px]">
                <h4 className="font-medium mb-4 text-center">Material Costs Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={materialsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="value"
                      label={renderCustomizedLabel}
                    >
                      {materialsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="labor">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="overflow-auto max-h-[450px]">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-background z-10">
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Labor Type</th>
                      <th className="text-right p-2 font-semibold">Cost</th>
                      <th className="text-right p-2 font-semibold">% of Labor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laborData.map((item) => (
                      <tr key={item.name} className="border-b hover:bg-muted/50">
                        <td className="p-2 capitalize">{item.name}</td>
                        <td className="p-2 text-right">{formatCurrency(item.value as number)}</td>
                        <td className="p-2 text-right">
                          {item.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="sticky bottom-0 bg-background font-semibold">
                    <tr className="border-t-2">
                      <td className="p-2">Total</td>
                      <td className="p-2 text-right">{formatCurrency(state.breakdown.labor.total)}</td>
                      <td className="p-2 text-right">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="h-[450px]">
                <h4 className="font-medium mb-4 text-center">Labor Cost Comparison</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={laborData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Cost" stroke="#4ECDC4" activeDot={{ r: 8 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="overhead">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="overflow-auto max-h-[450px]">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-background z-10">
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Overhead Item</th>
                      <th className="text-right p-2 font-semibold">Cost</th>
                      <th className="text-right p-2 font-semibold">% of Overhead</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overheadData.map((item) => (
                      <tr key={item.name} className="border-b hover:bg-muted/50">
                        <td className="p-2 capitalize">{item.name}</td>
                        <td className="p-2 text-right">{formatCurrency(item.value as number)}</td>
                        <td className="p-2 text-right">
                          {item.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="sticky bottom-0 bg-background font-semibold">
                    <tr className="border-t-2">
                      <td className="p-2">Total</td>
                      <td className="p-2 text-right">{formatCurrency(state.breakdown.overhead.total)}</td>
                      <td className="p-2 text-right">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="h-[450px]">
                <h4 className="font-medium mb-4 text-center">Top Overhead Costs</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={overheadData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={formatCurrency} />
                    <YAxis type="category" dataKey="name" width={100} interval={0} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Cost">
                      {overheadData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 10) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      {state.isCalculated && !state.isOptimized && (
        <CardFooter className="justify-end border-t pt-4">
          <Button onClick={handleOptimize} className="gap-2">
            Optimize Costs <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DetailedCostBreakdown;
