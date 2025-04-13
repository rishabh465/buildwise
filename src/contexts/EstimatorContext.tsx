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

// Default values - Updated with more specific defaults
const defaultProject: ProjectDetails = {
  name: '',
  location: '',
  currency: '₹',
  area: 0,
  constructionType: '',
  floors: 1
};

const defaultMaterialQuantities: MaterialQuantities = {
  sand: { type: 'River', amount: 0 }, // Changed default
  cement: { type: 'OPC 43 Grade', amount: 0 },
  aggregate: { type: '20mm', amount: 0 },
  steel: { type: 'TMT Bars', amount: 0 },
  bricks: { type: 'Fly Ash', amount: 0 }, // Changed default
  wood: { type: 'Pine', amount: 0 },
  paint: { type: 'Emulsion', amount: 0 },
  electrical: { components: 'PVC Conduits', complexity: 'Standard Wiring' }, // Updated
  plumbing: { components: 'CPVC Pipes', complexity: 'Standard Layout' }, // Updated
  fixtures: { type: 'Mid-Range', count: 0 }, // Updated
  windows: { type: 'Aluminum', count: 0 }, // Changed default
  doors: { type: 'Flush', count: 0 }, // Changed default
  roofing: { type: 'RCC', area: 0 },
  flooring: { type: 'Vitrified Tiles', area: 0 }, // Changed default
  glasswork: { type: 'Plain', area: 0 },
};

const defaultLaborDetails: LaborDetails = {
  masons: { count: 0, days: 0 },
  carpenters: { count: 0, days: 0 },
  painters: { count: 0, days: 0 },
  electricians: { count: 0, days: 0 },
  plumbers: { count: 0, days: 0 },
  helpers: { count: 0, days: 0 },
};

const defaultOverheadDetails: OverheadDetails = {
  permits: { type: 'Residential', complexity: 'Standard Review' }, // Updated
  insurance: { coverage: 'Builder\'s Risk', duration: 0 }, // Updated & Escaped quote
  equipment: { type: 'Standard Tools', duration: 0 }, // Updated
  transportation: { distance: 0, frequency: 0 },
  utilities: { type: 'Standard Usage', duration: 0 }, // Updated
  sitePreparation: { complexity: 'Minor Clearing', area: 0 }, // Updated
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
  miscellaneous: 0
};

const defaultLabor: LaborCosts = {
  masons: 0,
  carpenters: 0,
  painters: 0,
  electricians: 0,
  plumbers: 0,
  helpers: 0,
};

const defaultOverhead: OverheadCosts = {
  permits: 0,
  insurance: 0,
  equipment: 0,
  transportation: 0,
  utilities: 0,
  sitePreparation: 0,
};

