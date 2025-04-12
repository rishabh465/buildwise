
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, BarChart3, Banknote, FileDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/5"></div>
          </div>
          
          <div className="container relative z-10 max-w-screen-xl px-4">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <span>Free Construction Cost Estimator</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Accurate Cost Estimation for Your Building Projects
                </h1>
                <p className="text-xl text-muted-foreground">
                  Instantly calculate construction costs with detailed breakdowns, interactive visualizations, 
                  and AI-powered cost optimization suggestions.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/estimate">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="#features">Learn More</a>
                  </Button>
                </div>
              </div>
              
              <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-lg bg-gradient-to-br from-primary/10 to-accent/20 p-6 shadow-xl flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" 
                  alt="Construction project" 
                  className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 mix-blend-multiply rounded-lg"></div>
                <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-md">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Project Cost Summary</h3>
                      <span className="text-xs text-muted-foreground">Demo</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Materials</span>
                        <span className="font-medium">₹15,35,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labor</span>
                        <span className="font-medium">₹8,75,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equipment</span>
                        <span className="font-medium">₹3,45,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overhead</span>
                        <span className="font-medium">₹2,75,000</span>
                      </div>
                      <div className="h-px bg-border"></div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹30,30,000</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Click "Get Started" to create your own estimate.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container max-w-screen-xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold sm:text-4xl mb-4">Comprehensive Construction Cost Estimation</h2>
              <p className="text-lg text-muted-foreground">
                Our powerful tool provides end-to-end estimation capabilities, from project input to downloadable reports.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="card-gradient rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Accurate Estimations</h3>
                <p className="text-muted-foreground">
                  Precise calculations based on project parameters with detailed breakdowns.
                </p>
              </div>
              
              <div className="card-gradient rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Interactive Dashboard</h3>
                <p className="text-muted-foreground">
                  Visualize your project costs with interactive charts and detailed breakdowns.
                </p>
              </div>
              
              <div className="card-gradient rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                  <Banknote className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Cost Optimization</h3>
                <p className="text-muted-foreground">
                  AI-powered suggestions to reduce costs without compromising quality.
                </p>
              </div>
              
              <div className="card-gradient rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                  <FileDown className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Report Generation</h3>
                <p className="text-muted-foreground">
                  Download comprehensive reports with all estimation details and suggestions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container max-w-screen-xl px-4">
            <div className="rounded-2xl bg-gradient-to-r from-primary to-accent p-8 md:p-12 shadow-lg">
              <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to Estimate Your Construction Costs?</h2>
                  <p className="text-white/90 text-lg mb-6">
                    Start now and get accurate estimates in minutes. No sign-up required.
                  </p>
                  <Button asChild size="lg" variant="secondary" className="gap-2">
                    <Link to="/estimate">
                      Start Estimating <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="hidden md:block relative">
                  <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"></div>
                  <div className="relative p-6">
                    <ul className="space-y-4 text-white">
                      <li className="flex items-center gap-2">
                        <div className="rounded-full bg-white h-1.5 w-1.5"></div>
                        <span>Instant calculation with real-time updates</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="rounded-full bg-white h-1.5 w-1.5"></div>
                        <span>Detailed breakdown of all cost components</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="rounded-full bg-white h-1.5 w-1.5"></div>
                        <span>AI-powered cost optimization suggestions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="rounded-full bg-white h-1.5 w-1.5"></div>
                        <span>Downloadable PDF reports for your records</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="rounded-full bg-white h-1.5 w-1.5"></div>
                        <span>No sign-up or registration required</span>
                      </li>
                    </ul>
                  </div>
                </div>
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
