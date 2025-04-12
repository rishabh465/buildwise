
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useEstimator } from '@/contexts/EstimatorContext';

interface AIPredictionProps {
  predictedTotal: number;
  reasoning: string;
  factors: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
}

const AIPredictionCard: React.FC<AIPredictionProps> = ({
  predictedTotal,
  reasoning,
  factors,
  confidenceLevel
}) => {
  const { formatCurrency, state } = useEstimator();
  
  const getConfidenceColor = () => {
    switch (confidenceLevel) {
      case 'high': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'low': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    }
  };
  
  const getConfidenceIcon = () => {
    switch (confidenceLevel) {
      case 'high': return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'medium': return <Info className="h-4 w-4 mr-1" />;
      case 'low': return <AlertTriangle className="h-4 w-4 mr-1" />;
      default: return <Info className="h-4 w-4 mr-1" />;
    }
  };
  
  const currentEstimate = state.breakdown?.total || 0;
  const difference = predictedTotal - currentEstimate;
  const percentDifference = currentEstimate > 0 
    ? Math.round((difference / currentEstimate) * 100) 
    : 0;
    
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            AI Cost Prediction
          </CardTitle>
          <Badge className={`${getConfidenceColor()} font-normal flex items-center`} variant="outline">
            {getConfidenceIcon()}
            {confidenceLevel.charAt(0).toUpperCase() + confidenceLevel.slice(1)} Confidence
          </Badge>
        </div>
        <CardDescription>
          Gemini AI-based cost prediction based on your project details
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-sm text-muted-foreground mb-1">Predicted Total Cost</p>
            <h3 className="text-2xl font-bold">{formatCurrency(predictedTotal)}</h3>
          </div>
          
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground mb-1">Difference from Estimate</p>
            <h3 className={`text-2xl font-bold ${difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {difference >= 0 ? '+' : ''}{formatCurrency(difference)} ({difference >= 0 ? '+' : ''}{percentDifference}%)
            </h3>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">AI Reasoning</h4>
          <p className="text-muted-foreground text-sm">{reasoning}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Key Factors</h4>
          <div className="flex flex-wrap gap-2">
            {factors.map((factor, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                {factor}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPredictionCard;
