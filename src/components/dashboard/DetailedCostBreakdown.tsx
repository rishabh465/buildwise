
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
  
  return (
    <Card className="shadow-md">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left p-3">Material</th>
                      <th className="text-right p-3">Cost</th>
                      <th className="text-right p-3">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialsData.map((item) => (
                      <tr key={item.name} className="border-b hover:bg-muted/50">
                        <td className="p-3 capitalize">{item.name}</td>
                        <td className="p-3 text-right">{formatCurrency(item.value as number)}</td>
                        <td className="p-3 text-right">
                          {item.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="sticky bottom-0 bg-background">
                    <tr className="font-bold">
                      <td className="p-3">Total</td>
                      <td className="p-3 text-right">{formatCurrency(state.breakdown.materials.total)}</td>
                      <td className="p-3 text-right">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Multiple visualization options */}
              <div className="space-y-8">
                <div className="h-[300px]">
                  <h4 className="font-medium mb-2 text-center">Material Costs Distribution</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={materialsData.slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {materialsData.slice(0, 5).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[300px]">
                  <h4 className="font-medium mb-2 text-center">Top Material Costs</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={materialsData.slice(0, 5)}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 60,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="value" name="Cost">
                        {materialsData.slice(0, 5).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="labor">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left p-3">Labor Type</th>
                      <th className="text-right p-3">Cost</th>
                      <th className="text-right p-3">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laborData.map((item) => (
                      <tr key={item.name} className="border-b hover:bg-muted/50">
                        <td className="p-3 capitalize">{item.name}</td>
                        <td className="p-3 text-right">{formatCurrency(item.value as number)}</td>
                        <td className="p-3 text-right">
                          {item.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="sticky bottom-0 bg-background">
                    <tr className="font-bold">
                      <td className="p-3">Total</td>
                      <td className="p-3 text-right">{formatCurrency(state.breakdown.labor.total)}</td>
                      <td className="p-3 text-right">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="space-y-8">
                <div className="h-[300px]">
                  <h4 className="font-medium mb-2 text-center">Labor Cost Profile</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={laborData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                      <Radar name="Labor Cost" dataKey="value" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.6} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[300px]">
                  <h4 className="font-medium mb-2 text-center">Labor Cost Comparison</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={laborData}
                      margin={{
                        top: 5,
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
                      <Line type="monotone" dataKey="value" stroke="#4ECDC4" activeDot={{ r: 8 }} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="overhead">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left p-3">Overhead Type</th>
                      <th className="text-right p-3">Cost</th>
                      <th className="text-right p-3">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overheadData.map((item) => (
                      <tr key={item.name} className="border-b hover:bg-muted/50">
                        <td className="p-3 capitalize">{item.name}</td>
                        <td className="p-3 text-right">{formatCurrency(item.value as number)}</td>
                        <td className="p-3 text-right">
                          {item.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="sticky bottom-0 bg-background">
                    <tr className="font-bold">
                      <td className="p-3">Total</td>
                      <td className="p-3 text-right">{formatCurrency(state.breakdown.overhead.total)}</td>
                      <td className="p-3 text-right">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="space-y-8">
                <div className="h-[300px]">
                  <h4 className="font-medium mb-2 text-center">Major Overhead Costs</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={overheadData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="value" name="Cost">
                        {overheadData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 10) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[300px]">
                  <h4 className="font-medium mb-2 text-center">Overhead Proportion</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overheadData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {overheadData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 10) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleOptimize} 
          className="w-full gap-2"
        >
          Generate Cost Optimization Suggestions <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DetailedCostBreakdown;
