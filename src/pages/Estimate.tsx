
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import {
  Checkbox
} from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { 
  sandPrices, 
  aggregatePrices, 
  cementPrices, 
  steelPrices, 
  brickPrices, 
  woodPrices, 
  paintPrices, 
  electricalFixturePrices, 
  plumbingFixturePrices, 
  fixturePrices, 
  windowPrices, 
  doorPrices, 
  roofingPrices, 
  flooringPrices, 
  glassPrices, 
  tilesPrices, 
  equipmentRates,
  permitPrices,
  designPrices,
  insurancePrices,
  utilitiesPrices,
  sitePreparationPrices
} from '@/lib/pricingData';

const Estimate = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { toast } = useToast();
  const {
    state,
    updateProject,
    updateMaterials,
    updateLabor,
    updateOverhead,
    calculateCosts,
    loadProject,
    currentProjectId
  } = useEstimator();
  
  const [currentTab, setCurrentTab] = useState('project');
  const [isLoading, setIsLoading] = useState(!!projectId);

  // Load project data if projectId is provided
  useEffect(() => {
    if (projectId && projectId !== currentProjectId) {
      setIsLoading(true);
      loadProject(projectId).finally(() => setIsLoading(false));
    }
  }, [projectId, currentProjectId, loadProject]);

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading project data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                
                {/* PROJECT DETAILS TAB */}
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
                
                {/* MATERIALS TAB */}
                <TabsContent value="materials" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CEMENT */}
                    <div className="space-y-2 border p-4 rounded-md">
                      <Label className="font-medium">Cement</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cement-type">Type</Label>
                          <Select 
                            value={state.materials.cementType}
                            onValueChange={(value) => updateMaterials({ cementType: value })}
                          >
                            <SelectTrigger id="cement-type">
                              <SelectValue placeholder="Select cement type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(cementPrices).map(([type, price]) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/-/g, ' ').toUpperCase()} (₹{price}/bag)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cement-amount">Quantity (bags)</Label>
                          <Input 
                            id="cement-amount"
                            type="number"
                            placeholder="Enter quantity"
                            value={state.materials.cementAmount || ''}
                            onChange={(e) => updateMaterials({ cementAmount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* SAND */}
                    <div className="space-y-2 border p-4 rounded-md">
                      <Label className="font-medium">Sand</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sand-type">Type</Label>
                          <Select 
                            value={state.materials.sandType}
                            onValueChange={(value) => updateMaterials({ sandType: value })}
                          >
                            <SelectTrigger id="sand-type">
                              <SelectValue placeholder="Select sand type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(sandPrices).map(([type, price]) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/-/g, ' ').toUpperCase()} (₹{price}/m³)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sand-amount">Quantity (m³)</Label>
                          <Input 
                            id="sand-amount"
                            type="number"
                            placeholder="Enter quantity"
                            value={state.materials.sandAmount || ''}
                            onChange={(e) => updateMaterials({ sandAmount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* AGGREGATE */}
                    <div className="space-y-2 border p-4 rounded-md">
                      <Label className="font-medium">Aggregate</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="aggregate-type">Type</Label>
                          <Select 
                            value={state.materials.aggregateType}
                            onValueChange={(value) => updateMaterials({ aggregateType: value })}
                          >
                            <SelectTrigger id="aggregate-type">
                              <SelectValue placeholder="Select aggregate type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(aggregatePrices).map(([type, price]) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/-/g, ' ').toUpperCase()} (₹{price}/m³)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aggregate-amount">Quantity (m³)</Label>
                          <Input 
                            id="aggregate-amount"
                            type="number"
                            placeholder="Enter quantity"
                            value={state.materials.aggregateAmount || ''}
                            onChange={(e) => updateMaterials({ aggregateAmount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* STEEL */}
                    <div className="space-y-2 border p-4 rounded-md">
                      <Label className="font-medium">Steel</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="steel-type">Type</Label>
                          <Select 
                            value={state.materials.steelType}
                            onValueChange={(value) => updateMaterials({ steelType: value })}
                          >
                            <SelectTrigger id="steel-type">
                              <SelectValue placeholder="Select steel type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(steelPrices).map(([type, price]) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/-/g, ' ').toUpperCase()} (₹{price}/kg)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="steel-amount">Quantity (kg)</Label>
                          <Input 
                            id="steel-amount"
                            type="number"
                            placeholder="Enter quantity"
                            value={state.materials.steelAmount || ''}
                            onChange={(e) => updateMaterials({ steelAmount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* BRICKS */}
                    <div className="space-y-2 border p-4 rounded-md">
                      <Label className="font-medium">Bricks</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="brick-type">Type</Label>
                          <Select 
                            value={state.materials.brickType}
                            onValueChange={(value) => updateMaterials({ brickType: value })}
                          >
                            <SelectTrigger id="brick-type">
                              <SelectValue placeholder="Select brick type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(brickPrices).map(([type, price]) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/-/g, ' ').toUpperCase()} (₹{price}/1000)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="brick-amount">Quantity (pieces)</Label>
                          <Input 
                            id="brick-amount"
                            type="number"
                            placeholder="Enter quantity"
                            value={state.materials.brickAmount || ''}
                            onChange={(e) => updateMaterials({ brickAmount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* WOOD */}
                    <div className="space-y-2 border p-4 rounded-md">
                      <Label className="font-medium">Wood</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="wood-type">Type</Label>
                          <Select 
                            value={state.materials.woodType}
                            onValueChange={(value) => updateMaterials({ woodType: value })}
                          >
                            <SelectTrigger id="wood-type">
                              <SelectValue placeholder="Select wood type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(woodPrices).map(([type, price]) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/-/g, ' ').toUpperCase()} (₹{price}/cu.ft.)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wood-amount">Quantity (cu.ft.)</Label>
                          <Input 
                            id="wood-amount"
                            type="number"
                            placeholder="Enter quantity"
                            value={state.materials.woodAmount || ''}
                            onChange={(e) => updateMaterials({ woodAmount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* DOORS */}
                    <div className="space-y-2 border p-4 rounded-md">
                      <Label className="font-medium">Doors</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="door-type">Type</Label>
                          <Select 
                            value={state.materials.doorType}
                            onValueChange={(value) => updateMaterials({ doorType: value })}
                          >
                            <SelectTrigger id="door-type">
                              <SelectValue placeholder="Select door type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(doorPrices).map(([type, price]) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/-/g, ' ').toUpperCase()} (₹{price}/door)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="door-amount">Quantity (pieces)</Label>
                          <Input 
                            id="door-amount"
                            type="number"
                            placeholder="Enter quantity"
                            value={state.materials.doorAmount || ''}
                            onChange={(e) => updateMaterials({ doorAmount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* WINDOWS */}
                    <div className="space-y-2 border p-4 rounded-md">
                      <Label className="font-medium">Windows</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="window-type">Type</Label>
                          <Select 
                            value={state.materials.windowType}
                            onValueChange={(value) => updateMaterials({ windowType: value })}
                          >
                            <SelectTrigger id="window-type">
                              <SelectValue placeholder="Select window type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(windowPrices).map(([type, price]) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/-/g, ' ').toUpperCase()} (₹{price}/window)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="window-amount">Quantity (pieces)</Label>
                          <Input 
                            id="window-amount"
                            type="number"
                            placeholder="Enter quantity"
                            value={state.materials.windowAmount || ''}
                            onChange={(e) => updateMaterials({ windowAmount: parseFloat(e.target.value) || 0 })}
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
                
                {/* LABOR TAB */}
                <TabsContent value="labor" className="space-y-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter the number of workers needed for each category. Costs will be calculated based on standard daily rates.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="masons">Masons (₹800/day)</Label>
                      <Input 
                        id="masons"
                        type="number"
                        placeholder="Enter number of workers"
                        value={state.labor.masons || ''}
                        onChange={(e) => updateLabor({ masons: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="carpenters">Carpenters (₹900/day)</Label>
                      <Input 
                        id="carpenters"
                        type="number"
                        placeholder="Enter number of workers"
                        value={state.labor.carpenters || ''}
                        onChange={(e) => updateLabor({ carpenters: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="painters">Painters (₹700/day)</Label>
                      <Input 
                        id="painters"
                        type="number"
                        placeholder="Enter number of workers"
                        value={state.labor.painters || ''}
                        onChange={(e) => updateLabor({ painters: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="electricians">Electricians (₹1000/day)</Label>
                      <Input 
                        id="electricians"
                        type="number"
                        placeholder="Enter number of workers"
                        value={state.labor.electricians || ''}
                        onChange={(e) => updateLabor({ electricians: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="plumbers">Plumbers (₹950/day)</Label>
                      <Input 
                        id="plumbers"
                        type="number"
                        placeholder="Enter number of workers"
                        value={state.labor.plumbers || ''}
                        onChange={(e) => updateLabor({ plumbers: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="helpers">Helpers (₹500/day)</Label>
                      <Input 
                        id="helpers"
                        type="number"
                        placeholder="Enter number of workers"
                        value={state.labor.helpers || ''}
                        onChange={(e) => updateLabor({ helpers: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supervisors">Supervisors (₹1500/day)</Label>
                      <Input 
                        id="supervisors"
                        type="number"
                        placeholder="Enter number of workers"
                        value={state.labor.supervisors || ''}
                        onChange={(e) => updateLabor({ supervisors: parseInt(e.target.value) || 0 })}
                      />
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
                
                {/* OVERHEAD TAB */}
                <TabsContent value="overhead" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="permit-type">Permit Type</Label>
                      <Select 
                        value={state.overhead.permitType}
                        onValueChange={(value) => updateOverhead({ permitType: value })}
                      >
                        <SelectTrigger id="permit-type">
                          <SelectValue placeholder="Select permit type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(permitPrices).map(([type, price]) => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/-/g, ' ').toUpperCase()} (₹{price.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="design-complexity">Design Complexity</Label>
                      <Select 
                        value={state.overhead.designComplexity}
                        onValueChange={(value) => updateOverhead({ designComplexity: value })}
                      >
                        <SelectTrigger id="design-complexity">
                          <SelectValue placeholder="Select design complexity" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(designPrices).map(([type, price]) => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/-/g, ' ').toUpperCase()} (₹{price.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="insurance-type">Insurance Type</Label>
                      <Select 
                        value={state.overhead.insuranceType}
                        onValueChange={(value) => updateOverhead({ insuranceType: value })}
                      >
                        <SelectTrigger id="insurance-type">
                          <SelectValue placeholder="Select insurance type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(insurancePrices).map(([type, price]) => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/-/g, ' ').toUpperCase()} (₹{price.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="transportation-distance">Transportation Distance (km)</Label>
                      <Input 
                        id="transportation-distance"
                        type="number"
                        placeholder="Enter distance in kilometers"
                        value={state.overhead.transportationDistance || ''}
                        onChange={(e) => updateOverhead({ transportationDistance: parseFloat(e.target.value) || 0 })}
                      />
                      <p className="text-xs text-muted-foreground">Rate: ₹100 per km</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="utilities-estimate">Utilities Estimate</Label>
                      <Select 
                        value={state.overhead.utilitiesEstimate}
                        onValueChange={(value) => updateOverhead({ utilitiesEstimate: value })}
                      >
                        <SelectTrigger id="utilities-estimate">
                          <SelectValue placeholder="Select utilities estimate" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(utilitiesPrices).map(([type, price]) => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/-/g, ' ').toUpperCase()} (₹{price.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="site-preparation-type">Site Preparation</Label>
                      <Select 
                        value={state.overhead.sitePreparationType}
                        onValueChange={(value) => updateOverhead({ sitePreparationType: value })}
                      >
                        <SelectTrigger id="site-preparation-type">
                          <SelectValue placeholder="Select site preparation type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(sitePreparationPrices).map(([type, price]) => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/-/g, ' ').toUpperCase()} (₹{price.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contingency-percentage">Contingency Percentage (%)</Label>
                      <Input 
                        id="contingency-percentage"
                        type="number"
                        placeholder="Enter contingency percentage"
                        value={state.overhead.contingencyPercentage || ''}
                        onChange={(e) => updateOverhead({ contingencyPercentage: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label>Equipment Needed</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                        {Object.entries(equipmentRates).map(([equipment, rate]) => (
                          <div key={equipment} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`equipment-${equipment}`}
                              checked={state.overhead.equipmentNeeded.includes(equipment)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateOverhead({ 
                                    equipmentNeeded: [...state.overhead.equipmentNeeded, equipment] 
                                  });
                                } else {
                                  updateOverhead({ 
                                    equipmentNeeded: state.overhead.equipmentNeeded.filter(e => e !== equipment) 
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={`equipment-${equipment}`} className="text-sm font-normal">
                              {equipment.replace(/-/g, ' ').toUpperCase()} (₹{rate.toLocaleString()}/month)
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentTab('labor')}>
                      Back
                    </Button>
                    <Button onClick={handleCalculate}>
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
