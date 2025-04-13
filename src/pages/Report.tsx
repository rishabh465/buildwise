import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DownloadIcon, FileTextIcon, AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Report = () => {
  const navigate = useNavigate();
  const { state, formatCurrency, downloadReportAsTxt } = useEstimator();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await downloadReportAsTxt();
    } catch (error) {
      console.error("Download initiated from Report page failed (this shouldn't normally happen):", error);
    }
    finally {
      setIsGenerating(false);
    }
  };
  
  const hasData = state.project && state.breakdown;
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container max-w-screen-xl px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Project Report</h1>
              <p className="text-muted-foreground mt-2">
                Detailed cost estimation report for {state.project.name || 'your project'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </Button>
              
              <Button 
                onClick={handleDownloadClick}
                disabled={!hasData || isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>Generating<span className="loading loading-spinner loading-xs"></span></>
                ) : (
                  <>
                    <FileTextIcon className="h-4 w-4" /> Download Report
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {!hasData ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>No data available</AlertTitle>
              <AlertDescription>
                Please fill out the estimation form first to generate a report.
                <div className="mt-4">
                  <Button onClick={() => navigate('/estimate')}>
                    Go to Estimator
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>Summary of project details and estimated costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Project Details</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Name:</dt>
                          <dd className="font-medium">{state.project.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Location:</dt>
                          <dd className="font-medium">{state.project.location}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Type:</dt>
                          <dd className="font-medium">{state.project.constructionType}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Area:</dt>
                          <dd className="font-medium">{state.project.area} sq. ft.</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Floors:</dt>
                          <dd className="font-medium">{state.project.floors}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Materials:</dt>
                          <dd className="font-medium">{formatCurrency(state.breakdown.materials.total)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Labor:</dt>
                          <dd className="font-medium">{formatCurrency(state.breakdown.labor.total)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Overhead:</dt>
                          <dd className="font-medium">{formatCurrency(state.breakdown.overhead.total)}</dd>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <dt className="font-medium">Total Estimated Cost:</dt>
                          <dd className="font-bold text-lg">{formatCurrency(state.breakdown.total)}</dd>
                        </div>
                        
                        {state.optimization && (
                          <>
                            <div className="flex justify-between pt-2 text-green-600">
                              <dt className="font-medium">Potential Savings:</dt>
                              <dd className="font-bold">{formatCurrency(state.optimization.potentialSavings)}</dd>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <dt className="font-medium">Optimized Total:</dt>
                              <dd className="font-bold">{formatCurrency(state.optimization.optimizedTotal)}</dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Breakdown</CardTitle>
                  <CardDescription>Itemized breakdown of all estimated costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Material Costs</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Cost</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(state.breakdown.materials.items).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="font-medium capitalize">{key}</TableCell>
                              <TableCell className="text-right">{formatCurrency(value as number)}</TableCell>
                              <TableCell className="text-right">
                                {((value as number) / state.breakdown.materials.total * 100).toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell className="font-bold">Total Materials</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(state.breakdown.materials.total)}</TableCell>
                            <TableCell className="text-right font-bold">
                              {((state.breakdown.materials.total / state.breakdown.total) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Labor Costs</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Cost</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(state.breakdown.labor.items).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="font-medium capitalize">{key}</TableCell>
                              <TableCell className="text-right">{formatCurrency(value as number)}</TableCell>
                              <TableCell className="text-right">
                                {((value as number) / state.breakdown.labor.total * 100).toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell className="font-bold">Total Labor</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(state.breakdown.labor.total)}</TableCell>
                            <TableCell className="text-right font-bold">
                              {((state.breakdown.labor.total / state.breakdown.total) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Overhead Costs</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Cost</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(state.breakdown.overhead.items).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="font-medium capitalize">{key}</TableCell>
                              <TableCell className="text-right">{formatCurrency(value as number)}</TableCell>
                              <TableCell className="text-right">
                                {((value as number) / state.breakdown.overhead.total * 100).toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell className="font-bold">Total Overhead</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(state.breakdown.overhead.total)}</TableCell>
                            <TableCell className="text-right font-bold">
                              {((state.breakdown.overhead.total / state.breakdown.total) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {state.optimization && (
                <Card>
                  <CardHeader>
                    <CardTitle>Optimization Recommendations</CardTitle>
                    <CardDescription>Cost-saving suggestions for your project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="p-4 border rounded-lg bg-muted/30">
                          <p className="text-sm text-muted-foreground">Potential Savings</p>
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(state.optimization.potentialSavings)}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-muted/30">
                          <p className="text-sm text-muted-foreground">Optimized Total</p>
                          <p className="text-2xl font-bold">{formatCurrency(state.optimization.optimizedTotal)}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-muted/30">
                          <p className="text-sm text-muted-foreground">Savings Percentage</p>
                          <p className="text-2xl font-bold text-green-600">
                            {((state.optimization.potentialSavings / state.breakdown.total) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Recommendations</h3>
                        {state.optimization.suggestions.map((suggestion, index) => (
                          <div key={suggestion.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-lg">{index + 1}. {suggestion.title}</h4>
                              <Badge variant="outline" className="capitalize">{suggestion.category}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{suggestion.description}</p>
                            <div className="flex flex-wrap gap-2 justify-between items-center">
                              <div>
                                <span className="text-sm text-muted-foreground mr-2">Potential Savings:</span>
                                <span className="font-medium text-green-600">{formatCurrency(suggestion.potentialSavings)}</span>
                              </div>
                              <div className="flex gap-3">
                                <Badge variant={suggestion.implementationComplexity === 'low' ? 'success' : 
                                  suggestion.implementationComplexity === 'medium' ? 'warning' : 'destructive'}>
                                  {suggestion.implementationComplexity} complexity
                                </Badge>
                                <Badge variant={suggestion.timeImpact === 'none' || suggestion.timeImpact === 'minimal' ? 'outline' : 'secondary'}>
                                  {suggestion.timeImpact} time impact
                                </Badge>
                                <Badge variant={suggestion.qualityImpact === 'none' || suggestion.qualityImpact === 'minimal' ? 'outline' : 'destructive'}>
                                  {suggestion.qualityImpact} quality impact
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Report;
