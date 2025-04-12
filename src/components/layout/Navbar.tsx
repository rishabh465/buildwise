
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HardHat, BarChart3, Calculator, FileText, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2 font-semibold">
          <HardHat className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">Construction Cost Estimator</span>
          <span className="inline-block sm:hidden">CCE</span>
        </div>
        
        <nav className="ml-auto flex items-center gap-4">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/estimate" className="text-sm font-medium hover:text-primary transition-colors">
            Estimate
          </Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/optimize" className="text-sm font-medium hover:text-primary transition-colors">
            Optimize
          </Link>
          <Link to="/report" className="text-sm font-medium hover:text-primary transition-colors">
            Report
          </Link>
          <Button asChild variant="default" size="sm" className="ml-4">
            <Link to="/estimate">
              Get Started
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
