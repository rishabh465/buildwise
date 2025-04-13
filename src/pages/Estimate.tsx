import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  useEstimator, 
  // Import specific option getters
  electricalComponentOptions,
  electricalComplexityOptions,
  plumbingComponentOptions,
  plumbingComplexityOptions,
  fixtureOptions,
  permitTypeOptions,
  permitComplexityOptions,
  insuranceCoverageOptions,
  equipmentTypeOptions,
  utilityTypeOptions,
  sitePreparationComplexityOptions
} from '@/contexts/EstimatorContext';
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

// Simple wrapper component for input groups
const InputBox: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`p-4 border rounded-md space-y-2 ${className || ''}`}>
    {children}
  </div>
);

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
      setCurrentTab('project'); // Switch to relevant tab
      return;
    }
    
    if (state.project.area <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Project area must be greater than zero",
      });
      setCurrentTab('project');
      return;
    }
    
    if (state.project.constructionType === '') {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Construction type is required",
      });
      setCurrentTab('project');
      return;
    }
    
    // Add more validation as needed for materials, labor, overhead...
    
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container max-w-screen-xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Construction Cost Estimator</h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details below to estimate the cost of your construction project        
            </p>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="project">Project Details</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="labor">Labor</TabsTrigger>
                  <TabsTrigger value="overhead">Overhead</TabsTrigger>
                </TabsList>
                
            {/* Project Details Tab */}
            <TabsContent value="project">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Enter the basic details of your project.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputBox>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input id="projectName" placeholder="e.g., Maple Residency" value={state.project.name} onChange={(e) => updateProject({ name: e.target.value })} />
                  </InputBox>
                  <InputBox>
                    <Label htmlFor="projectLocation">Location</Label>
                    <Input id="projectLocation" placeholder="e.g., Bangalore, India" value={state.project.location} onChange={(e) => updateProject({ location: e.target.value })} />
                  </InputBox>
                  <InputBox>
                    <Label htmlFor="constructionType">Construction Type</Label>
                    <Select value={state.project.constructionType} onValueChange={(value) => updateProject({ constructionType: value })}>
                      <SelectTrigger id="constructionType"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                        {constructionTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </InputBox>
                   <InputBox>
                    <Label htmlFor="projectArea">Total Area (sq. ft.)</Label>
                    <Input id="projectArea" type="number" placeholder="Enter total area" value={state.project.area || ''} onChange={(e) => updateProject({ area: parseFloat(e.target.value) || 0 })} />
                  </InputBox>
                  <InputBox>
                    <Label htmlFor="projectFloors">Number of Floors</Label>
                    <Input id="projectFloors" type="number" placeholder="Enter number of floors" value={state.project.floors || ''} onChange={(e) => updateProject({ floors: parseInt(e.target.value) || 1 })} min="1"/>
                  </InputBox>
                  {/* Example: Currency - Assuming it's fixed for now based on context */}
                  <InputBox className="flex items-center">
                    <Label htmlFor="projectCurrency">Currency:</Label>
                    <span id="projectCurrency" className="ml-2 font-medium">{state.project.currency} (INR)</span>
                  </InputBox>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setCurrentTab('materials')}>Next: Materials</Button>
                </CardFooter>
              </Card>
                </TabsContent>
                
            {/* Materials Tab */}
            <TabsContent value="materials">
              <Card>
                <CardHeader>
                  <CardTitle>Material Quantities</CardTitle>
                  <CardDescription>Enter quantities and types for materials.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InputBox>
                    <Label>Sand</Label>
                    <Select value={state.materialQuantities.sand.type} onValueChange={(value) => handleMaterialTypeChange('sand', value)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>{getMaterialOptions('sand').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                    <Input type="number" placeholder="Amount (cubic meters)" value={state.materialQuantities.sand.amount || ''} onChange={(e) => handleMaterialAmountChange('sand', parseFloat(e.target.value) || 0)} />
                  </InputBox>

                  <InputBox>
                    <Label>Cement</Label>
                    <Select value={state.materialQuantities.cement.type} onValueChange={(value) => handleMaterialTypeChange('cement', value)}>
                     <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                     <SelectContent>{getMaterialOptions('cement').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                    <Input type="number" placeholder="Amount (bags)" value={state.materialQuantities.cement.amount || ''} onChange={(e) => handleMaterialAmountChange('cement', parseFloat(e.target.value) || 0)} />
                  </InputBox>

                  <InputBox>
                      <Label>Aggregate</Label>
                      <Select value={state.materialQuantities.aggregate.type} onValueChange={(value) => handleMaterialTypeChange('aggregate', value)}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>{getMaterialOptions('aggregate').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                      <Input type="number" placeholder="Amount (cubic meters)" value={state.materialQuantities.aggregate.amount || ''} onChange={(e) => handleMaterialAmountChange('aggregate', parseFloat(e.target.value) || 0)} />
                  </InputBox>

                  <InputBox>
                      <Label>Steel</Label>
                      <Select value={state.materialQuantities.steel.type} onValueChange={(value) => handleMaterialTypeChange('steel', value)}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>{getMaterialOptions('steel').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                      <Input type="number" placeholder="Amount (kg)" value={state.materialQuantities.steel.amount || ''} onChange={(e) => handleMaterialAmountChange('steel', parseFloat(e.target.value) || 0)} />
                  </InputBox>

                  <InputBox>
                      <Label>Bricks</Label>
                      <Select value={state.materialQuantities.bricks.type} onValueChange={(value) => handleMaterialTypeChange('bricks', value)}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>{getMaterialOptions('bricks').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                      <Input type="number" placeholder="Amount (units)" value={state.materialQuantities.bricks.amount || ''} onChange={(e) => handleMaterialAmountChange('bricks', parseFloat(e.target.value) || 0)} />
                  </InputBox>

                  <InputBox>
                      <Label>Wood</Label>
                      <Select value={state.materialQuantities.wood.type} onValueChange={(value) => handleMaterialTypeChange('wood', value)}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>{getMaterialOptions('wood').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                      <Input type="number" placeholder="Amount (cubic feet)" value={state.materialQuantities.wood.amount || ''} onChange={(e) => handleMaterialAmountChange('wood', parseFloat(e.target.value) || 0)} />
                  </InputBox>

                  <InputBox>
                      <Label>Paint</Label>
                      <Select value={state.materialQuantities.paint.type} onValueChange={(value) => handleMaterialTypeChange('paint', value)}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>{getMaterialOptions('paint').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                      <Input type="number" placeholder="Amount (liters)" value={state.materialQuantities.paint.amount || ''} onChange={(e) => handleMaterialAmountChange('paint', parseFloat(e.target.value) || 0)} />
                  </InputBox>
                  
                  {/* Updated Electrical */}
                  <InputBox>
                      <Label>Electrical</Label>
                    <Select value={state.materialQuantities.electrical.components} onValueChange={(value) => handleComponentsChange('electrical', value)}>
                      <SelectTrigger><SelectValue placeholder="Select components" /></SelectTrigger>
                      <SelectContent>{electricalComponentOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                    <Select value={state.materialQuantities.electrical.complexity} onValueChange={(value) => handleComplexityChange('electrical', value)}>
                      <SelectTrigger><SelectValue placeholder="Select complexity" /></SelectTrigger>
                      <SelectContent>{electricalComplexityOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                  </InputBox>

                  {/* Updated Plumbing */}
                   <InputBox>
                      <Label>Plumbing</Label>
                    <Select value={state.materialQuantities.plumbing.components} onValueChange={(value) => handleComponentsChange('plumbing', value)}>
                      <SelectTrigger><SelectValue placeholder="Select components" /></SelectTrigger>
                      <SelectContent>{plumbingComponentOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                    <Select value={state.materialQuantities.plumbing.complexity} onValueChange={(value) => handleComplexityChange('plumbing', value)}>
                     <SelectTrigger><SelectValue placeholder="Select complexity" /></SelectTrigger>
                      <SelectContent>{plumbingComplexityOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                  </InputBox>

                  {/* Updated Fixtures */}
                  <InputBox>
                      <Label>Fixtures</Label>
                    <Select value={state.materialQuantities.fixtures.type} onValueChange={(value) => handleMaterialTypeChange('fixtures', value)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>{fixtureOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                    <Input type="number" placeholder="Count" value={state.materialQuantities.fixtures.count || ''} onChange={(e) => handleMaterialCountChange('fixtures', parseInt(e.target.value) || 0)} />
                  </InputBox>

                   <InputBox>
                      <Label>Windows</Label>
                       <Select value={state.materialQuantities.windows.type} onValueChange={(value) => handleMaterialTypeChange('windows', value)}>
                           <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                           <SelectContent>{getMaterialOptions('windows').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                       <Input type="number" placeholder="Count" value={state.materialQuantities.windows.count || ''} onChange={(e) => handleMaterialCountChange('windows', parseInt(e.target.value) || 0)} />
                   </InputBox>

                   <InputBox>
                      <Label>Doors</Label>
                       <Select value={state.materialQuantities.doors.type} onValueChange={(value) => handleMaterialTypeChange('doors', value)}>
                           <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                           <SelectContent>{getMaterialOptions('doors').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                       <Input type="number" placeholder="Count" value={state.materialQuantities.doors.count || ''} onChange={(e) => handleMaterialCountChange('doors', parseInt(e.target.value) || 0)} />
                   </InputBox>

                   <InputBox>
                      <Label>Roofing</Label>
                       <Select value={state.materialQuantities.roofing.type} onValueChange={(value) => handleMaterialTypeChange('roofing', value)}>
                           <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                           <SelectContent>{getMaterialOptions('roofing').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                       <Input type="number" placeholder="Area (sq. ft.)" value={state.materialQuantities.roofing.area || ''} onChange={(e) => handleMaterialAreaChange('roofing', parseFloat(e.target.value) || 0)} />
                   </InputBox>

                   <InputBox>
                      <Label>Flooring</Label>
                       <Select value={state.materialQuantities.flooring.type} onValueChange={(value) => handleMaterialTypeChange('flooring', value)}>
                           <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                           <SelectContent>{getMaterialOptions('flooring').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                       <Input type="number" placeholder="Area (sq. ft.)" value={state.materialQuantities.flooring.area || ''} onChange={(e) => handleMaterialAreaChange('flooring', parseFloat(e.target.value) || 0)} />
                   </InputBox>

                   <InputBox>
                      <Label>Glasswork</Label>
                       <Select value={state.materialQuantities.glasswork.type} onValueChange={(value) => handleMaterialTypeChange('glasswork', value)}>
                           <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                           <SelectContent>{getMaterialOptions('glasswork').map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                       <Input type="number" placeholder="Area (sq. ft.)" value={state.materialQuantities.glasswork.area || ''} onChange={(e) => handleMaterialAreaChange('glasswork', parseFloat(e.target.value) || 0)} />
                   </InputBox>

                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setCurrentTab('project')}>Back: Project Details</Button>
                  <Button onClick={() => setCurrentTab('labor')} className="ml-auto">Next: Labor</Button>
                </CardFooter>
              </Card>
                </TabsContent>
                
            {/* Labor Tab */} 
            <TabsContent value="labor">
              <Card>
                <CardHeader>
                  <CardTitle>Labor Details</CardTitle>
                  <CardDescription>Specify the required labor force.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <InputBox>
                      <Label>Masons</Label>
                      <Input type="number" placeholder="Number of Workers" value={state.laborDetails.masons.count || ''} onChange={(e) => handleLaborCountChange('masons', parseInt(e.target.value) || 0)} />
                      <Input type="number" placeholder="Work Days" value={state.laborDetails.masons.days || ''} onChange={(e) => handleLaborDaysChange('masons', parseInt(e.target.value) || 0)} />
                   </InputBox>
                   <InputBox>
                      <Label>Carpenters</Label>
                      <Input type="number" placeholder="Number of Workers" value={state.laborDetails.carpenters.count || ''} onChange={(e) => handleLaborCountChange('carpenters', parseInt(e.target.value) || 0)} />
                      <Input type="number" placeholder="Work Days" value={state.laborDetails.carpenters.days || ''} onChange={(e) => handleLaborDaysChange('carpenters', parseInt(e.target.value) || 0)} />
                   </InputBox>
                   <InputBox>
                      <Label>Painters</Label>
                      <Input type="number" placeholder="Number of Workers" value={state.laborDetails.painters.count || ''} onChange={(e) => handleLaborCountChange('painters', parseInt(e.target.value) || 0)} />
                      <Input type="number" placeholder="Work Days" value={state.laborDetails.painters.days || ''} onChange={(e) => handleLaborDaysChange('painters', parseInt(e.target.value) || 0)} />
                   </InputBox>
                    <InputBox>
                      <Label>Electricians</Label>
                      <Input type="number" placeholder="Number of Workers" value={state.laborDetails.electricians.count || ''} onChange={(e) => handleLaborCountChange('electricians', parseInt(e.target.value) || 0)} />
                      <Input type="number" placeholder="Work Days" value={state.laborDetails.electricians.days || ''} onChange={(e) => handleLaborDaysChange('electricians', parseInt(e.target.value) || 0)} />
                    </InputBox>
                    <InputBox>
                      <Label>Plumbers</Label>
                      <Input type="number" placeholder="Number of Workers" value={state.laborDetails.plumbers.count || ''} onChange={(e) => handleLaborCountChange('plumbers', parseInt(e.target.value) || 0)} />
                      <Input type="number" placeholder="Work Days" value={state.laborDetails.plumbers.days || ''} onChange={(e) => handleLaborDaysChange('plumbers', parseInt(e.target.value) || 0)} />
                    </InputBox>
                    <InputBox>
                      <Label>Helpers</Label>
                      <Input type="number" placeholder="Number of Workers" value={state.laborDetails.helpers.count || ''} onChange={(e) => handleLaborCountChange('helpers', parseInt(e.target.value) || 0)} />
                      <Input type="number" placeholder="Work Days" value={state.laborDetails.helpers.days || ''} onChange={(e) => handleLaborDaysChange('helpers', parseInt(e.target.value) || 0)} />
                    </InputBox>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setCurrentTab('materials')}>Back: Materials</Button>
                  <Button onClick={() => setCurrentTab('overhead')} className="ml-auto">Next: Overhead</Button>
                </CardFooter>
              </Card>
                </TabsContent>
                
            {/* Overhead Tab */} 
            <TabsContent value="overhead">
              <Card>
                <CardHeader>
                  <CardTitle>Overhead Costs</CardTitle>
                  <CardDescription>Estimate project overheads.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Updated Permits */}
                  <InputBox>
                      <Label>Permits</Label>
                    <Select value={state.overheadDetails.permits.type} onValueChange={(value) => handleOverheadTypeChange('permits', value)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>{permitTypeOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                    <Select value={state.overheadDetails.permits.complexity} onValueChange={(value) => handleOverheadComplexityChange('permits', value)}>
                      <SelectTrigger><SelectValue placeholder="Select complexity" /></SelectTrigger>
                      <SelectContent>{permitComplexityOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                  </InputBox>

                  {/* Updated Insurance */}
                  <InputBox>
                      <Label>Insurance</Label>
                    <Select value={state.overheadDetails.insurance.coverage} onValueChange={handleOverheadCoverageChange}>
                      <SelectTrigger><SelectValue placeholder="Select coverage" /></SelectTrigger>
                      <SelectContent>{insuranceCoverageOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                    <Input type="number" placeholder="Duration (months)" value={state.overheadDetails.insurance.duration || ''} onChange={(e) => handleOverheadDurationChange('insurance', parseInt(e.target.value) || 0)} />
                  </InputBox>

                  {/* Updated Equipment */}
                  <InputBox>
                    <Label>Equipment Rental</Label>
                    <Select value={state.overheadDetails.equipment.type} onValueChange={(value) => handleOverheadTypeChange('equipment', value)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>{equipmentTypeOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                    <Input type="number" placeholder="Duration (days)" value={state.overheadDetails.equipment.duration || ''} onChange={(e) => handleOverheadDurationChange('equipment', parseInt(e.target.value) || 0)} />
                  </InputBox>

                   <InputBox>
                      <Label>Transportation</Label>
                      <Input type="number" placeholder="Avg. Distance (km)" value={state.overheadDetails.transportation.distance || ''} onChange={(e) => handleOverheadDistanceChange(parseFloat(e.target.value) || 0)} />
                      <Input type="number" placeholder="Trips per Month" value={state.overheadDetails.transportation.frequency || ''} onChange={(e) => handleOverheadFrequencyChange(parseInt(e.target.value) || 0)} />
                   </InputBox>

                  {/* Updated Utilities */}
                  <InputBox>
                    <Label>Site Utilities</Label>
                     <Select value={state.overheadDetails.utilities.type} onValueChange={(value) => handleOverheadTypeChange('utilities', value)}>
                      <SelectTrigger><SelectValue placeholder="Select usage type" /></SelectTrigger>
                      <SelectContent>{utilityTypeOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                    <Input type="number" placeholder="Duration (months)" value={state.overheadDetails.utilities.duration || ''} onChange={(e) => handleOverheadDurationChange('utilities', parseInt(e.target.value) || 0)} />
                  </InputBox>

                  {/* Updated Site Preparation */} 
                  <InputBox>
                      <Label>Site Preparation</Label>
                     <Select value={state.overheadDetails.sitePreparation.complexity} onValueChange={(value) => handleOverheadComplexityChange('sitePreparation', value)}>
                      <SelectTrigger><SelectValue placeholder="Select complexity" /></SelectTrigger>
                      <SelectContent>{sitePreparationComplexityOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                    <Input type="number" placeholder="Area (sq. ft.)" value={state.overheadDetails.sitePreparation.area || ''} onChange={(e) => handleOverheadAreaChange(parseFloat(e.target.value) || 0)} />
                  </InputBox>

            </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setCurrentTab('labor')}>Back: Labor</Button>
                  <Button onClick={handleCalculate} className="ml-auto">Calculate Estimate</Button>
            </CardFooter>
          </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Estimate;
