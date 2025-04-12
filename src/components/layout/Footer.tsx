
import React from 'react';
import { HardHat } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background py-8">
      <div className="container max-w-screen-2xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm">
            <HardHat className="h-5 w-5 text-primary" />
            <p className="font-medium">Construction Cost Estimator © 2025</p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
