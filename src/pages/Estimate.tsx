
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useEstimator } from '@/contexts/EstimatorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Estimate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    state,
    updateProject,
    updateMaterialQuantities,
    updateLaborDetails,
    updateOverheadDetails,
    calculateCosts,
    getMaterialOptions,
    getComplexityOptions,
  } = useEstimator();
  
  const [currentTab, setCurrentTab] = useState('project');

  const handleCalculate = () => {
    // Validate inputs
    if (state.project.name.trim() === '') {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Project name is required",
      });
      return;
    }
    
    if (state.project.area <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Project area must be greater than zero",
      });
      return;
    }
    
    if (state.project.constructionType === '') {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Construction type is required",
      });
      return;
    }
    
    // Calculate costs
    calculateCosts();
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const constructionTypes = [
    { value: 'residential', label: 'Residential Building' },
    { value: 'commercial', label: 'Commercial Building' },
    { value: 'industrial', label: 'Industrial Building' },
    { value: 'infrastructure', label: 'Infrastructure Project' },
  ];

  const handleMaterialTypeChange = (material: string, value: string) => {
    updateMaterialQuantities({
      [material]: {
        ...state.materialQuantities[material as keyof typeof state.materialQuantities],
        type: value
      }
    } as any);
  };

  const handleMaterialAmountChange = (material: string, value: number) => {
    updateMaterialQuantities({
      [material]: {
        ...state.materialQuantities[material as keyof typeof state.materialQuantities],
        amount: value
      }
    } as any);
  };

  const handleMaterialCountChange = (material: string, value: number) => {
    updateMaterialQuantities({
      [material]: {
        ...state.materialQuantities[material as keyof typeof state.materialQuantities],
        count: value
      }
    } as any);
  };

  const handleMaterialAreaChange = (material: string, value: number) => {
    updateMaterialQuantities({
      [material]: {
        ...state.materialQuantities[material as keyof typeof state.materialQuantities],
        area: value
      }
    } as any);
  };

  const handleComponentsChange = (material: string, value: string) => {
    updateMaterialQuantities({
      [material]: {
        ...state.materialQuantities[material as keyof typeof state.materialQuantities],
        components: value
      }
    } as any);
  };

  const handleComplexityChange = (material: string, value: string) => {
    updateMaterialQuantities({
      [material]: {
        ...state.materialQuantities[material as keyof typeof state.materialQuantities],
        complexity: value
      }
    } as any);
  };

  const handleLaborCountChange = (labor: string, value: number) => {
    updateLaborDetails({
      [labor]: {
        ...state.laborDetails[labor as keyof typeof state.laborDetails],
        count: value
      }
    } as any);
  };

  const handleLaborDaysChange = (labor: string, value: number) => {
    updateLaborDetails({
      [labor]: {
        ...state.laborDetails[labor as keyof typeof state.laborDetails],
        days: value
      }
    } as any);
  };

  const handleOverheadTypeChange = (overhead: string, value: string) => {
    updateOverheadDetails({
      [overhead]: {
        ...state.overheadDetails[overhead as keyof typeof state.overheadDetails],
        type: value
      }
    } as any);
  };

  const handleOverheadComplexityChange = (overhead: string, value: string) => {
    updateOverheadDetails({
      [overhead]: {
        ...state.overheadDetails[overhead as keyof typeof state.overheadDetails],
        complexity: value
      }
    } as any);
  };

  const handleOverheadRevisionsChange = (value: number) => {
    updateOverheadDetails({
      design: {
        ...state.overheadDetails.design,
        revisions: value
      }
    });
  };

  const handleOverheadCoverageChange = (value: string) => {
    updateOverheadDetails({
      insurance: {
        ...state.overheadDetails.insurance,
        coverage: value
      }
    });
  };

  const handleOverheadDurationChange = (overhead: string, value: number) => {
    updateOverheadDetails({
      [overhead]: {
        ...state.overheadDetails[overhead as keyof typeof state.overheadDetails],
        duration: value
      }
    } as any);
  };

  const handleOverheadDistanceChange = (value: number) => {
    updateOverheadDetails({
      transportation: {
        ...state.overheadDetails.transportation,
        distance: value
      }
    });
  };

  const handleOverheadFrequencyChange = (value: number) => {
    updateOverheadDetails({
      transportation: {
        ...state.overheadDetails.transportation,
        frequency: value
      }
    });
  };

  const handleOverheadAreaChange = (value: number) => {
    updateOverheadDetails({
      sitePreparation: {
        ...state.overheadDetails.sitePreparation,
        area: value
      }
    });
  };

  const handleContingencyChange = (value: number) => {
    updateOverheadDetails({
      contingency: {
        percentage: value
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container max-w-screen-xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Construction Cost Estimator</h1>
            <p className="text-muted-foreground mt-2">
              Enter project details to calculate construction costs
            </p>
          </div>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Project Parameters</CardTitle>
              <CardDescription>
                Fill in the details below to estimate the cost of your construction project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="project">Project Details</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="labor">Labor</TabsTrigger>
                  <TabsTrigger value="overhead">Overhead</TabsTrigger>
                </TabsList>
                
                <TabsContent value="project" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input 
                        id="project-name"
                        placeholder="Enter project name"
                        value={state.project.name}
                        onChange={(e) => updateProject({ name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-location">Location</Label>
                      <Input 
                        id="project-location"
                        placeholder="Enter project location"
                        value={state.project.location}
                        onChange={(e) => updateProject({ location: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-area">Project Area (sq. ft.)</Label>
                      <Input 
                        id="project-area"
                        type="number"
                        placeholder="Enter area in square feet"
                        value={state.project.area || ''}
                        onChange={(e) => updateProject({ area: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-floors">Number of Floors</Label>
                      <Input 
                        id="project-floors"
                        type="number"
                        min="1"
                        placeholder="Enter number of floors"
                        value={state.project.floors || ''}
                        onChange={(e) => updateProject({ floors: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="construction-type">Construction Type</Label>
                      <Select 
                        value={state.project.constructionType}
                        onValueChange={(value) => updateProject({ constructionType: value })}
                      >
                        <SelectTrigger id="construction-type">
                          <SelectValue placeholder="Select construction type" />
                        </SelectTrigger>
                        <SelectContent>
                          {constructionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-currency">Currency</Label>
                      <Input 
                        id="project-currency"
                        value="₹ (INR)"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setCurrentTab('materials')}>
                      Next: Materials
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="materials" className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Basic Materials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cement */}
                    <div className="space-y-4">
                      <Label>Cement</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="cement-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.cement.type}
                            onValueChange={(value) => handleMaterialTypeChange('cement', value)}
                          >
                            <SelectTrigger id="cement-type">
                              <SelectValue placeholder="Select cement type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('cement').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cement-amount" className="text-sm text-muted-foreground">Amount (bags)</Label>
                          <Input 
                            id="cement-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={state.materialQuantities.cement.amount || ''}
                            onChange={(e) => handleMaterialAmountChange('cement', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sand */}
                    <div className="space-y-4">
                      <Label>Sand</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="sand-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.sand.type}
                            onValueChange={(value) => handleMaterialTypeChange('sand', value)}
                          >
                            <SelectTrigger id="sand-type">
                              <SelectValue placeholder="Select sand type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('sand').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sand-amount" className="text-sm text-muted-foreground">Amount (cubic meters)</Label>
                          <Input 
                            id="sand-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={state.materialQuantities.sand.amount || ''}
                            onChange={(e) => handleMaterialAmountChange('sand', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Aggregate */}
                    <div className="space-y-4">
                      <Label>Aggregate</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="aggregate-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.aggregate.type}
                            onValueChange={(value) => handleMaterialTypeChange('aggregate', value)}
                          >
                            <SelectTrigger id="aggregate-type">
                              <SelectValue placeholder="Select aggregate type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('aggregate').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aggregate-amount" className="text-sm text-muted-foreground">Amount (cubic meters)</Label>
                          <Input 
                            id="aggregate-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={state.materialQuantities.aggregate.amount || ''}
                            onChange={(e) => handleMaterialAmountChange('aggregate', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Steel */}
                    <div className="space-y-4">
                      <Label>Steel</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="steel-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.steel.type}
                            onValueChange={(value) => handleMaterialTypeChange('steel', value)}
                          >
                            <SelectTrigger id="steel-type">
                              <SelectValue placeholder="Select steel type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('steel').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="steel-amount" className="text-sm text-muted-foreground">Amount (kg)</Label>
                          <Input 
                            id="steel-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={state.materialQuantities.steel.amount || ''}
                            onChange={(e) => handleMaterialAmountChange('steel', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bricks */}
                    <div className="space-y-4">
                      <Label>Bricks</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="bricks-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.bricks.type}
                            onValueChange={(value) => handleMaterialTypeChange('bricks', value)}
                          >
                            <SelectTrigger id="bricks-type">
                              <SelectValue placeholder="Select brick type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('bricks').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bricks-amount" className="text-sm text-muted-foreground">Amount (units)</Label>
                          <Input 
                            id="bricks-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={state.materialQuantities.bricks.amount || ''}
                            onChange={(e) => handleMaterialAmountChange('bricks', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Wood */}
                    <div className="space-y-4">
                      <Label>Wood</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="wood-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.wood.type}
                            onValueChange={(value) => handleMaterialTypeChange('wood', value)}
                          >
                            <SelectTrigger id="wood-type">
                              <SelectValue placeholder="Select wood type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('wood').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wood-amount" className="text-sm text-muted-foreground">Amount (cubic feet)</Label>
                          <Input 
                            id="wood-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={state.materialQuantities.wood.amount || ''}
                            onChange={(e) => handleMaterialAmountChange('wood', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-8 mb-4">Finishing Materials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Paint */}
                    <div className="space-y-4">
                      <Label>Paint</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="paint-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.paint.type}
                            onValueChange={(value) => handleMaterialTypeChange('paint', value)}
                          >
                            <SelectTrigger id="paint-type">
                              <SelectValue placeholder="Select paint type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('paint').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paint-amount" className="text-sm text-muted-foreground">Amount (liters)</Label>
                          <Input 
                            id="paint-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={state.materialQuantities.paint.amount || ''}
                            onChange={(e) => handleMaterialAmountChange('paint', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Electrical */}
                    <div className="space-y-4">
                      <Label>Electrical</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="electrical-components" className="text-sm text-muted-foreground">Components</Label>
                          <Select 
                            value={state.materialQuantities.electrical.components}
                            onValueChange={(value) => handleComponentsChange('electrical', value)}
                          >
                            <SelectTrigger id="electrical-components">
                              <SelectValue placeholder="Select component type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="electrical-complexity" className="text-sm text-muted-foreground">Complexity</Label>
                          <Select 
                            value={state.materialQuantities.electrical.complexity}
                            onValueChange={(value) => handleComplexityChange('electrical', value)}
                          >
                            <SelectTrigger id="electrical-complexity">
                              <SelectValue placeholder="Select complexity" />
                            </SelectTrigger>
                            <SelectContent>
                              {getComplexityOptions().map(complexity => (
                                <SelectItem key={complexity} value={complexity}>{complexity}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Plumbing */}
                    <div className="space-y-4">
                      <Label>Plumbing</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="plumbing-components" className="text-sm text-muted-foreground">Components</Label>
                          <Select 
                            value={state.materialQuantities.plumbing.components}
                            onValueChange={(value) => handleComponentsChange('plumbing', value)}
                          >
                            <SelectTrigger id="plumbing-components">
                              <SelectValue placeholder="Select component type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plumbing-complexity" className="text-sm text-muted-foreground">Complexity</Label>
                          <Select 
                            value={state.materialQuantities.plumbing.complexity}
                            onValueChange={(value) => handleComplexityChange('plumbing', value)}
                          >
                            <SelectTrigger id="plumbing-complexity">
                              <SelectValue placeholder="Select complexity" />
                            </SelectTrigger>
                            <SelectContent>
                              {getComplexityOptions().map(complexity => (
                                <SelectItem key={complexity} value={complexity}>{complexity}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Fixtures */}
                    <div className="space-y-4">
                      <Label>Fixtures</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="fixtures-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.fixtures.type}
                            onValueChange={(value) => handleMaterialTypeChange('fixtures', value)}
                          >
                            <SelectTrigger id="fixtures-type">
                              <SelectValue placeholder="Select fixture type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('fixtures').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fixtures-count" className="text-sm text-muted-foreground">Count</Label>
                          <Input 
                            id="fixtures-count"
                            type="number"
                            placeholder="Enter count"
                            value={state.materialQuantities.fixtures.count || ''}
                            onChange={(e) => handleMaterialCountChange('fixtures', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Windows */}
                    <div className="space-y-4">
                      <Label>Windows</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="windows-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.windows.type}
                            onValueChange={(value) => handleMaterialTypeChange('windows', value)}
                          >
                            <SelectTrigger id="windows-type">
                              <SelectValue placeholder="Select window type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('windows').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="windows-count" className="text-sm text-muted-foreground">Count</Label>
                          <Input 
                            id="windows-count"
                            type="number"
                            placeholder="Enter count"
                            value={state.materialQuantities.windows.count || ''}
                            onChange={(e) => handleMaterialCountChange('windows', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Doors */}
                    <div className="space-y-4">
                      <Label>Doors</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="doors-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.doors.type}
                            onValueChange={(value) => handleMaterialTypeChange('doors', value)}
                          >
                            <SelectTrigger id="doors-type">
                              <SelectValue placeholder="Select door type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('doors').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doors-count" className="text-sm text-muted-foreground">Count</Label>
                          <Input 
                            id="doors-count"
                            type="number"
                            placeholder="Enter count"
                            value={state.materialQuantities.doors.count || ''}
                            onChange={(e) => handleMaterialCountChange('doors', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-8 mb-4">Structural Elements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Roofing */}
                    <div className="space-y-4">
                      <Label>Roofing</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="roofing-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.roofing.type}
                            onValueChange={(value) => handleMaterialTypeChange('roofing', value)}
                          >
                            <SelectTrigger id="roofing-type">
                              <SelectValue placeholder="Select roofing type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('roofing').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roofing-area" className="text-sm text-muted-foreground">Area (sq. ft.)</Label>
                          <Input 
                            id="roofing-area"
                            type="number"
                            placeholder="Enter area"
                            value={state.materialQuantities.roofing.area || ''}
                            onChange={(e) => handleMaterialAreaChange('roofing', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Flooring */}
                    <div className="space-y-4">
                      <Label>Flooring</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="flooring-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.flooring.type}
                            onValueChange={(value) => handleMaterialTypeChange('flooring', value)}
                          >
                            <SelectTrigger id="flooring-type">
                              <SelectValue placeholder="Select flooring type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('flooring').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="flooring-area" className="text-sm text-muted-foreground">Area (sq. ft.)</Label>
                          <Input 
                            id="flooring-area"
                            type="number"
                            placeholder="Enter area"
                            value={state.materialQuantities.flooring.area || ''}
                            onChange={(e) => handleMaterialAreaChange('flooring', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Glasswork */}
                    <div className="space-y-4">
                      <Label>Glasswork</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="glasswork-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.glasswork.type}
                            onValueChange={(value) => handleMaterialTypeChange('glasswork', value)}
                          >
                            <SelectTrigger id="glasswork-type">
                              <SelectValue placeholder="Select glass type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('glasswork').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="glasswork-area" className="text-sm text-muted-foreground">Area (sq. ft.)</Label>
                          <Input 
                            id="glasswork-area"
                            type="number"
                            placeholder="Enter area"
                            value={state.materialQuantities.glasswork.area || ''}
                            onChange={(e) => handleMaterialAreaChange('glasswork', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tiles/Marble */}
                    <div className="space-y-4">
                      <Label>Tiles/Marble</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="tilesMarble-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.materialQuantities.tilesMarble.type}
                            onValueChange={(value) => handleMaterialTypeChange('tilesMarble', value)}
                          >
                            <SelectTrigger id="tilesMarble-type">
                              <SelectValue placeholder="Select tile type" />
                            </SelectTrigger>
                            <SelectContent>
                              {getMaterialOptions('tilesMarble').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tilesMarble-area" className="text-sm text-muted-foreground">Area (sq. ft.)</Label>
                          <Input 
                            id="tilesMarble-area"
                            type="number"
                            placeholder="Enter area"
                            value={state.materialQuantities.tilesMarble.area || ''}
                            onChange={(e) => handleMaterialAreaChange('tilesMarble', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentTab('project')}>
                      Back
                    </Button>
                    <Button onClick={() => setCurrentTab('labor')}>
                      Next: Labor
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="labor" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Masons */}
                    <div className="space-y-4">
                      <Label>Masons</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="masons-count" className="text-sm text-muted-foreground">Number of Workers</Label>
                          <Input 
                            id="masons-count"
                            type="number"
                            placeholder="Enter count"
                            value={state.laborDetails.masons.count || ''}
                            onChange={(e) => handleLaborCountChange('masons', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="masons-days" className="text-sm text-muted-foreground">Work Days</Label>
                          <Input 
                            id="masons-days"
                            type="number"
                            placeholder="Enter days"
                            value={state.laborDetails.masons.days || ''}
                            onChange={(e) => handleLaborDaysChange('masons', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Carpenters */}
                    <div className="space-y-4">
                      <Label>Carpenters</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="carpenters-count" className="text-sm text-muted-foreground">Number of Workers</Label>
                          <Input 
                            id="carpenters-count"
                            type="number"
                            placeholder="Enter count"
                            value={state.laborDetails.carpenters.count || ''}
                            onChange={(e) => handleLaborCountChange('carpenters', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="carpenters-days" className="text-sm text-muted-foreground">Work Days</Label>
                          <Input 
                            id="carpenters-days"
                            type="number"
                            placeholder="Enter days"
                            value={state.laborDetails.carpenters.days || ''}
                            onChange={(e) => handleLaborDaysChange('carpenters', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Painters */}
                    <div className="space-y-4">
                      <Label>Painters</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="painters-count" className="text-sm text-muted-foreground">Number of Workers</Label>
                          <Input 
                            id="painters-count"
                            type="number"
                            placeholder="Enter count"
                            value={state.laborDetails.painters.count || ''}
                            onChange={(e) => handleLaborCountChange('painters', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="painters-days" className="text-sm text-muted-foreground">Work Days</Label>
                          <Input 
                            id="painters-days"
                            type="number"
                            placeholder="Enter days"
                            value={state.laborDetails.painters.days || ''}
                            onChange={(e) => handleLaborDaysChange('painters', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Electricians */}
                    <div className="space-y-4">
                      <Label>Electricians</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="electricians-count" className="text-sm text-muted-foreground">Number of Workers</Label>
                          <Input 
                            id="electricians-count"
                            type="number"
                            placeholder="Enter count"
                            value={state.laborDetails.electricians.count || ''}
                            onChange={(e) => handleLaborCountChange('electricians', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="electricians-days" className="text-sm text-muted-foreground">Work Days</Label>
                          <Input 
                            id="electricians-days"
                            type="number"
                            placeholder="Enter days"
                            value={state.laborDetails.electricians.days || ''}
                            onChange={(e) => handleLaborDaysChange('electricians', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Plumbers */}
                    <div className="space-y-4">
                      <Label>Plumbers</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="plumbers-count" className="text-sm text-muted-foreground">Number of Workers</Label>
                          <Input 
                            id="plumbers-count"
                            type="number"
                            placeholder="Enter count"
                            value={state.laborDetails.plumbers.count || ''}
                            onChange={(e) => handleLaborCountChange('plumbers', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plumbers-days" className="text-sm text-muted-foreground">Work Days</Label>
                          <Input 
                            id="plumbers-days"
                            type="number"
                            placeholder="Enter days"
                            value={state.laborDetails.plumbers.days || ''}
                            onChange={(e) => handleLaborDaysChange('plumbers', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Helpers */}
                    <div className="space-y-4">
                      <Label>Helpers</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="helpers-count" className="text-sm text-muted-foreground">Number of Workers</Label>
                          <Input 
                            id="helpers-count"
                            type="number"
                            placeholder="Enter count"
                            value={state.laborDetails.helpers.count || ''}
                            onChange={(e) => handleLaborCountChange('helpers', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="helpers-days" className="text-sm text-muted-foreground">Work Days</Label>
                          <Input 
                            id="helpers-days"
                            type="number"
                            placeholder="Enter days"
                            value={state.laborDetails.helpers.days || ''}
                            onChange={(e) => handleLaborDaysChange('helpers', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Supervisors */}
                    <div className="space-y-4">
                      <Label>Supervisors</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="supervisors-count" className="text-sm text-muted-foreground">Number of Workers</Label>
                          <Input 
                            id="supervisors-count"
                            type="number"
                            placeholder="Enter count"
                            value={state.laborDetails.supervisors.count || ''}
                            onChange={(e) => handleLaborCountChange('supervisors', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supervisors-days" className="text-sm text-muted-foreground">Work Days</Label>
                          <Input 
                            id="supervisors-days"
                            type="number"
                            placeholder="Enter days"
                            value={state.laborDetails.supervisors.days || ''}
                            onChange={(e) => handleLaborDaysChange('supervisors', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentTab('materials')}>
                      Back
                    </Button>
                    <Button onClick={() => setCurrentTab('overhead')}>
                      Next: Overhead
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="overhead" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Permits */}
                    <div className="space-y-4">
                      <Label>Permits</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="permits-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.overheadDetails.permits.type}
                            onValueChange={(value) => handleOverheadTypeChange('permits', value)}
                          >
                            <SelectTrigger id="permits-type">
                              <SelectValue placeholder="Select permit type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Complex">Complex</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="permits-complexity" className="text-sm text-muted-foreground">Complexity</Label>
                          <Select 
                            value={state.overheadDetails.permits.complexity}
                            onValueChange={(value) => handleOverheadComplexityChange('permits', value)}
                          >
                            <SelectTrigger id="permits-complexity">
                              <SelectValue placeholder="Select complexity" />
                            </SelectTrigger>
                            <SelectContent>
                              {getComplexityOptions().map(complexity => (
                                <SelectItem key={complexity} value={complexity}>{complexity}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Design */}
                    <div className="space-y-4">
                      <Label>Design</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="design-complexity" className="text-sm text-muted-foreground">Complexity</Label>
                          <Select 
                            value={state.overheadDetails.design.complexity}
                            onValueChange={(value) => handleOverheadComplexityChange('design', value)}
                          >
                            <SelectTrigger id="design-complexity">
                              <SelectValue placeholder="Select complexity" />
                            </SelectTrigger>
                            <SelectContent>
                              {getComplexityOptions().map(complexity => (
                                <SelectItem key={complexity} value={complexity}>{complexity}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="design-revisions" className="text-sm text-muted-foreground">Revisions</Label>
                          <Select 
                            value={state.overheadDetails.design.revisions.toString()}
                            onValueChange={(value) => handleOverheadRevisionsChange(parseInt(value))}
                          >
                            <SelectTrigger id="design-revisions">
                              <SelectValue placeholder="Select number of revisions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Insurance */}
                    <div className="space-y-4">
                      <Label>Insurance</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="insurance-coverage" className="text-sm text-muted-foreground">Coverage</Label>
                          <Select 
                            value={state.overheadDetails.insurance.coverage}
                            onValueChange={(value) => handleOverheadCoverageChange(value)}
                          >
                            <SelectTrigger id="insurance-coverage">
                              <SelectValue placeholder="Select coverage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insurance-duration" className="text-sm text-muted-foreground">Duration (months)</Label>
                          <Input 
                            id="insurance-duration"
                            type="number"
                            placeholder="Enter duration"
                            value={state.overheadDetails.insurance.duration || ''}
                            onChange={(e) => handleOverheadDurationChange('insurance', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Equipment */}
                    <div className="space-y-4">
                      <Label>Equipment</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="equipment-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.overheadDetails.equipment.type}
                            onValueChange={(value) => handleOverheadTypeChange('equipment', value)}
                          >
                            <SelectTrigger id="equipment-type">
                              <SelectValue placeholder="Select equipment type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="Heavy">Heavy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="equipment-duration" className="text-sm text-muted-foreground">Duration (days)</Label>
                          <Input 
                            id="equipment-duration"
                            type="number"
                            placeholder="Enter duration"
                            value={state.overheadDetails.equipment.duration || ''}
                            onChange={(e) => handleOverheadDurationChange('equipment', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Transportation */}
                    <div className="space-y-4">
                      <Label>Transportation</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="transportation-distance" className="text-sm text-muted-foreground">Distance (km)</Label>
                          <Input 
                            id="transportation-distance"
                            type="number"
                            placeholder="Enter distance"
                            value={state.overheadDetails.transportation.distance || ''}
                            onChange={(e) => handleOverheadDistanceChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transportation-frequency" className="text-sm text-muted-foreground">Frequency (trips)</Label>
                          <Input 
                            id="transportation-frequency"
                            type="number"
                            placeholder="Enter frequency"
                            value={state.overheadDetails.transportation.frequency || ''}
                            onChange={(e) => handleOverheadFrequencyChange(parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Utilities */}
                    <div className="space-y-4">
                      <Label>Utilities</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="utilities-type" className="text-sm text-muted-foreground">Type</Label>
                          <Select 
                            value={state.overheadDetails.utilities.type}
                            onValueChange={(value) => handleOverheadTypeChange('utilities', value)}
                          >
                            <SelectTrigger id="utilities-type">
                              <SelectValue placeholder="Select utilities type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="utilities-duration" className="text-sm text-muted-foreground">Duration (months)</Label>
                          <Input 
                            id="utilities-duration"
                            type="number"
                            placeholder="Enter duration"
                            value={state.overheadDetails.utilities.duration || ''}
                            onChange={(e) => handleOverheadDurationChange('utilities', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Site Preparation */}
                    <div className="space-y-4">
                      <Label>Site Preparation</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="sitePreparation-complexity" className="text-sm text-muted-foreground">Complexity</Label>
                          <Select 
                            value={state.overheadDetails.sitePreparation.complexity}
                            onValueChange={(value) => handleOverheadComplexityChange('sitePreparation', value)}
                          >
                            <SelectTrigger id="sitePreparation-complexity">
                              <SelectValue placeholder="Select complexity" />
                            </SelectTrigger>
                            <SelectContent>
                              {getComplexityOptions().map(complexity => (
                                <SelectItem key={complexity} value={complexity}>{complexity}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sitePreparation-area" className="text-sm text-muted-foreground">Area (sq. ft.)</Label>
                          <Input 
                            id="sitePreparation-area"
                            type="number"
                            placeholder="Enter area"
                            value={state.overheadDetails.sitePreparation.area || ''}
                            onChange={(e) => handleOverheadAreaChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contingency */}
                    <div className="space-y-4">
                      <Label>Contingency</Label>
                      <div className="space-y-2">
                        <Label htmlFor="contingency-percentage" className="text-sm text-muted-foreground">Percentage (%)</Label>
                        <Input 
                          id="contingency-percentage"
                          type="number"
                          placeholder="Enter percentage"
                          min="1"
                          max="20"
                          value={state.overheadDetails.contingency.percentage || ''}
                          onChange={(e) => handleContingencyChange(parseFloat(e.target.value) || 5)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentTab('labor')}>
                      Back
                    </Button>
                    <Button onClick={handleCalculate} className="bg-primary">
                      Calculate Cost
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Enter all required details in each tab and click "Calculate Cost" to generate estimate
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Estimate;
