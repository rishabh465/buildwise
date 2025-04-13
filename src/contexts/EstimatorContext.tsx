
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  ProjectDetails,
  MaterialQuantities,
  LaborDetails,
  OverheadDetails,
  MaterialCosts,
  LaborCosts,
  OverheadCosts,
  CostBreakdown,
  EstimatorState,
  UnitCostDatabase,
  OptimizationSuggestion
} from '@/types/estimator';

// Default values
const defaultProject: ProjectDetails = {
  name: '',
  location: '',
  currency: '₹',
  area: 0,
  constructionType: '',
  floors: 1
};

const defaultMaterialQuantities: MaterialQuantities = {
  sand: { type: 'Fine', amount: 0 },
  cement: { type: 'OPC 43 Grade', amount: 0 },
  aggregate: { type: '20mm', amount: 0 },
  steel: { type: 'TMT Bars', amount: 0 },
  bricks: { type: 'Red Clay', amount: 0 },
  wood: { type: 'Pine', amount: 0 },
  paint: { type: 'Emulsion', amount: 0 },
  electrical: { components: 'Basic', complexity: 'Low' },
  plumbing: { components: 'Basic', complexity: 'Low' },
  fixtures: { type: 'Standard', count: 0 },
  windows: { type: 'Wooden', count: 0 },
  doors: { type: 'Wooden', count: 0 },
  roofing: { type: 'RCC', area: 0 },
  flooring: { type: 'Ceramic Tiles', area: 0 },
  glasswork: { type: 'Plain', area: 0 },
  tilesMarble: { type: 'Ceramic', area: 0 },
};

const defaultLaborDetails: LaborDetails = {
  masons: { count: 0, days: 0 },
  carpenters: { count: 0, days: 0 },
  painters: { count: 0, days: 0 },
  electricians: { count: 0, days: 0 },
  plumbers: { count: 0, days: 0 },
  helpers: { count: 0, days: 0 },
  supervisors: { count: 0, days: 0 }
};

const defaultOverheadDetails: OverheadDetails = {
  permits: { type: 'Basic', complexity: 'Low' },
  design: { complexity: 'Low', revisions: 0 },
  insurance: { coverage: 'Basic', duration: 0 },
  equipment: { type: 'Basic', duration: 0 },
  transportation: { distance: 0, frequency: 0 },
  utilities: { type: 'Basic', duration: 0 },
  sitePreparation: { complexity: 'Low', area: 0 },
  contingency: { percentage: 5 }
};

const defaultMaterials: MaterialCosts = {
  cement: 0,
  sand: 0,
  aggregate: 0,
  steel: 0,
  bricks: 0,
  wood: 0,
  paint: 0,
  electrical: 0,
  plumbing: 0,
  fixtures: 0,
  windows: 0,
  doors: 0,
  roofing: 0,
  flooring: 0,
  glasswork: 0,
  tilesMarble: 0,
  miscellaneous: 0
};

const defaultLabor: LaborCosts = {
  masons: 0,
  carpenters: 0,
  painters: 0,
  electricians: 0,
  plumbers: 0,
  helpers: 0,
  supervisors: 0
};

const defaultOverhead: OverheadCosts = {
  permits: 0,
  design: 0,
  insurance: 0,
  equipment: 0,
  transportation: 0,
  utilities: 0,
  sitePreparation: 0,
  contingency: 0
};

