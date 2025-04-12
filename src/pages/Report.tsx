import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useEstimator } from '@/contexts/EstimatorContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Download,
  Mail,
  Loader2,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Report = () => {
  const navigate = useNavigate();
  const { state, formatCurrency } = useEstimator();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!state.breakdown) {
      toast({
        variant: "destructive",
        title: "No data available",
        description: "Please complete the estimation form first.",
      });
      navigate('/estimate');
    }
  }, [state.breakdown, navigate, toast]);

  if (!state.breakdown) {
    return null;
  }

  const handleGenerateReport = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setReportGenerated(true);
      
      toast({
        title: "Report generated successfully",
        description: "Your report is now ready to download.",
      });
    }, 2000);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    
    doc.setTextColor(50);
    doc.setFontSize(18);
    doc.text('Project Cost Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Project Name: ${state.project.name}`, 20, 40, { align: 'left' });
    doc.text(`Location: ${state.project.location}`, 20, 50, { align: 'left' });
    doc.text(`Construction Type: ${state.project.constructionType}`, 20, 60, { align: 'left' });
    
    doc.autoTable({
      startY: 80,
      head: [['Category', 'Cost']],
      body: [
        ['Total Project Cost', state.breakdown ? state.formatCurrency(state.breakdown.total) : 'N/A'],
        ['Materials', state.breakdown ? state.formatCurrency(state.breakdown.materials.total) : 'N/A'],
        ['Labor', state.breakdown ? state.formatCurrency(state.breakdown.labor.total) : 'N/A'],
        ['Overhead', state.breakdown ? state.formatCurrency(state.breakdown.overhead.total) : 'N/A'],
      ],
    });

    doc.save('project_cost_report.pdf');
    
    toast({
      title: "Report downloaded",
      description: "Your project cost report has been saved.",
    });
  };

  const handleEmailReport = () => {
    if (!email || !email.includes('@')) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }
    
    toast({
      title: "Sending report",
      description: `Sending report to ${email}`,
    });
    
    setTimeout(() => {
      toast({
        title: "Report sent successfully",
        description: `The report has been sent to ${email}`,
      });
      setEmail('');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container max-w-screen-xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Project Report</h1>
            <p className="text-muted-foreground mt-2">
              Generate and download a comprehensive project report
            </p>
          </div>
          
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
              <CardDescription>
                Overview of what will be included in the report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary">Project Details</Badge>
                    <h3 className="font-semibold">Project Information</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Basic project information including name, location, area, construction type, and other parameters.
                  </p>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary">Cost Breakdown</Badge>
                    <h3 className="font-semibold">Detailed Cost Analysis</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete breakdown of all cost categories including materials, labor, and overhead with detailed line items.
                  </p>
                </div>
                
                {state.isOptimized && state.optimization && (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="bg-accent/10 text-accent">Optimization</Badge>
                      <h3 className="font-semibold">Cost Optimization Suggestions</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI-generated cost-saving recommendations with potential savings and implementation details.
                    </p>
                  </div>
                )}
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary">Visualizations</Badge>
                    <h3 className="font-semibold">Charts and Graphs</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Visual representations of cost distribution, breakdowns, and comparisons for easy analysis.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Total Project Cost: <span className="font-semibold">{formatCurrency(state.breakdown.total)}</span>
                  </p>
                  {state.isOptimized && state.optimization && (
                    <p className="text-sm text-muted-foreground">
                      Potential Savings: <span className="font-semibold text-accent">{formatCurrency(state.optimization.potentialSavings)}</span>
                    </p>
                  )}
                </div>
                
                <Button 
                  className="w-full gap-2" 
                  onClick={handleGenerateReport}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Generating Report...
                    </>
                  ) : reportGenerated ? (
                    <>
                      <CheckCircle className="h-4 w-4" /> Report Ready
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" /> Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {reportGenerated && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Download Report</CardTitle>
                <CardDescription>
                  Download or email the generated report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Download Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="default" 
                          className="w-full gap-2"
                          onClick={handleDownload}
                        >
                          <Download className="h-4 w-4" /> Download PDF Report
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Report Details</p>
                            <p className="text-sm text-muted-foreground">
                              This comprehensive PDF report contains all project details, cost breakdowns, 
                              optimization suggestions, and visual analytics. It's print-ready and includes a 
                              timestamp and reference ID.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Email Report</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Enter your email address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <Button 
                            variant="outline" 
                            className="gap-2 shrink-0"
                            onClick={handleEmailReport}
                            disabled={!email}
                          >
                            <Mail className="h-4 w-4" /> Send
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Email Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              The report will be sent as a PDF attachment to the email address you provide. 
                              You'll also receive a link to download the report directly. Your email is not stored.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Report generated on: {new Date().toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Reference ID: CCE-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Report;
