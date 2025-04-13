
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Building, Calculator, LineChart, AreaChart, ArrowRight, CheckCircle2 } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground to-primary/10 z-[-1]" />
          <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-repeat opacity-5 z-[-1]" />
          
          <div className="container px-4 py-16 md:py-24 lg:py-32">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2 space-y-6">
                <Badge variant="outline" className="py-1.5 px-4 border-primary/50 text-sm">
                  Construction Cost Estimation
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Smarter <span className="text-primary">construction cost</span> optimization with AI
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-md">
                  BuildWise helps you create accurate construction cost estimates with AI-powered predictions and optimization suggestions.
                </p>
                
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/estimate">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg">
                    <Link to="/projects">
                      View Projects
                    </Link>
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>AI-powered predictions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Cost optimization</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Data visualization</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-lg">
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-secondary opacity-30 blur-xl"></div>
                  <div className="relative rounded-lg border bg-card p-6 text-card-foreground shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Project Overview</h3>
                      <Badge>AI Assisted</Badge>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Total Estimate</p>
                          <p className="text-2xl font-bold">₹24,85,000</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Potential Savings</p>
                          <p className="text-2xl font-bold text-green-600">₹3,25,000</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Materials</span>
                          <span className="font-medium">₹14,32,000</span>
                        </div>
                        <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "58%" }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Labor</span>
                          <span className="font-medium">₹7,45,000</span>
                        </div>
                        <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Overhead</span>
                          <span className="font-medium">₹3,08,000</span>
                        </div>
                        <div className="h-2 w-full bg-accent/10 rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: "12%" }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" size="sm" className="gap-1">
                        <AreaChart className="h-4 w-4" /> Details
                      </Button>
                      <Button size="sm" className="gap-1">
                        <LineChart className="h-4 w-4" /> Optimize
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                BuildWise helps construction professionals create accurate cost estimates with powerful AI-driven tools
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Detailed Cost Estimation</h3>
                <p className="text-muted-foreground">
                  Create comprehensive cost breakdowns for materials, labor, and overhead expenses with ease.
                </p>
              </div>
              
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <LineChart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Cost Optimization</h3>
                <p className="text-muted-foreground">
                  Get AI-powered recommendations to reduce costs without compromising quality or timelines.
                </p>
              </div>
              
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <AreaChart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Visual Analytics</h3>
                <p className="text-muted-foreground">
                  Visualize cost data with interactive charts and dashboards for better decision making.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 rounded-xl bg-gradient-to-br from-card to-background border shadow-sm">
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-3xl font-bold">Ready to get started?</h2>
                <p className="text-muted-foreground max-w-md">
                  Create your first construction cost estimate in minutes with our intuitive tool.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/estimate">
                    Create Estimate <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth">
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
