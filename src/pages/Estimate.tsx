
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
    updateMaterials,
    updateLabor,
    updateOverhead,
    calculateCosts,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: 'materials' | 'labor' | 'overhead',
    field: string
  ) => {
    const value = parseFloat(e.target.value) || 0;
    
    switch (category) {
      case 'materials':
        updateMaterials({ [field]: value } as any);
        break;
      case 'labor':
        updateLabor({ [field]: value } as any);
        break;
      case 'overhead':
        updateOverhead({ [field]: value } as any);
        break;
    }
  };

  const constructionTypes = [
    { value: 'residential', label: 'Residential Building' },
    { value: 'commercial', label: 'Commercial Building' },
    { value: 'industrial', label: 'Industrial Building' },
    { value: 'infrastructure', label: 'Infrastructure Project' },
  ];

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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cement">Cement (₹)</Label>
                      <Input 
                        id="cement"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.cement || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'cement')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sand">Sand (₹)</Label>
                      <Input 
                        id="sand"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.sand || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'sand')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aggregate">Aggregate (₹)</Label>
                      <Input 
                        id="aggregate"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.aggregate || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'aggregate')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="steel">Steel (₹)</Label>
                      <Input 
                        id="steel"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.steel || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'steel')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bricks">Bricks (₹)</Label>
                      <Input 
                        id="bricks"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.bricks || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'bricks')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wood">Wood (₹)</Label>
                      <Input 
                        id="wood"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.wood || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'wood')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paint">Paint (₹)</Label>
                      <Input 
                        id="paint"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.paint || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'paint')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="electrical">Electrical (₹)</Label>
                      <Input 
                        id="electrical"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.electrical || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'electrical')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="plumbing">Plumbing (₹)</Label>
                      <Input 
                        id="plumbing"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.plumbing || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'plumbing')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fixtures">Fixtures (₹)</Label>
                      <Input 
                        id="fixtures"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.fixtures || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'fixtures')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="windows">Windows (₹)</Label>
                      <Input 
                        id="windows"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.windows || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'windows')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="doors">Doors (₹)</Label>
                      <Input 
                        id="doors"
                        type="number"
                        placeholder="Enter cost"
                        value={state.materials.doors || ''}
                        onChange={(e) => handleInputChange(e, 'materials', 'doors')}
                      />
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
                    <div className="space-y-2">
                      <Label htmlFor="masons">Masons (₹)</Label>
                      <Input 
                        id="masons"
                        type="number"
                        placeholder="Enter cost"
                        value={state.labor.masons || ''}
                        onChange={(e) => handleInputChange(e, 'labor', 'masons')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="carpenters">Carpenters (₹)</Label>
                      <Input 
                        id="carpenters"
                        type="number"
                        placeholder="Enter cost"
                        value={state.labor.carpenters || ''}
                        onChange={(e) => handleInputChange(e, 'labor', 'carpenters')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="painters">Painters (₹)</Label>
                      <Input 
                        id="painters"
                        type="number"
                        placeholder="Enter cost"
                        value={state.labor.painters || ''}
                        onChange={(e) => handleInputChange(e, 'labor', 'painters')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="electricians">Electricians (₹)</Label>
                      <Input 
                        id="electricians"
                        type="number"
                        placeholder="Enter cost"
                        value={state.labor.electricians || ''}
                        onChange={(e) => handleInputChange(e, 'labor', 'electricians')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="plumbers">Plumbers (₹)</Label>
                      <Input 
                        id="plumbers"
                        type="number"
                        placeholder="Enter cost"
                        value={state.labor.plumbers || ''}
                        onChange={(e) => handleInputChange(e, 'labor', 'plumbers')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="helpers">Helpers (₹)</Label>
                      <Input 
                        id="helpers"
                        type="number"
                        placeholder="Enter cost"
                        value={state.labor.helpers || ''}
                        onChange={(e) => handleInputChange(e, 'labor', 'helpers')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supervisors">Supervisors (₹)</Label>
                      <Input 
                        id="supervisors"
                        type="number"
                        placeholder="Enter cost"
                        value={state.labor.supervisors || ''}
                        onChange={(e) => handleInputChange(e, 'labor', 'supervisors')}
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
                
                <TabsContent value="overhead" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="permits">Permits (₹)</Label>
                      <Input 
                        id="permits"
                        type="number"
                        placeholder="Enter cost"
                        value={state.overhead.permits || ''}
                        onChange={(e) => handleInputChange(e, 'overhead', 'permits')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="design">Design (₹)</Label>
                      <Input 
                        id="design"
                        type="number"
                        placeholder="Enter cost"
                        value={state.overhead.design || ''}
                        onChange={(e) => handleInputChange(e, 'overhead', 'design')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="insurance">Insurance (₹)</Label>
                      <Input 
                        id="insurance"
                        type="number"
                        placeholder="Enter cost"
                        value={state.overhead.insurance || ''}
                        onChange={(e) => handleInputChange(e, 'overhead', 'insurance')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="equipment">Equipment (₹)</Label>
                      <Input 
                        id="equipment"
                        type="number"
                        placeholder="Enter cost"
                        value={state.overhead.equipment || ''}
                        onChange={(e) => handleInputChange(e, 'overhead', 'equipment')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="transportation">Transportation (₹)</Label>
                      <Input 
                        id="transportation"
                        type="number"
                        placeholder="Enter cost"
                        value={state.overhead.transportation || ''}
                        onChange={(e) => handleInputChange(e, 'overhead', 'transportation')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="utilities">Utilities (₹)</Label>
                      <Input 
                        id="utilities"
                        type="number"
                        placeholder="Enter cost"
                        value={state.overhead.utilities || ''}
                        onChange={(e) => handleInputChange(e, 'overhead', 'utilities')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sitePreparation">Site Preparation (₹)</Label>
                      <Input 
                        id="sitePreparation"
                        type="number"
                        placeholder="Enter cost"
                        value={state.overhead.sitePreparation || ''}
                        onChange={(e) => handleInputChange(e, 'overhead', 'sitePreparation')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contingency">Contingency (₹)</Label>
                      <Input 
                        id="contingency"
                        type="number"
                        placeholder="Enter cost"
                        value={state.overhead.contingency || ''}
                        onChange={(e) => handleInputChange(e, 'overhead', 'contingency')}
                      />
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
