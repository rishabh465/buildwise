
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEstimator } from '@/contexts/EstimatorContext';

interface ProjectOverviewProps {
  projectName: string;
  projectLocation: string;
  constructionType: string;
  area: number;
  floors: number;
  totalCost: number;
  materialsCost: number;
  laborCost: number;
  overheadCost: number;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  projectName,
  projectLocation,
  constructionType,
  area,
  floors,
  totalCost,
  materialsCost,
  laborCost,
  overheadCost
}) => {
  const { formatCurrency } = useEstimator();
  
  const materialsPercentage = Math.round((materialsCost / totalCost) * 100);
  const laborPercentage = Math.round((laborCost / totalCost) * 100);
  const overheadPercentage = Math.round((overheadCost / totalCost) * 100);
  const costPerSqFt = totalCost / area;
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>
          Summary of project details and cost breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Project Name</p>
            <p className="font-medium">{projectName || 'Unnamed Project'}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{projectLocation || 'Not specified'}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Construction Type</p>
            <p className="font-medium">
              {constructionType ? 
                constructionType.charAt(0).toUpperCase() + constructionType.slice(1) : 
                'Not specified'}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Area</p>
            <p className="font-medium">{area} sq. ft.</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Number of Floors</p>
            <p className="font-medium">{floors}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Cost per sq. ft.</p>
            <p className="font-medium">{formatCurrency(costPerSqFt)}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="rounded-lg bg-muted p-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Estimated Cost</p>
              <h2 className="text-3xl font-bold">{formatCurrency(totalCost)}</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-6 md:mt-0">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Materials</p>
                <p className="font-semibold">{formatCurrency(materialsCost)}</p>
                <p className="text-xs text-muted-foreground mt-1">{materialsPercentage}%</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Labor</p>
                <p className="font-semibold">{formatCurrency(laborCost)}</p>
                <p className="text-xs text-muted-foreground mt-1">{laborPercentage}%</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overhead</p>
                <p className="font-semibold">{formatCurrency(overheadCost)}</p>
                <p className="text-xs text-muted-foreground mt-1">{overheadPercentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectOverview;
