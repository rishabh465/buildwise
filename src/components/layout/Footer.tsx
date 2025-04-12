
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <Link to="/" className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-primary" />
              <span className="font-bold">BuildWise</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Smart construction cost estimation platform powered by AI
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/estimate" className="hover:text-foreground">Estimator</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
              </li>
              <li>
                <Link to="/optimize" className="hover:text-foreground">Cost Optimizer</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-foreground">Projects</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">Contact</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Connect</h3>
            <div className="flex space-x-3">
              <a href="#" className="rounded-full p-2 bg-background hover:bg-primary/10">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="rounded-full p-2 bg-background hover:bg-primary/10">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center sm:flex sm:justify-between sm:text-left text-sm text-muted-foreground">
          <p>© {currentYear} BuildWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
