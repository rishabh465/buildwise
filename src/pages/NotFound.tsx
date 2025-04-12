
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="flex items-center justify-center flex-col">
          <Building className="h-16 w-16 text-primary mb-2" />
          <h1 className="text-4xl font-bold">BuildWise</h1>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-5xl font-bold">404</h2>
          <h3 className="text-2xl font-medium">Page Not Found</h3>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Button asChild variant="default" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4" /> My Projects
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