// Dummy cost database - in a real application this would come from a backend
const unitCostDatabase: UnitCostDatabase = {
  materials: {
    sand: {
      'Fine': 1800,
      'Coarse': 2200,
      'River': 2500,
      'Manufactured': 2100,
      'Desert': 1700
    },
    cement: {
      'OPC 33 Grade': 350,
      'OPC 43 Grade': 380,
      'OPC 53 Grade': 410,
      'PPC': 360,
      'PSC': 370,
      'White Cement': 950
    },
    aggregate: {
      '10mm': 1800,
      '20mm': 1600,
      '40mm': 1500,
      '60mm': 1450,
      'Recycled': 1200
    },
    steel: {
      'TMT Bars': 65,
      'Mild Steel': 60,
      'Stainless Steel': 180,
      'CRS Bars': 75,
      'High Tensile': 85
    },
    bricks: {
      'Red Clay': 8,
      'Fly Ash': 7,
      'AAC Blocks': 60,
      'CLC Blocks': 50,
      'Concrete Blocks': 45,
      'Fire Bricks': 18
    },
    wood: {
      'Pine': 1200,
      'Teak': 3500,
      'Oak': 2800,
      'Mahogany': 3200,
      'Walnut': 2900,
      'Cedar': 2500,
      'Ash': 2200,
      'Maple': 2600
    },
    paint: {
      'Emulsion': 250,
      'Enamel': 290,
      'Distemper': 160,
      'Exterior': 320,
      'Acrylic': 300,
      'Luxury': 550,
      'Anti-fungal': 380
    },
    electrical: {
      'Basic': {
        'Low': 15000,
        'Medium': 25000,
        'High': 40000
      },
      'Standard': {
        'Low': 30000,
        'Medium': 45000,
        'High': 65000
      },
      'Premium': {
        'Low': 60000,
        'Medium': 85000,
        'High': 120000
      },
      'Smart': {
        'Low': 80000,
        'Medium': 120000,
        'High': 180000
      }
    },
    plumbing: {
      'Basic': {
        'Low': 18000,
        'Medium': 30000,
        'High': 45000
      },
      'Standard': {
        'Low': 40000,
        'Medium': 55000,
        'High': 75000
      },
      'Premium': {
        'Low': 70000,
        'Medium': 95000,
        'High': 130000
      },
      'Luxury': {
        'Low': 100000,
        'Medium': 135000,
        'High': 180000
      }
    },
    fixtures: {
      'Basic': 2000,
      'Standard': 3500,
      'Premium': 7000,
      'Luxury': 12000,
      'Designer': 18000
    },
    windows: {
      'Wooden': 5000,
      'Aluminum': 7000,
      'UPVC': 9000,
      'Steel': 6500,
      'Soundproof': 12000,
      'Double Glazed': 14000
    },
    doors: {
      'Wooden': 4500,
      'Flush': 3000,
      'Fiber': 6000,
      'PVC': 3500,
      'Metal': 8000,
      'Security': 12000
    },
    roofing: {
      'RCC': 2200,
      'Metal Sheet': 1200,
      'Clay Tiles': 1800,
      'Asphalt Shingles': 1400,
      'Green Roof': 3000,
      'Solar Tiles': 5500
    },
    flooring: {
      'Ceramic Tiles': 850,
      'Vitrified Tiles': 1200,
      'Marble': 2500,
      'Granite': 2200,
      'Wooden': 1800,
      'Laminate': 1000,
      'Vinyl': 750,
      'Concrete': 600,
      'Epoxy': 1500
    },
    glasswork: {
      'Plain': 700,
      'Toughened': 1800,
      'Tinted': 1100,
      'Reflective': 1600,
      'Insulated': 2200,
      'Smart Glass': 4500
    },
    tilesMarble: {
      'Ceramic': 850,
      'Vitrified': 1200,
      'Marble': 2500,
      'Granite': 2200,
      'Travertine': 2100,
      'Slate': 1800,
      'Onyx': 3800,
      'Limestone': 1600
    },
  },
  labor: {
    mason: 800,
    carpenter: 900,
    painter: 700,
    electrician: 1000,
    plumber: 1000,
    helper: 500,
    supervisor: 1500
  },
  overhead: {
    permits: {
      'Basic': {
        'Low': 15000,
        'Medium': 25000,
        'High': 40000
      },
      'Complex': {
        'Low': 35000,
        'Medium': 50000,
        'High': 80000
      },
      'Industrial': {
        'Low': 50000,
        'Medium': 75000,
        'High': 100000
      }
    },
    design: {
      'Low': {
        1: 30000,
        2: 40000,
        3: 50000
      },
      'Medium': {
        1: 60000,
        2: 75000,
        3: 90000
      },
      'High': {
        1: 100000,
        2: 120000,
        3: 150000
      },
      'Premium': {
        1: 180000,
        2: 220000,
        3: 280000
      }
    },
    insurance: {
      'Basic': 250,
      'Standard': 400,
      'Comprehensive': 600,
      'Premium': 900
    },
    equipment: {
      'Basic': 1000,
      'Standard': 2000,
      'Heavy': 5000,
      'Specialized': 8000
    },
    utilities: {
      'Basic': 30,
      'Standard': 50,
      'High': 80,
      'Industrial': 150
    },
    sitePreparation: {
      'Low': 75,
      'Medium': 150,
      'High': 300,
      'Complex': 500
    }
  },
};