// Updated Unit Cost Database with specific keys
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
    electrical: { // Updated keys
      'PVC Conduits': { 'Standard Wiring': 15000, 'Complex Wiring': 25000, 'Industrial Grade': 40000 },
      'Metal Conduits': { 'Standard Wiring': 30000, 'Complex Wiring': 45000, 'Industrial Grade': 65000 },
      'High Spec': { 'Standard Wiring': 60000, 'Complex Wiring': 85000, 'Industrial Grade': 120000 },
      'Smart Home': { 'Standard Wiring': 80000, 'Complex Wiring': 120000, 'Industrial Grade': 180000 }
    },
    plumbing: { // Updated keys
      'PVC Pipes': { 'Standard Layout': 18000, 'Complex Layout': 30000, 'Multi-Story': 45000 },
      'CPVC Pipes': { 'Standard Layout': 40000, 'Complex Layout': 55000, 'Multi-Story': 75000 },
      'Copper Pipes': { 'Standard Layout': 70000, 'Complex Layout': 95000, 'Multi-Story': 130000 },
      'PEX Tubing': { 'Standard Layout': 100000, 'Complex Layout': 135000, 'Multi-Story': 180000 }
    },
    fixtures: { // Updated keys
      'Basic': 2000, // Kept Basic as an option
      'Mid-Range': 3500,
      'High-End': 7000,
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
  },
  labor: {
    mason: 800,
    carpenter: 900,
    painter: 700,
    electrician: 1000,
    plumber: 1000,
    helper: 500,
  },
  overhead: {
    permits: { // Updated keys
      'Residential': { 'Standard Review': 15000, 'Detailed Scrutiny': 25000, 'Complex Zoning': 40000 },
      'Commercial': { 'Standard Review': 35000, 'Detailed Scrutiny': 50000, 'Complex Zoning': 80000 },
      'Industrial/Special': { 'Standard Review': 50000, 'Detailed Scrutiny': 75000, 'Complex Zoning': 100000 }
    },
    insurance: { // Updated keys
      'Contractor Liability': 250,
      'Builder\'s Risk': 400, // Escaped quote
      'All Risk Policy': 600,
      'Premium Coverage': 900
    },
    equipment: { // Updated keys
      'Hand Tools/Light': 1000,
      'Standard Construction': 2000,
      'Heavy Machinery': 5000,
      'Specialized Gear': 8000
    },
    utilities: { // Updated keys
      'Temporary Site': 30,
      'Standard Usage': 50,
      'High Demand': 80,
      'Industrial Needs': 150
    },
    sitePreparation: { // Updated keys
      'Minor Clearing': 75,
      'Grading Needed': 150,
      'Significant Earthwork': 300,
      'Complex Terrain': 500
    }
  },
};

