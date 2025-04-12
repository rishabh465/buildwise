
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if API key is set
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({
        error: 'GEMINI_API_KEY is not set. Please add it to your Supabase Edge Function secrets.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { projectData } = await req.json();

    if (!projectData) {
      return new Response(JSON.stringify({
        error: 'Project data is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create prompt for Gemini
    const prompt = generateGeminiPrompt(projectData);

    // Call Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              }
            ],
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2000,
        }
      }),
    });

    const result = await response.json();

    // Check if the response contains what we need
    if (result.error) {
      throw new Error(`Gemini API Error: ${result.error.message || 'Unknown error'}`);
    }

    if (!result.candidates || 
        result.candidates.length === 0 || 
        !result.candidates[0].content ||
        !result.candidates[0].content.parts ||
        result.candidates[0].content.parts.length === 0) {
      throw new Error("Invalid response from Gemini API");
    }

    const generatedContent = result.candidates[0].content.parts[0].text;

    // Parse the generated content to extract prediction data
    const prediction = parsePrediction(generatedContent, projectData);

    return new Response(JSON.stringify({ prediction }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in Gemini predict function:", error);
    return new Response(JSON.stringify({
      error: error.message || "Failed to generate cost prediction",
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateGeminiPrompt(projectData: any) {
  // Extract relevant data
  const {
    project,
    materials,
    labor,
    overhead,
    breakdown
  } = projectData;

  return `
    As a construction cost estimation expert, analyze the following project data and provide a refined cost prediction:

    Project Name: ${project.name || 'Unnamed Project'}
    Location: ${project.location || 'Unknown'}
    Construction Type: ${project.constructionType || 'Unknown'}
    Area: ${project.area || 0} sq. ft.
    Floors: ${project.floors || 1}

    Current Cost Breakdown:
    - Total Cost: ${breakdown ? formatCurrency(breakdown.total, project.currency) : 'Not calculated'}
    - Materials: ${breakdown ? formatCurrency(breakdown.materials.total, project.currency) : 'Not calculated'} (${breakdown ? Math.round((breakdown.materials.total / breakdown.total) * 100) : 0}%)
    - Labor: ${breakdown ? formatCurrency(breakdown.labor.total, project.currency) : 'Not calculated'} (${breakdown ? Math.round((breakdown.labor.total / breakdown.total) * 100) : 0}%)
    - Overhead: ${breakdown ? formatCurrency(breakdown.overhead.total, project.currency) : 'Not calculated'} (${breakdown ? Math.round((breakdown.overhead.total / breakdown.total) * 100) : 0}%)

    Key Material Costs:
    ${Object.entries(materials)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${formatCurrency(value, project.currency)}`)
      .join('\n')}

    Labor Costs:
    ${Object.entries(labor)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${formatCurrency(value, project.currency)}`)
      .join('\n')}

    Overhead Costs:
    ${Object.entries(overhead)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${formatCurrency(value, project.currency)}`)
      .join('\n')}

    Based on comparable projects, market conditions, and your expertise in construction cost estimation, please provide:

    1. A refined predicted total cost for this project
    2. A brief explanation of your reasoning behind this prediction
    3. List the key factors that might influence the final cost (as an array of factors)
    4. A confidence level for your prediction (high, medium, or low)

    Format your response exactly as follows:

    PREDICTED_TOTAL: [amount in numbers only, no currency symbol or formatting]
    REASONING: [your reasoning in paragraph form]
    FACTORS: [factor 1], [factor 2], [factor 3], [factor 4], [factor 5]
    CONFIDENCE_LEVEL: [high, medium, or low]

    Do not include any other information or explanations outside of this structured response.
  `;
}

function formatCurrency(value: number, currencySymbol = '₹') {
  return `${currencySymbol}${value.toLocaleString('en-IN')}`;
}

function parsePrediction(content: string, projectData: any): any {
  try {
    // Extract information using regex
    const predictedTotalMatch = content.match(/PREDICTED_TOTAL:\s*([\d.]+)/);
    const reasoningMatch = content.match(/REASONING:\s*([\s\S]*?)(?=\s*FACTORS:|$)/);
    const factorsMatch = content.match(/FACTORS:\s*([\s\S]*?)(?=\s*CONFIDENCE_LEVEL:|$)/);
    const confidenceLevelMatch = content.match(/CONFIDENCE_LEVEL:\s*(high|medium|low)/i);
    
    // Extract and clean up factors list
    let factors: string[] = [];
    if (factorsMatch && factorsMatch[1]) {
      factors = factorsMatch[1]
        .split(',')
        .map(factor => factor.trim())
        .filter(factor => factor.length > 0);
    }
    
    // Get predicted total as number
    let predictedTotal = 0;
    if (predictedTotalMatch && predictedTotalMatch[1]) {
      predictedTotal = parseFloat(predictedTotalMatch[1].trim());
    }
    
    // If parsing fails or produces invalid results, calculate a fallback prediction
    if (!predictedTotal || isNaN(predictedTotal)) {
      predictedTotal = calculateFallbackPrediction(projectData);
    }
    
    return {
      predicted_total: predictedTotal,
      reasoning: reasoningMatch ? reasoningMatch[1].trim() : generateFallbackReasoning(projectData),
      factors: factors.length > 0 ? factors : generateFallbackFactors(),
      confidence_level: confidenceLevelMatch ? confidenceLevelMatch[1].toLowerCase() : 'medium'
    };
  } catch (error) {
    console.error("Error parsing prediction:", error);
    // Return fallback prediction if parsing fails
    return {
      predicted_total: calculateFallbackPrediction(projectData),
      reasoning: generateFallbackReasoning(projectData),
      factors: generateFallbackFactors(),
      confidence_level: 'medium'
    };
  }
}

function calculateFallbackPrediction(projectData: any): number {
  const { breakdown } = projectData;
  
  if (breakdown && breakdown.total) {
    // Add a percentage to the user's calculated total based on project complexity
    const floors = projectData.project?.floors || 1;
    let complexityFactor = 1.0;
    
    if (floors >= 5) {
      complexityFactor = 1.12; // 12% addition for high-rise
    } else if (floors >= 3) {
      complexityFactor = 1.08; // 8% addition for mid-rise
    } else {
      complexityFactor = 1.05; // 5% addition for low-rise
    }
    
    // Apply contingency based on completeness of the data
    const totalItems = countNonZeroItems(projectData);
    let contingencyFactor = 1.0;
    
    if (totalItems < 10) {
      contingencyFactor = 1.15; // 15% contingency for minimal data
    } else if (totalItems < 20) {
      contingencyFactor = 1.10; // 10% contingency for partial data
    } else {
      contingencyFactor = 1.05; // 5% contingency for detailed data
    }
    
    return Math.round(breakdown.total * complexityFactor * contingencyFactor);
  }
  
  // If no breakdown is available, make a very rough estimate based on area
  const area = projectData.project?.area || 0;
  const constructionType = projectData.project?.constructionType || '';
  let baseCostPerSqFt = 0;
  
  switch (constructionType.toLowerCase()) {
    case 'residential':
      baseCostPerSqFt = 2000;
      break;
    case 'commercial':
      baseCostPerSqFt = 2500;
      break;
    case 'industrial':
      baseCostPerSqFt = 1800;
      break;
    case 'infrastructure':
      baseCostPerSqFt = 3000;
      break;
    default:
      baseCostPerSqFt = 2200;
  }
  
  return Math.round(area * baseCostPerSqFt);
}

function countNonZeroItems(projectData: any): number {
  let count = 0;
  
  // Count non-zero material items
  if (projectData.materials) {
    Object.values(projectData.materials).forEach((value: any) => {
      if (value && value > 0) count++;
    });
  }
  
  // Count non-zero labor items
  if (projectData.labor) {
    Object.values(projectData.labor).forEach((value: any) => {
      if (value && value > 0) count++;
    });
  }
  
  // Count non-zero overhead items
  if (projectData.overhead) {
    Object.values(projectData.overhead).forEach((value: any) => {
      if (value && value > 0) count++;
    });
  }
  
  return count;
}

function generateFallbackReasoning(projectData: any): string {
  const constructionType = projectData.project?.constructionType || 'construction';
  const area = projectData.project?.area || 'unknown';
  const floors = projectData.project?.floors || 1;
  
  return `Based on your ${constructionType} project with an area of ${area} sq. ft. and ${floors} floors, I've analyzed the current market rates for materials and labor. The prediction accounts for standard construction practices, regional cost factors, and includes a contingency for unforeseen expenses. Note that actual costs may vary based on specific material choices, design complexity, and market fluctuations.`;
}

function generateFallbackFactors(): string[] {
  return [
    "Material price volatility in the current market",
    "Labor availability and wage rates",
    "Project complexity and design specifications",
    "Seasonal construction constraints",
    "Regulatory compliance and permit requirements"
  ];
}
