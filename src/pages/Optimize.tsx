import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useEstimator } from '@/contexts/EstimatorContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowRightLeft,
  Lightbulb,
  BarChart3,
  FileDown,
  Loader2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const ComplexityBadge = ({ complexity }: { complexity: string }) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <Badge className={`${getComplexityColor(complexity)} font-normal`} variant="outline">
      {complexity.charAt(0).toUpperCase() + complexity.slice(1)} Complexity
    </Badge>
  );
};

const ImpactBadge = ({ impact, type }: { impact: string; type: 'time' | 'quality' }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'none':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'minimal':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'significant':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getIcon = (type: 'time' | 'quality', impact: string) => {
    if (type === 'time') {
      return impact === 'none' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />;
    } else {
      return impact === 'none' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />;
    }
  };

  const label = type === 'time' ? 'Schedule' : 'Quality';

  return (
    <Badge className={`${getImpactColor(impact)} font-normal flex items-center`} variant="outline">
      {getIcon(type, impact)}
      {impact.charAt(0).toUpperCase() + impact.slice(1)} {label} Impact
    </Badge>
  );
};

const Optimize = () => {
  const navigate = useNavigate();
  const { state, formatCurrency, generateOptimization } = useEstimator();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // Redirect if no cost breakdown
    if (!state.breakdown) {
      toast({
        variant: "destructive",
        title: "No cost data available",
        description: "Please complete the estimation form first.",
      });
      navigate('/estimate');
      return;
    }
    
    // Generate optimization if not already done
    if (!state.isOptimized && !loading) {
      setLoading(true);
      setTimeout(() => {
        generateOptimization();
        setLoading(false);
      }, 1500); // Simulated delay to show loading state
    }
  }, [state.breakdown, state.isOptimized, navigate, toast, generateOptimization]);

  if (!state.breakdown) {
    return null; // Don't render if no breakdown data
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container max-w-screen-xl px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Cost Optimization</h1>
              <p className="text-muted-foreground mt-2">
                AI-powered suggestions to reduce your project costs
              </p>
            </div>
            
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-semibold mb-2">Generating Optimization Suggestions</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Our AI is analyzing your project details to identify potential cost savings without compromising quality or timeline.
              </p>
              <Progress value={60} className="w-64 mb-2" />
              <p className="text-sm text-muted-foreground">This may take a moment...</p>
            </div>
          )}
          
          {/* Optimization Results */}
          {!loading && state.optimization && (
            <>
              {/* Summary Card */}
              <Card className="mb-8 shadow-md">
                <CardHeader>
                  <CardTitle>Cost Optimization Summary</CardTitle>
                  <CardDescription>
                    Potential savings from implementing optimization suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-lg bg-primary/10 p-6">
                      <p className="text-sm text-muted-foreground mb-2">Original Estimate</p>
                      <h2 className="text-2xl font-bold">{formatCurrency(state.breakdown.total)}</h2>
                    </div>
                    
                    <div className="rounded-lg bg-accent/10 p-6">
                      <p className="text-sm text-muted-foreground mb-2">Potential Savings</p>
                      <h2 className="text-2xl font-bold text-accent">
                        {formatCurrency(state.optimization.potentialSavings)}
                        <span className="text-base font-medium ml-2">
                          ({Math.round((state.optimization.potentialSavings / state.breakdown.total) * 100)}%)
                        </span>
                      </h2>
                    </div>
                    
                    <div className="rounded-lg bg-muted p-6">
                      <p className="text-sm text-muted-foreground mb-2">Optimized Estimate</p>
                      <h2 className="text-2xl font-bold">{formatCurrency(state.optimization.optimizedTotal)}</h2>
                    </div>
                  </div>
                  
                  <div className="mt-8 relative">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-primary to-accent h-4 rounded-full" 
                        style={{ 
                          width: `${Math.round((state.optimization.potentialSavings / state.breakdown.total) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>0% Savings</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Optimization Insight</p>
                        <p className="text-sm text-muted-foreground">
                          These suggestions are AI-generated based on your project details. Implementing these recommendations could potentially reduce your project cost without significant impact on quality or timeline.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Optimization Suggestions */}
              <div className="space-y-6 mb-8">
                <h2 className="text-2xl font-bold">Optimization Suggestions</h2>
                {state.optimization.suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{suggestion.title}</CardTitle>
                        <div className="text-lg font-bold text-accent">
                          {formatCurrency(suggestion.potentialSavings)}
                        </div>
                      </div>
                      <CardDescription className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="capitalize">
                          {suggestion.category}
                        </Badge>
                        <ComplexityBadge complexity={suggestion.implementationComplexity} />
                        <ImpactBadge impact={suggestion.timeImpact} type="time" />
                        <ImpactBadge impact={suggestion.qualityImpact} type="quality" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{suggestion.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <p className="text-sm text-muted-foreground">
                        {suggestion.implementationComplexity === 'low' ? 
                          'Easy to implement with minimal changes.' : 
                          suggestion.implementationComplexity === 'medium' ? 
                          'Requires moderate changes to plan or process.' : 
                          'Significant plan or design modifications required.'}
                      </p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Comparison Card */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Before & After Comparison</CardTitle>
                  <CardDescription>
                    Cost comparison between original and optimized estimates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="min-w-[20%] text-left">
                        <p className="text-sm text-muted-foreground">Category</p>
                      </div>
                      <div className="min-w-[35%] text-left">
                        <p className="text-sm text-muted-foreground">Original Cost</p>
                      </div>
                      <div className="min-w-[35%] text-left flex items-center">
                        <p className="text-sm text-muted-foreground">After Optimization</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Materials Row */}
                      <div className="flex items-center gap-4">
                        <div className="min-w-[20%]">
                          <p className="font-medium">Materials</p>
                        </div>
                        <div className="min-w-[35%]">
                          <div className="rounded-md bg-primary/10 py-2 px-4">
                            <p className="font-semibold">{formatCurrency(state.breakdown.materials.total)}</p>
                          </div>
                        </div>
                        <div className="min-w-[35%] flex items-center">
                          <ArrowRightLeft className="text-muted-foreground h-4 w-4 mr-2" />
                          <div className="rounded-md bg-accent/10 py-2 px-4 w-full">
                            <p className="font-semibold">
                              {formatCurrency(state.breakdown.materials.total - (
                                state.optimization.suggestions
                                  .filter(s => s.category === 'materials')
                                  .reduce((acc, curr) => acc + curr.potentialSavings, 0)
                              ))}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Labor Row */}
                      <div className="flex items-center gap-4">
                        <div className="min-w-[20%]">
                          <p className="font-medium">Labor</p>
                        </div>
                        <div className="min-w-[35%]">
                          <div className="rounded-md bg-primary/10 py-2 px-4">
                            <p className="font-semibold">{formatCurrency(state.breakdown.labor.total)}</p>
                          </div>
                        </div>
                        <div className="min-w-[35%] flex items-center">
                          <ArrowRightLeft className="text-muted-foreground h-4 w-4 mr-2" />
                          <div className="rounded-md bg-accent/10 py-2 px-4 w-full">
                            <p className="font-semibold">
                              {formatCurrency(state.breakdown.labor.total - (
                                state.optimization.suggestions
                                  .filter(s => s.category === 'labor')
                                  .reduce((acc, curr) => acc + curr.potentialSavings, 0)
                              ))}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Overhead Row */}
                      <div className="flex items-center gap-4">
                        <div className="min-w-[20%]">
                          <p className="font-medium">Overhead</p>
                        </div>
                        <div className="min-w-[35%]">
                          <div className="rounded-md bg-primary/10 py-2 px-4">
                            <p className="font-semibold">{formatCurrency(state.breakdown.overhead.total)}</p>
                          </div>
                        </div>
                        <div className="min-w-[35%] flex items-center">
                          <ArrowRightLeft className="text-muted-foreground h-4 w-4 mr-2" />
                          <div className="rounded-md bg-accent/10 py-2 px-4 w-full">
                            <p className="font-semibold">
                              {formatCurrency(state.breakdown.overhead.total - (
                                state.optimization.suggestions
                                  .filter(s => ['design', 'scheduling', 'procurement', 'other'].includes(s.category))
                                  .reduce((acc, curr) => acc + curr.potentialSavings, 0)
                              ))}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Total Row */}
                      <div className="flex items-center gap-4 border-t pt-4">
                        <div className="min-w-[20%]">
                          <p className="font-bold">Total</p>
                        </div>
                        <div className="min-w-[35%]">
                          <div className="rounded-md bg-primary/20 py-2 px-4">
                            <p className="font-bold">{formatCurrency(state.breakdown.total)}</p>
                          </div>
                        </div>
                        <div className="min-w-[35%] flex items-center">
                          <ArrowRightLeft className="text-muted-foreground h-4 w-4 mr-2" />
                          <div className="rounded-md bg-accent/20 py-2 px-4 w-full">
                            <p className="font-bold">{formatCurrency(state.optimization.optimizedTotal)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>

                </CardFooter>
              </Card>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Optimize;