// Helper functions to get new options (used internally)
const electricalComponentOptions = () => Object.keys(unitCostDatabase.materials.electrical);
const electricalComplexityOptions = () => Object.keys(unitCostDatabase.materials.electrical['PVC Conduits']); 
const plumbingComponentOptions = () => Object.keys(unitCostDatabase.materials.plumbing);
const plumbingComplexityOptions = () => Object.keys(unitCostDatabase.materials.plumbing['CPVC Pipes']);
const fixtureOptions = () => Object.keys(unitCostDatabase.materials.fixtures);
const permitTypeOptions = () => Object.keys(unitCostDatabase.overhead.permits);
const permitComplexityOptions = () => Object.keys(unitCostDatabase.overhead.permits['Residential']);
const insuranceCoverageOptions = () => Object.keys(unitCostDatabase.overhead.insurance);
const equipmentTypeOptions = () => Object.keys(unitCostDatabase.overhead.equipment);
const utilityTypeOptions = () => Object.keys(unitCostDatabase.overhead.utilities);
const sitePreparationComplexityOptions = () => Object.keys(unitCostDatabase.overhead.sitePreparation);

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
  downloadReportAsTxt: () => void;
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
      // This function might still be useful for materials not covered by specific helpers
      // e.g., sand, cement, aggregate, steel, bricks, wood, paint, windows, doors, roofing, flooring, glasswork
      if (material in unitCostDatabase.materials) {
          const categoryData = unitCostDatabase.materials[material as keyof typeof unitCostDatabase.materials];
          // Ensure categoryData is treated as a simple key-value map for these cases
          if (typeof categoryData === 'object' && categoryData !== null && !Object.values(categoryData).some(val => typeof val === 'object')) {
              return Object.keys(categoryData);
          }
      }
      return []; // Return empty if not a simple material type or not found
  };

  const getComplexityOptions = (): string[] => { 
      // This is now less useful as complexities are specific per category
      // Returning a generic list might be confusing. Consider removing or making specific.
      return []; // Return empty or a default/error list
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

    // Use simple lookups for materials like sand, cement, fixtures, etc.
    // Need to ensure the type assertion handles both simple and nested lookups correctly
    // or use type guards.

    // Example for a simple lookup (Sand)
    const sandUnitCost = (unitCostDatabase.materials.sand as { [key: string]: number })[materialQuantities.sand.type];
    materials.sand = (sandUnitCost || 0) * materialQuantities.sand.amount;

    // Example for a simple lookup (Cement)
    const cementUnitCost = (unitCostDatabase.materials.cement as { [key: string]: number })[materialQuantities.cement.type];
    materials.cement = (cementUnitCost || 0) * materialQuantities.cement.amount;
    
    // ... (Repeat for Aggregate, Steel, Bricks, Wood, Paint) ...
    const aggregateUnitCost = (unitCostDatabase.materials.aggregate as { [key: string]: number })[materialQuantities.aggregate.type];
    materials.aggregate = (aggregateUnitCost || 0) * materialQuantities.aggregate.amount;

    const steelUnitCost = (unitCostDatabase.materials.steel as { [key: string]: number })[materialQuantities.steel.type];
    materials.steel = (steelUnitCost || 0) * materialQuantities.steel.amount;

    const bricksUnitCost = (unitCostDatabase.materials.bricks as { [key: string]: number })[materialQuantities.bricks.type];
    materials.bricks = (bricksUnitCost || 0) * materialQuantities.bricks.amount;

    const woodUnitCost = (unitCostDatabase.materials.wood as { [key: string]: number })[materialQuantities.wood.type];
    materials.wood = (woodUnitCost || 0) * materialQuantities.wood.amount;

    const paintUnitCost = (unitCostDatabase.materials.paint as { [key: string]: number })[materialQuantities.paint.type];
    materials.paint = (paintUnitCost || 0) * materialQuantities.paint.amount;

    // Electrical - Use nested lookup
    const electricalComponents = materialQuantities.electrical.components;
    const electricalComplexity = materialQuantities.electrical.complexity;
    const electricalCostMap = unitCostDatabase.materials.electrical as { [key: string]: { [key: string]: number } };
    if (electricalComponents && electricalComplexity && 
        electricalCostMap[electricalComponents] && 
        electricalCostMap[electricalComponents][electricalComplexity]) {
      materials.electrical = electricalCostMap[electricalComponents][electricalComplexity];
    } else {
      materials.electrical = 0; // Default to 0 if options are invalid
    }
    
    // Plumbing - Use nested lookup
    const plumbingComponents = materialQuantities.plumbing.components;
    const plumbingComplexity = materialQuantities.plumbing.complexity;
    const plumbingCostMap = unitCostDatabase.materials.plumbing as { [key: string]: { [key: string]: number } };
    if (plumbingComponents && plumbingComplexity && 
        plumbingCostMap[plumbingComponents] && 
        plumbingCostMap[plumbingComponents][plumbingComplexity]) {
      materials.plumbing = plumbingCostMap[plumbingComponents][plumbingComplexity];
    } else {
        materials.plumbing = 0;
    }
    
    // Fixtures - Simple lookup
    const fixturesUnitCost = (unitCostDatabase.materials.fixtures as { [key: string]: number })[materialQuantities.fixtures.type];
    materials.fixtures = (fixturesUnitCost || 0) * materialQuantities.fixtures.count;
    
    // Windows - Simple lookup
    const windowsUnitCost = (unitCostDatabase.materials.windows as { [key: string]: number })[materialQuantities.windows.type];
    materials.windows = (windowsUnitCost || 0) * materialQuantities.windows.count;
    
    // Doors - Simple lookup
    const doorsUnitCost = (unitCostDatabase.materials.doors as { [key: string]: number })[materialQuantities.doors.type];
    materials.doors = (doorsUnitCost || 0) * materialQuantities.doors.count;
    
    // Roofing - Simple lookup
    const roofingUnitCost = (unitCostDatabase.materials.roofing as { [key: string]: number })[materialQuantities.roofing.type];
    materials.roofing = (roofingUnitCost || 0) * materialQuantities.roofing.area;
    
    // Flooring - Simple lookup
    const flooringUnitCost = (unitCostDatabase.materials.flooring as { [key: string]: number })[materialQuantities.flooring.type];
    materials.flooring = (flooringUnitCost || 0) * materialQuantities.flooring.area;
    
    // Glasswork - Simple lookup
    const glassworkUnitCost = (unitCostDatabase.materials.glasswork as { [key: string]: number })[materialQuantities.glasswork.type];
    materials.glasswork = (glassworkUnitCost || 0) * materialQuantities.glasswork.area;
    
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
    
    return labor;
  };

  const calculateOverheadCosts = (): OverheadCosts => {
    const { overheadDetails } = state;
    const overhead = { ...defaultOverhead };

    // Permits - Nested lookup
    const permitType = overheadDetails.permits.type;
    const permitComplexity = overheadDetails.permits.complexity;
    const permitCostMap = unitCostDatabase.overhead.permits as { [key: string]: { [key: string]: number } };
    if (permitType && permitComplexity && 
        permitCostMap[permitType] && 
        permitCostMap[permitType][permitComplexity]) {
      overhead.permits = permitCostMap[permitType][permitComplexity];
    } else {
        overhead.permits = 0;
    }
    
    // Insurance - Simple lookup
    const insuranceUnitCost = (unitCostDatabase.overhead.insurance as { [key: string]: number })[overheadDetails.insurance.coverage];
    overhead.insurance = (insuranceUnitCost || 0) * overheadDetails.insurance.duration;
    
    // Equipment - Simple lookup
    const equipmentUnitCost = (unitCostDatabase.overhead.equipment as { [key: string]: number })[overheadDetails.equipment.type];
    overhead.equipment = (equipmentUnitCost || 0) * overheadDetails.equipment.duration;
    
    // Transportation - Calculation remains the same
    overhead.transportation = overheadDetails.transportation.distance * 
      overheadDetails.transportation.frequency * 50; // Assume ₹50 per km
    
    // Utilities - Simple lookup
    const utilityUnitCost = (unitCostDatabase.overhead.utilities as { [key: string]: number })[overheadDetails.utilities.type];
    overhead.utilities = (utilityUnitCost || 0) * overheadDetails.utilities.duration;
    
    // Site Preparation - Simple lookup
    const sitePrepUnitCost = (unitCostDatabase.overhead.sitePreparation as { [key: string]: number })[overheadDetails.sitePreparation.complexity];
    overhead.sitePreparation = (sitePrepUnitCost || 0) * overheadDetails.sitePreparation.area;
    
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
    const suggestions: OptimizationSuggestion[] = [];
    const { materials, labor, overhead, breakdown, materialQuantities, laborDetails, overheadDetails } = state; // Added overheadDetails back
    
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
    
    // Analyze overhead costs - USE NEW SPECIFIC KEYS
    if (overhead.equipment > 0 && overheadDetails.equipment.type === 'Heavy Machinery') { // Updated check
      suggestions.push({
        id: uuidv4(),
        category: 'other',
        title: 'Equipment sharing and rental optimization',
        description: 'Instead of full-time heavy machinery rental, analyze usage patterns and schedule equipment only when needed. Consider sharing heavy equipment between work zones or using smaller equipment where appropriate.',
        potentialSavings: overhead.equipment * 0.22,
        implementationComplexity: 'low',
        timeImpact: 'minimal',
        qualityImpact: 'none'
      });
    }
    
    // Example: Add suggestion based on complex permits
    if (overhead.permits > 0 && overheadDetails.permits.complexity === 'Complex Zoning') {
      suggestions.push({
        id: uuidv4(),
        category: 'other',
        title: 'Streamline Complex Permitting Process',
        description: 'Engage a local consultant experienced with complex zoning to navigate the permitting process more efficiently, potentially reducing delays and associated overhead costs.',
        potentialSavings: overhead.permits * 0.10, // Lower potential, focus on time
        implementationComplexity: 'medium',
        timeImpact: 'moderate', // Positive impact potentially
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

  // --- START: Added Report Generation/Download Logic ---

  const generateReportData = () => {
    if (!state.breakdown || !state.project) {
      return null;
    }

    const { project, breakdown, optimization } = state;

    return {
      project: {
        name: project.name,
        location: project.location,
        constructionType: project.constructionType,
        area: project.area,
        floors: project.floors
      },
      costs: {
        materials: breakdown.materials.total,
        labor: breakdown.labor.total,
        overhead: breakdown.overhead.total,
        total: breakdown.total
      },
      materialItems: breakdown.materials.items,
      laborItems: breakdown.labor.items,
      overheadItems: breakdown.overhead.items,
      optimization: optimization ? {
        suggestions: optimization.suggestions,
        potentialSavings: optimization.potentialSavings,
        optimizedTotal: optimization.optimizedTotal
      } : null
    };
  };

  const generateReportText = () => {
    const data = generateReportData();
    if (!data) return '';

    const { project, costs, materialItems, laborItems, overheadItems, optimization } = data;

    let text = `
========================================
    CONSTRUCTION COST ESTIMATION REPORT
========================================

PROJECT DETAILS:
---------------
Project Name: ${project.name}
Location: ${project.location}
Construction Type: ${project.constructionType}
Area: ${project.area} sq. ft.
Floors: ${project.floors}

COST SUMMARY:
------------
Materials: ${formatCurrency(costs.materials)}
Labor: ${formatCurrency(costs.labor)}
Overhead: ${formatCurrency(costs.overhead)}
TOTAL ESTIMATED COST: ${formatCurrency(costs.total)}

DETAILED BREAKDOWN:
-----------------

1. MATERIAL COSTS:
${Object.entries(materialItems)
  .map(([name, cost]) => `   ${name.charAt(0).toUpperCase() + name.slice(1)}: ${formatCurrency(cost as number)}`)
  .join('\\n')}

2. LABOR COSTS:
${Object.entries(laborItems)
  .map(([name, cost]) => `   ${name.charAt(0).toUpperCase() + name.slice(1)}: ${formatCurrency(cost as number)}`)
  .join('\\n')}

3. OVERHEAD COSTS:
${Object.entries(overheadItems)
  .map(([name, cost]) => `   ${name.charAt(0).toUpperCase() + name.slice(1)}: ${formatCurrency(cost as number)}`)
  .join('\\n')}
`;

    if (optimization) {
      text += `
COST OPTIMIZATION:
----------------
Potential Savings: ${formatCurrency(optimization.potentialSavings)}
Optimized Total Cost: ${formatCurrency(optimization.optimizedTotal)}

OPTIMIZATION SUGGESTIONS:
${optimization.suggestions
  .map((suggestion, index) => `
${index + 1}. ${suggestion.title}
   Category: ${suggestion.category}
   Description: ${suggestion.description}
   Potential Savings: ${formatCurrency(suggestion.potentialSavings)}
   Implementation Complexity: ${suggestion.implementationComplexity}
   Time Impact: ${suggestion.timeImpact}
   Quality Impact: ${suggestion.qualityImpact}
`)
  .join('')}
`;
    }

    text += `
========================================
     Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
              BuildWise Cost Estimator
========================================
`;

    return text;
  };

  const downloadReportAsTxt = () => {
    try {
      if (!state.project || !state.breakdown) {
        throw new Error('No project data or cost breakdown available to generate report.');
      }
      
      const reportText = generateReportText();
      if (!reportText) {
        throw new Error('Failed to generate report text.');
      }
      
      // Create file
      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      const projectName = state.project.name.replace(/\\s+/g, '_').toLowerCase() || 'construction';
      link.href = url;
      link.download = `${projectName}_report.txt`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Release the object URL
      window.URL.revokeObjectURL(url);
      
      toast({
        variant: "default",
        title: "Report Generated",
        description: "Your report has been downloaded successfully.",
      });
    } catch (error: any) {
      console.error("Error downloading report:", error);
      toast({
        variant: "destructive",
        title: "Report Generation Failed",
        description: error.message || "Failed to generate the report. Please try again.",
      });
    }
  };

  // --- END: Added Report Generation/Download Logic ---

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
        getComplexityOptions,
        downloadReportAsTxt
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

// Export the specific option getters for use in Estimate.tsx
export {
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
};