interface EstimatorContextType {
  state: EstimatorState;
  updateProject: (project: Partial<ProjectDetails>) => void;
  updateMaterialQuantities: (materials: Partial<MaterialQuantities>) => void;
  updateLaborDetails: (labor: Partial<LaborDetails>) => void;
  updateOverheadDetails: (overhead: Partial<OverheadDetails>) => void;
  calculateCosts: () => void;
  generateOptimization: () => void;
  resetEstimator: () => void;
  formatCurrency: (value: number) => string;
  getMaterialOptions: (material: string) => string[];
  getComplexityOptions: () => string[];
}

const EstimatorContext = createContext<EstimatorContextType | undefined>(undefined);

export const EstimatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const [state, setState] = useState<EstimatorState>({
    project: defaultProject,
    materialQuantities: defaultMaterialQuantities,
    laborDetails: defaultLaborDetails,
    overheadDetails: defaultOverheadDetails,
    materials: defaultMaterials,
    labor: defaultLabor,
    overhead: defaultOverhead,
    breakdown: null,
    optimization: null,
    isCalculated: false,
    isOptimized: false,
    errors: {}
  });

  const updateProject = (project: Partial<ProjectDetails>) => {
    setState((prev) => ({
      ...prev,
      project: { ...prev.project, ...project },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const updateMaterialQuantities = (materials: Partial<MaterialQuantities>) => {
    setState((prev) => ({
      ...prev,
      materialQuantities: { ...prev.materialQuantities, ...materials },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const updateLaborDetails = (labor: Partial<LaborDetails>) => {
    setState((prev) => ({
      ...prev,
      laborDetails: { ...prev.laborDetails, ...labor },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const updateOverheadDetails = (overhead: Partial<OverheadDetails>) => {
    setState((prev) => ({
      ...prev,
      overheadDetails: { ...prev.overheadDetails, ...overhead },
      isCalculated: false,
      isOptimized: false
    }));
  };

  const getMaterialOptions = (material: string): string[] => {
    if (material in unitCostDatabase.materials) {
      return Object.keys(unitCostDatabase.materials[material as keyof typeof unitCostDatabase.materials]);
    }
    return [];
  };

  const getComplexityOptions = (): string[] => {
    return ['Low', 'Medium', 'High'];
  };

  const calculateCosts = () => {
    try {
      const materials = calculateMaterialCosts();
      const labor = calculateLaborCosts();
      const overhead = calculateOverheadCosts();
      
      // Calculate material costs
      let materialTotal = 0;
      const materialItems: Record<string, number> = {};
      
      Object.entries(materials).forEach(([key, value]) => {
        materialItems[key] = value as number;
        materialTotal += value as number;
      });

      // Calculate labor costs
      let laborTotal = 0;
      const laborItems: Record<string, number> = {};
      
      Object.entries(labor).forEach(([key, value]) => {
        laborItems[key] = value as number;
        laborTotal += value as number;
      });

      // Calculate overhead costs
      let overheadTotal = 0;
      const overheadItems: Record<string, number> = {};
      
      Object.entries(overhead).forEach(([key, value]) => {
        overheadItems[key] = value as number;
        overheadTotal += value as number;
      });

      // Calculate total cost
      const total = materialTotal + laborTotal + overheadTotal;

      const breakdown: CostBreakdown = {
        materials: {
          total: materialTotal,
          items: materialItems
        },
        labor: {
          total: laborTotal,
          items: laborItems
        },
        overhead: {
          total: overheadTotal,
          items: overheadItems
        },
        total
      };

      setState((prev) => ({
        ...prev,
        materials,
        labor,
        overhead,
        breakdown,
        isCalculated: true,
        errors: {}
      }));

      toast({
        title: "Cost calculation complete",
        description: `Total estimated cost: ${formatCurrency(total)}`,
      });

    } catch (error) {
      console.error("Error calculating costs:", error);
      
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: "Failed to calculate costs. Please check your inputs.",
      });

      setState((prev) => ({
        ...prev,
        errors: { 
          ...prev.errors, 
          calculation: 'Failed to calculate costs. Please check your inputs and try again.' 
        }
      }));
    }
  };

  const calculateMaterialCosts = (): MaterialCosts => {
    const { materialQuantities } = state;
    const materials = { ...defaultMaterials };

    // Sand
    materials.sand = unitCostDatabase.materials.sand[materialQuantities.sand.type] * 
      materialQuantities.sand.amount;
    
    // Cement
    materials.cement = unitCostDatabase.materials.cement[materialQuantities.cement.type] * 
      materialQuantities.cement.amount;
    
    // Aggregate
    materials.aggregate = unitCostDatabase.materials.aggregate[materialQuantities.aggregate.type] * 
      materialQuantities.aggregate.amount;
    
    // Steel
    materials.steel = unitCostDatabase.materials.steel[materialQuantities.steel.type] * 
      materialQuantities.steel.amount;
    
    // Bricks
    materials.bricks = unitCostDatabase.materials.bricks[materialQuantities.bricks.type] * 
      materialQuantities.bricks.amount;
    
    // Wood
    materials.wood = unitCostDatabase.materials.wood[materialQuantities.wood.type] * 
      materialQuantities.wood.amount;
    
    // Paint
    materials.paint = unitCostDatabase.materials.paint[materialQuantities.paint.type] * 
      materialQuantities.paint.amount;
    
    // Electrical - Fix types issue
    const electricalComponents = materialQuantities.electrical.components;
    const electricalComplexity = materialQuantities.electrical.complexity;
    if (electricalComponents && electricalComplexity && 
        unitCostDatabase.materials.electrical[electricalComponents] && 
        unitCostDatabase.materials.electrical[electricalComponents][electricalComplexity]) {
      materials.electrical = unitCostDatabase.materials.electrical[electricalComponents][electricalComplexity];
    }
    
    // Plumbing - Fix types issue
    const plumbingComponents = materialQuantities.plumbing.components;
    const plumbingComplexity = materialQuantities.plumbing.complexity;
    if (plumbingComponents && plumbingComplexity && 
        unitCostDatabase.materials.plumbing[plumbingComponents] && 
        unitCostDatabase.materials.plumbing[plumbingComponents][plumbingComplexity]) {
      materials.plumbing = unitCostDatabase.materials.plumbing[plumbingComponents][plumbingComplexity];
    }
    
    // Fixtures
    materials.fixtures = unitCostDatabase.materials.fixtures[materialQuantities.fixtures.type] * 
      materialQuantities.fixtures.count;
    
    // Windows
    materials.windows = unitCostDatabase.materials.windows[materialQuantities.windows.type] * 
      materialQuantities.windows.count;
    
    // Doors
    materials.doors = unitCostDatabase.materials.doors[materialQuantities.doors.type] * 
      materialQuantities.doors.count;
    
    // Roofing
    materials.roofing = unitCostDatabase.materials.roofing[materialQuantities.roofing.type] * 
      materialQuantities.roofing.area;
    
    // Flooring
    materials.flooring = unitCostDatabase.materials.flooring[materialQuantities.flooring.type] * 
      materialQuantities.flooring.area;
    
    // Glasswork
    materials.glasswork = unitCostDatabase.materials.glasswork[materialQuantities.glasswork.type] * 
      materialQuantities.glasswork.area;
    
    // Tiles/Marble
    materials.tilesMarble = unitCostDatabase.materials.tilesMarble[materialQuantities.tilesMarble.type] * 
      materialQuantities.tilesMarble.area;
    
    // Miscellaneous (calculated as 2% of total material cost)
    const subtotal = Object.values(materials).reduce((sum, cost) => sum + (cost || 0), 0);
    materials.miscellaneous = subtotal * 0.02;
    
    return materials;
  };

  const calculateLaborCosts = (): LaborCosts => {
    const { laborDetails } = state;
    const labor = { ...defaultLabor };

    // Masons
    labor.masons = unitCostDatabase.labor.mason * 
      laborDetails.masons.count * laborDetails.masons.days;
    
    // Carpenters
    labor.carpenters = unitCostDatabase.labor.carpenter * 
      laborDetails.carpenters.count * laborDetails.carpenters.days;
    
    // Painters
    labor.painters = unitCostDatabase.labor.painter * 
      laborDetails.painters.count * laborDetails.painters.days;
    
    // Electricians
    labor.electricians = unitCostDatabase.labor.electrician * 
      laborDetails.electricians.count * laborDetails.electricians.days;
    
    // Plumbers
    labor.plumbers = unitCostDatabase.labor.plumber * 
      laborDetails.plumbers.count * laborDetails.plumbers.days;
    
    // Helpers
    labor.helpers = unitCostDatabase.labor.helper * 
      laborDetails.helpers.count * laborDetails.helpers.days;
    
    // Supervisors
    labor.supervisors = unitCostDatabase.labor.supervisor * 
      laborDetails.supervisors.count * laborDetails.supervisors.days;
    
    return labor;
  };

  const calculateOverheadCosts = (): OverheadCosts => {
    const { overheadDetails, project } = state;
    const overhead = { ...defaultOverhead };

    // Permits - Fix types issue
    const permitType = overheadDetails.permits.type;
    const permitComplexity = overheadDetails.permits.complexity;
    if (permitType && permitComplexity && 
        unitCostDatabase.overhead.permits[permitType] && 
        unitCostDatabase.overhead.permits[permitType][permitComplexity]) {
      overhead.permits = unitCostDatabase.overhead.permits[permitType][permitComplexity];
    }
    
    // Design - Fix types issue
    const designComplexity = overheadDetails.design.complexity;
    const revisions = Math.min(overheadDetails.design.revisions, 3);
    if (designComplexity && unitCostDatabase.overhead.design[designComplexity] && 
        unitCostDatabase.overhead.design[designComplexity][revisions || 1]) {
      overhead.design = unitCostDatabase.overhead.design[designComplexity][revisions || 1];
    }
    
    // Insurance
    overhead.insurance = unitCostDatabase.overhead.insurance[overheadDetails.insurance.coverage] * 
      overheadDetails.insurance.duration;
    
    // Equipment
    overhead.equipment = unitCostDatabase.overhead.equipment[overheadDetails.equipment.type] * 
      overheadDetails.equipment.duration;
    
    // Transportation
    overhead.transportation = overheadDetails.transportation.distance * 
      overheadDetails.transportation.frequency * 50; // Assume ₹50 per km
    
    // Utilities
    overhead.utilities = unitCostDatabase.overhead.utilities[overheadDetails.utilities.type] * 
      overheadDetails.utilities.duration;
    
    // Site Preparation
    overhead.sitePreparation = unitCostDatabase.overhead.sitePreparation[overheadDetails.sitePreparation.complexity] * 
      overheadDetails.sitePreparation.area;
    
    // Calculate material and labor costs to determine contingency
    const materialCosts = calculateMaterialCosts();
    const laborCosts = calculateLaborCosts();
    
    const materialTotal = Object.values(materialCosts).reduce((sum, cost) => sum + (cost || 0), 0);
    const laborTotal = Object.values(laborCosts).reduce((sum, cost) => sum + (cost || 0), 0);
    const overheadSubtotal = Object.values(overhead).reduce((sum, cost) => sum + (cost || 0), 0);
    
    // Contingency (based on percentage of total project cost)
    overhead.contingency = (materialTotal + laborTotal + overheadSubtotal) * 
      (overheadDetails.contingency.percentage / 100);
    
    return overhead;
  };

  const generateOptimization = () => {
    if (!state.breakdown) {
      toast({
        variant: "destructive",
        title: "Optimization Error",
        description: "Please calculate costs first before generating optimization suggestions.",
      });
      return;
    }

    try {
      // Set loading state or notification
      toast({
        title: "Generating optimization",
        description: "Analyzing your project data...",
      });
      
      // In a real implementation with Gemini, we would make an API call here
      // For this implementation, we'll simulate the AI response
      
      // Prepare prompt based on project details for Gemini
      const prompt = generateGeminiPrompt(state);
      
      // Log the prompt that would be sent to Gemini
      console.log("Gemini Prompt:", prompt);
      
      // Simulate AI processing time
      setTimeout(() => {
        // Generate AI-based optimization suggestions
        const suggestions = generateAIOptimizations(state);
        
        // Calculate potential savings and optimized total
        const potentialSavings = suggestions.reduce((total, suggestion) => total + suggestion.potentialSavings, 0);
        
        // Make sure optimized total is never negative
        const optimizedTotal = Math.max(
          (state.breakdown?.total as number) - potentialSavings, 
          (state.breakdown?.total as number) * 0.6
        );

        const optimization = {
          suggestions,
          potentialSavings,
          optimizedTotal
        };

        setState((prev) => ({
          ...prev,
          optimization,
          isOptimized: true
        }));

        toast({
          title: "Optimization complete",
          description: `Potential savings identified: ${formatCurrency(potentialSavings)}`,
        });
      }, 1500);

    } catch (error) {
      console.error("Error generating optimization:", error);
      
      toast({
        variant: "destructive",
        title: "Optimization Error",
        description: "Failed to generate optimization suggestions. Please try again.",
      });
    }
  };
  
  // Helper function to generate prompt for Gemini
  const generateGeminiPrompt = (state: EstimatorState): string => {
    const { project, materialQuantities, laborDetails, overheadDetails, breakdown } = state;
    
    // Create a structured prompt for Gemini
    return `
    As a construction cost optimization expert, analyze the following construction project details and suggest cost-saving measures:
    
    Project Name: ${project.name}
    Location: ${project.location}
    Construction Type: ${project.constructionType}
    Area: ${project.area} sq. ft.
    Floors: ${project.floors}
    
    Current Cost Breakdown:
    - Total Cost: ${breakdown ? formatCurrency(breakdown.total) : 'Not calculated'}
    - Materials: ${breakdown ? formatCurrency(breakdown.materials.total) : 'Not calculated'}
    - Labor: ${breakdown ? formatCurrency(breakdown.labor.total) : 'Not calculated'}
    - Overhead: ${breakdown ? formatCurrency(breakdown.overhead.total) : 'Not calculated'}
    
    Material Details:
    - Cement: ${materialQuantities.cement.type}, ${materialQuantities.cement.amount} bags
    - Sand: ${materialQuantities.sand.type}, ${materialQuantities.sand.amount} cubic meters
    - Bricks: ${materialQuantities.bricks.type}, ${materialQuantities.bricks.amount} units
    - Steel: ${materialQuantities.steel.type}, ${materialQuantities.steel.amount} kg
    
    Labor Details:
    - Masons: ${laborDetails.masons.count} workers for ${laborDetails.masons.days} days
    - Carpenters: ${laborDetails.carpenters.count} workers for ${laborDetails.carpenters.days} days
    - Electricians: ${laborDetails.electricians.count} workers for ${laborDetails.electricians.days} days
    - Plumbers: ${laborDetails.plumbers.count} workers for ${laborDetails.plumbers.days} days
    
    Please provide 5 specific cost optimization suggestions that could reduce the overall project cost. 
    For each suggestion:
    1. Provide a clear title
    2. Write a detailed description of the suggestion
    3. Estimate the potential savings in INR
    4. Rate the implementation complexity (low, medium, high)
    5. Assess the impact on project timeline (none, minimal, moderate, significant)
    6. Assess the impact on quality (none, minimal, moderate, significant)
    7. Categorize the suggestion (materials, labor, design, scheduling, procurement, other)
    `;
  };
  
  // Function to generate AI-based optimization suggestions
  const generateAIOptimizations = (state: EstimatorState): OptimizationSuggestion[] => {
    // In a real implementation, these would come from Gemini AI
    // For now, we'll generate smart suggestions based on the project data
    
    const suggestions: OptimizationSuggestion[] = [];
    const { materials, labor, overhead, breakdown, materialQuantities, laborDetails, overheadDetails } = state;
    
    // Only proceed if we have breakdown data
    if (!breakdown) return [];
    
    // Analyze cement costs
    if (materials.cement > 0 && materialQuantities.cement.type === 'OPC 53 Grade') {
      suggestions.push({
        id: uuidv4(),
        category: 'materials',
        title: 'Optimize cement usage with alternative grade',
        description: 'Switch from OPC 53 Grade cement to OPC 43 Grade cement for non-structural components. This grade is sufficient for most residential purposes and costs less while maintaining adequate strength properties.',
        potentialSavings: materials.cement * 0.18,
        implementationComplexity: 'low',
        timeImpact: 'none',
        qualityImpact: 'minimal'
      });
    }
    
    // Analyze brick usage
    if (materials.bricks > 0 && materialQuantities.bricks.type === 'Red Clay') {
      suggestions.push({
        id: uuidv4(),
        category: 'materials',
        title: 'Consider Fly Ash bricks instead of Red Clay',
        description: 'Fly Ash bricks are more economical, environmentally friendly, and have better thermal insulation properties compared to traditional red clay bricks, reducing the overall cost without compromising quality.',
        potentialSavings: materials.bricks * 0.15,
        implementationComplexity: 'low',
        timeImpact: 'none',
        qualityImpact: 'none'
      });
    }
    
    // Analyze steel costs
    if (materials.steel > 0 && materials.steel > materials.cement) {
      suggestions.push({
        id: uuidv4(),
        category: 'design',
        title: 'Structural optimization for steel efficiency',
        description: 'Consider redesigning reinforcement layouts using BIM (Building Information Modeling) to optimize steel placement. Advanced structural analysis can reduce steel quantities by 10-15% without compromising strength.',
        potentialSavings: materials.steel * 0.12,
        implementationComplexity: 'medium',
        timeImpact: 'minimal',
        qualityImpact: 'none'
      });
    }
    
    // Analyze labor costs for masons
    if (laborDetails.masons.count > 0 && laborDetails.masons.days > 30) {
      suggestions.push({
        id: uuidv4(),
        category: 'labor',
        title: 'Optimize mason scheduling with prefabricated elements',
        description: 'Incorporate prefabricated elements where possible to reduce the number of days required for masons. This approach can significantly reduce labor costs while potentially improving quality and consistency.',
        potentialSavings: labor.masons * 0.22,
        implementationComplexity: 'medium',
        timeImpact: 'minimal',
        qualityImpact: 'minimal'
      });
    }
    
    // Analyze labor costs for helpers
    if (labor.helpers > 0 && laborDetails.helpers.count > laborDetails.masons.count + laborDetails.carpenters.count) {
      suggestions.push({
        id: uuidv4(),
        category: 'labor',
        title: 'Optimize workforce ratio for helpers',
        description: 'The current ratio of helpers to skilled workers appears high. Implement a balanced ratio of 2 helpers per 3 skilled workers to improve productivity and reduce labor costs.',
        potentialSavings: labor.helpers * 0.15,
        implementationComplexity: 'low',
        timeImpact: 'none',
        qualityImpact: 'none'
      });
    }
    
    // Analyze procurement approach
    if ((materials.cement + materials.steel + materials.bricks) > 0) {
      suggestions.push({
        id: uuidv4(),
        category: 'procurement',
        title: 'Bulk material procurement strategy',
        description: 'Consolidate material orders and schedule deliveries to match construction phases. Negotiate bulk pricing with suppliers for major materials, potentially saving 7-10% on key materials.',
        potentialSavings: (materials.cement + materials.steel + materials.bricks) * 0.08,
        implementationComplexity: 'low',
        timeImpact: 'none',
        qualityImpact: 'none'
      });
    }
    
    // Analyze overhead costs
    if (overhead.equipment > 0 && overheadDetails.equipment.type === 'Heavy') {
      suggestions.push({
        id: uuidv4(),
        category: 'other',
        title: 'Equipment sharing and rental optimization',
        description: 'Instead of full-time equipment rental, analyze usage patterns and schedule equipment only when needed. Consider sharing heavy equipment between work zones or using smaller equipment where appropriate.',
        potentialSavings: overhead.equipment * 0.22,
        implementationComplexity: 'low',
        timeImpact: 'minimal',
        qualityImpact: 'none'
      });
    }
    
    // If we have high design costs
    if (overhead.design > (breakdown.total * 0.05)) {
      suggestions.push({
        id: uuidv4(),
        category: 'design',
        title: 'Design standardization for repetitive elements',
        description: 'Standardize design elements that are repeated throughout the project, such as door/window sizes, bathroom layouts, or structural components. This reduces design time, material waste, and improves construction efficiency.',
        potentialSavings: overhead.design * 0.15,
        implementationComplexity: 'medium',
        timeImpact: 'minimal',
        qualityImpact: 'none'
      });
    }
    
    // If flooring is expensive
    if (materials.flooring > breakdown.materials.total * 0.1 && materialQuantities.flooring.type === 'Marble') {
      suggestions.push({
        id: uuidv4(),
        category: 'materials',
        title: 'Strategic flooring material selection',
        description: 'Use premium materials like marble only in high-visibility areas (living room, entrance) and use less expensive but durable alternatives like vitrified tiles in other areas such as bedrooms and utility spaces.',
        potentialSavings: materials.flooring * 0.30,
        implementationComplexity: 'low',
        timeImpact: 'none',
        qualityImpact: 'minimal'
      });
    }
    
    // Site preparation optimization
    if (overhead.sitePreparation > 0 && overheadDetails.sitePreparation.complexity === 'High') {
      suggestions.push({
        id: uuidv4(),
        category: 'other',
        title: 'Phased site preparation approach',
        description: 'Implement a phased site preparation strategy instead of preparing the entire site at once. This reduces initial costs and allows for better resource allocation throughout the project timeline.',
        potentialSavings: overhead.sitePreparation * 0.18,
        implementationComplexity: 'medium',
        timeImpact: 'minimal',
        qualityImpact: 'none'
      });
    }
    
    // Take the top 5 suggestions by potential savings
    return suggestions.sort((a, b) => b.potentialSavings - a.potentialSavings).slice(0, 5);
  };
  
  const resetEstimator = () => {
    setState({
      project: defaultProject,
      materialQuantities: defaultMaterialQuantities,
      laborDetails: defaultLaborDetails,
      overheadDetails: defaultOverheadDetails,
      materials: defaultMaterials,
      labor: defaultLabor,
      overhead: defaultOverhead,
      breakdown: null,
      optimization: null,
      isCalculated: false,
      isOptimized: false,
      errors: {}
    });
    
    toast({
      title: "Estimator reset",
      description: "All data has been cleared."
    });
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <EstimatorContext.Provider
      value={{
        state,
        updateProject,
        updateMaterialQuantities,
        updateLaborDetails,
        updateOverheadDetails,
        calculateCosts,
        generateOptimization,
        resetEstimator,
        formatCurrency,
        getMaterialOptions,
        getComplexityOptions
      }}
    >
      {children}
    </EstimatorContext.Provider>
  );
};

export const useEstimator = () => {
  const context = useContext(EstimatorContext);
  if (context === undefined) {
    throw new Error('useEstimator must be used within an EstimatorProvider');
  }
  return context;
};
