
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BuildWise
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="text-sm text-muted-foreground hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:underline">
            Terms of Service
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
