
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
          maxOutputTokens: 4000,
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

    // Parse the generated content to extract optimization suggestions
    const optimizations = parseOptimizationSuggestions(generatedContent, projectData);

    return new Response(JSON.stringify({ optimizations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in Gemini optimize function:", error);
    return new Response(JSON.stringify({
      error: error.message || "Failed to generate optimization suggestions",
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
    As a construction cost optimization expert, analyze the following construction project details and suggest cost-saving measures:

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

    Please provide 5 specific cost optimization suggestions that could reduce the overall project cost. 
    For each suggestion:
    1. Title: A clear and concise title for the suggestion
    2. Description: A detailed description of the suggestion
    3. Category: One of: materials, labor, design, scheduling, procurement, or other
    4. Potential Savings: An estimated amount of savings in the project currency
    5. Implementation Complexity: low, medium, or high
    6. Time Impact: none, minimal, moderate, or significant
    7. Quality Impact: none, minimal, moderate, or significant

    Format your response as follows for each suggestion:

    SUGGESTION 1:
    Title: [Title]
    Description: [Description]
    Category: [Category]
    Potential Savings: [Amount]
    Implementation Complexity: [Complexity]
    Time Impact: [Impact]
    Quality Impact: [Impact]

    SUGGESTION 2:
    ... and so on.

    Do not include any other information or explanations outside of these 5 structured suggestions.
  `;
}

function formatCurrency(value: number, currencySymbol = '₹') {
  return `${currencySymbol}${value.toLocaleString('en-IN')}`;
}

function parseOptimizationSuggestions(content: string, projectData: any): any[] {
  const suggestions: any[] = [];
  
  // Split the response into suggestion blocks
  const suggestionBlocks = content.split(/SUGGESTION \d+:/g).filter(block => block.trim().length > 0);
  
  suggestionBlocks.forEach((block, index) => {
    try {
      // Extract information using regex
      const titleMatch = block.match(/Title:\s*(.*?)(\n|$)/);
      const descriptionMatch = block.match(/Description:\s*([\s\S]*?)(?=\s*Category:|$)/);
      const categoryMatch = block.match(/Category:\s*(.*?)(\n|$)/);
      const savingsMatch = block.match(/Potential Savings:\s*(.*?)(\n|$)/);
      const complexityMatch = block.match(/Implementation Complexity:\s*(.*?)(\n|$)/);
      const timeImpactMatch = block.match(/Time Impact:\s*(.*?)(\n|$)/);
      const qualityImpactMatch = block.match(/Quality Impact:\s*(.*?)(\n|$)/);
      
      // Extract potential savings amount
      let savingsAmount = 0;
      if (savingsMatch && savingsMatch[1]) {
        const amountStr = savingsMatch[1].trim();
        // Extract numerical value from the string (remove currency symbol and commas)
        const numericValue = amountStr.replace(/[^\d.]/g, '');
        savingsAmount = parseFloat(numericValue) || 0;
      }
      
      suggestions.push({
        id: (index + 1).toString(),
        title: titleMatch ? titleMatch[1].trim() : `Optimization Suggestion ${index + 1}`,
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        category: categoryMatch ? categoryMatch[1].trim() as any : 'other',
        potentialSavings: savingsAmount,
        implementationComplexity: complexityMatch ? complexityMatch[1].trim() as any : 'medium',
        timeImpact: timeImpactMatch ? timeImpactMatch[1].trim() as any : 'minimal',
        qualityImpact: qualityImpactMatch ? qualityImpactMatch[1].trim() as any : 'minimal'
      });
    } catch (error) {
      console.error(`Error parsing suggestion block ${index + 1}:`, error);
      // Add a fallback suggestion if parsing fails
      suggestions.push({
        id: (index + 1).toString(),
        title: `Optimization Suggestion ${index + 1}`,
        description: 'Could not parse this suggestion. Please try regenerating optimization suggestions.',
        category: 'other',
        potentialSavings: 0,
        implementationComplexity: 'medium',
        timeImpact: 'minimal',
        qualityImpact: 'minimal'
      });
    }
  });
  
  // If we couldn't parse any suggestions, or if there were fewer than expected,
  // fill in with some generic suggestions
  while (suggestions.length < 5) {
    suggestions.push(generateFallbackSuggestion(suggestions.length + 1, projectData));
  }
  
  return suggestions;
}

function generateFallbackSuggestion(index: number, projectData: any) {
  const fallbackSuggestions = [
    {
      title: "Optimize cement usage with alternative binders",
      description: "Replace a portion of cement with fly ash or GGBS (Ground Granulated Blast-furnace Slag). These supplementary cementitious materials can reduce cement consumption by 20-30% while maintaining strength properties.",
      category: "materials",
      potentialSavings: (projectData.materials?.cement || 0) * 0.18,
      implementationComplexity: "low",
      timeImpact: "none",
      qualityImpact: "minimal"
    },
    {
      title: "Structural optimization for steel efficiency",
      description: "Consider redesigning reinforcement layouts using BIM (Building Information Modeling) to optimize steel placement. Advanced structural analysis can reduce steel quantities by 10-15% without compromising strength.",
      category: "design",
      potentialSavings: (projectData.materials?.steel || 0) * 0.12,
      implementationComplexity: "medium",
      timeImpact: "minimal",
      qualityImpact: "none"
    },
    {
      title: "Optimize workforce scheduling and productivity",
      description: "Implement lean construction techniques and daily task planning to improve labor productivity. By optimizing crew sizes and work sequences, labor costs can be reduced while maintaining the schedule.",
      category: "labor",
      potentialSavings: ((projectData.labor?.helpers || 0) + (projectData.labor?.supervisors || 0)) * 0.15,
      implementationComplexity: "medium",
      timeImpact: "none",
      qualityImpact: "none"
    },
    {
      title: "Bulk material procurement strategy",
      description: "Consolidate material orders and schedule deliveries to match construction phases. Negotiate bulk pricing with suppliers for major materials, potentially saving 7-10% on key materials.",
      category: "procurement",
      potentialSavings: ((projectData.materials?.cement || 0) + (projectData.materials?.steel || 0) + (projectData.materials?.bricks || 0)) * 0.08,
      implementationComplexity: "low",
      timeImpact: "none",
      qualityImpact: "none"
    },
    {
      title: "Equipment sharing and rental optimization",
      description: "Instead of full-time equipment rental, analyze usage patterns and schedule equipment only when needed. Consider sharing equipment between work zones or using smaller, more efficient machinery where appropriate.",
      category: "other",
      potentialSavings: (projectData.overhead?.equipment || 0) * 0.22,
      implementationComplexity: "low",
      timeImpact: "minimal",
      qualityImpact: "none"
    }
  ];
  
  const suggestion = fallbackSuggestions[(index - 1) % fallbackSuggestions.length];
  return {
    id: index.toString(),
    ...suggestion
  };
}
