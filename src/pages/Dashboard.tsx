
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useEstimator } from '@/contexts/EstimatorContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
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
  ResponsiveContainer
} from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import { FileDown, AlertTriangle, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { state, formatCurrency, generateOptimization } = useEstimator();
  const { toast } = useToast();

  // Redirect if no breakdown data
  React.useEffect(() => {
    if (!state.breakdown) {
      toast({
        variant: "destructive",
        title: "No data available",
        description: "Please complete the estimation form first.",
      });
      navigate('/estimate');
    }
  }, [state.breakdown, navigate, toast]);

  if (!state.breakdown) {
    return null; // Avoid rendering if no breakdown data
  }

  // Prepare data for charts
  const pieData = [
    { name: 'Materials', value: state.breakdown.materials.total },
    { name: 'Labor', value: state.breakdown.labor.total },
    { name: 'Overhead', value: state.breakdown.overhead.total },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#6366f1'];

  const materialsData = Object.entries(state.breakdown.materials.items)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }));

  const laborData = Object.entries(state.breakdown.labor.items)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }));

  const overheadData = Object.entries(state.breakdown.overhead.items)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }));

  const handleOptimize = () => {
    navigate('/optimize');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container max-w-screen-xl px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Project Cost Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Detailed cost breakdown for {state.project.name || 'your project'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleOptimize} variant="outline" className="gap-2">
                Cost Optimization <ArrowRight className="h-4 w-4" />
              </Button>
              <Button asChild variant="default" className="gap-2">
                <Link to="/report">
                  <FileDown className="h-4 w-4" /> Download Report
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Project Summary Card */}
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>
                Overview of project details and total cost
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Project Name</p>
                  <p className="font-medium">{state.project.name || 'Unnamed Project'}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{state.project.location || 'Not specified'}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Construction Type</p>
                  <p className="font-medium">
                    {state.project.constructionType ? 
                      state.project.constructionType.charAt(0).toUpperCase() + state.project.constructionType.slice(1) : 
                      'Not specified'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="font-medium">{state.project.area} sq. ft.</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Number of Floors</p>
                  <p className="font-medium">{state.project.floors}</p>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="rounded-lg bg-muted p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Estimated Cost</p>
                    <h2 className="text-3xl font-bold">{formatCurrency(state.breakdown.total)}</h2>
                    <p className="text-sm text-muted-foreground mt-2">Indian Rupees</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-8 mt-6 md:mt-0">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Materials</p>
                      <p className="font-semibold">{formatCurrency(state.breakdown.materials.total)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((state.breakdown.materials.total / state.breakdown.total) * 100)}%
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Labor</p>
                      <p className="font-semibold">{formatCurrency(state.breakdown.labor.total)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((state.breakdown.labor.total / state.breakdown.total) * 100)}%
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Overhead</p>
                      <p className="font-semibold">{formatCurrency(state.breakdown.overhead.total)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((state.breakdown.overhead.total / state.breakdown.total) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Cost Breakdown Charts */}
          <Card className="shadow-md mb-8">
            <CardHeader>
              <CardTitle>Cost Distribution</CardTitle>
              <CardDescription>
                Visual breakdown of project costs by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-[400px] flex flex-col items-center justify-center">
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
                        fill="#8884d8"
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
                
                <div className="h-[400px] flex flex-col items-center justify-center">
                  <h3 className="text-lg font-medium mb-4">Cost Distribution by Category</h3>
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
                      <Bar dataKey="value" name="Amount" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Detailed Breakdown Tabs */}
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
                          {Object.entries(state.breakdown.materials.items)
                            .filter(([_, value]) => value > 0)
                            .sort(([_, a], [__, b]) => b - a) // Sort by value in descending order
                            .map(([key, value]) => (
                              <tr key={key} className="border-b hover:bg-muted/50">
                                <td className="p-3 capitalize">{key}</td>
                                <td className="p-3 text-right">{formatCurrency(value)}</td>
                                <td className="p-3 text-right">
                                  {((value / state.breakdown.materials.total) * 100).toFixed(1)}%
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
                    
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={materialsData}
                          layout="vertical"
                          margin={{
                            top: 20,
                            right: 30,
                            left: 60,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={120} />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Bar dataKey="value" name="Cost" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
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
                          {Object.entries(state.breakdown.labor.items)
                            .filter(([_, value]) => value > 0)
                            .sort(([_, a], [__, b]) => b - a)
                            .map(([key, value]) => (
                              <tr key={key} className="border-b hover:bg-muted/50">
                                <td className="p-3 capitalize">{key}</td>
                                <td className="p-3 text-right">{formatCurrency(value)}</td>
                                <td className="p-3 text-right">
                                  {((value / state.breakdown.labor.total) * 100).toFixed(1)}%
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
                    
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={laborData}
                          layout="vertical"
                          margin={{
                            top: 20,
                            right: 30,
                            left: 60,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={120} />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Bar dataKey="value" name="Cost" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
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
                          {Object.entries(state.breakdown.overhead.items)
                            .filter(([_, value]) => value > 0)
                            .sort(([_, a], [__, b]) => b - a)
                            .map(([key, value]) => (
                              <tr key={key} className="border-b hover:bg-muted/50">
                                <td className="p-3 capitalize">{key}</td>
                                <td className="p-3 text-right">{formatCurrency(value)}</td>
                                <td className="p-3 text-right">
                                  {((value / state.breakdown.overhead.total) * 100).toFixed(1)}%
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
                    
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={overheadData}
                          layout="vertical"
                          margin={{
                            top: 20,
                            right: 30,
                            left: 60,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={120} />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Bar dataKey="value" name="Cost" fill="#6366f1" />
                        </BarChart>
                      </ResponsiveContainer>
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
