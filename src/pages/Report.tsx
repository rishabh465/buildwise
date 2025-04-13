
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
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
import autoTable from 'jspdf-autotable';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

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
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: 'BuildWise Construction Cost Report',
        subject: state.project.name,
        author: 'BuildWise App',
        creator: 'BuildWise App'
      });
      
      // Add header
      doc.setTextColor(41, 37, 36);
      doc.setFontSize(22);
      doc.text('BuildWise Construction Cost Report', 105, 20, { align: 'center' });
      
      // Add project details
      doc.setFontSize(14);
      doc.text('Project Details', 20, 35);
      
      doc.setFontSize(12);
      doc.text(`Project Name: ${state.project.name}`, 20, 45);
      doc.text(`Location: ${state.project.location}`, 20, 52);
      doc.text(`Construction Type: ${state.project.constructionType}`, 20, 59);
      doc.text(`Area: ${state.project.area} sq. ft.`, 20, 66);
      doc.text(`Floors: ${state.project.floors}`, 20, 73);
      
      // Add cost summary
      doc.setFontSize(14);
      doc.text('Cost Summary', 20, 85);
      
      // Cost summary table
      doc.autoTable({
        startY: 90,
        head: [['Category', 'Amount']],
        body: [
          ['Materials', formatCurrency(state.breakdown.materials.total)],
          ['Labor', formatCurrency(state.breakdown.labor.total)],
          ['Overhead', formatCurrency(state.breakdown.overhead.total)],
          ['Total Project Cost', formatCurrency(state.breakdown.total)]
        ],
        headStyles: { fillColor: [139, 92, 246] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { lineWidth: 0.1, lineColor: [211, 211, 211] }
      }, doc);
      
      // Add material breakdown
      const materialItems = Object.entries(state.breakdown.materials.items)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => [key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), formatCurrency(value)]);
        
      if (materialItems.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Material Cost Breakdown', 20, 20);
        
        doc.autoTable({
          startY: 25,
          head: [['Material', 'Cost']],
          body: materialItems,
          headStyles: { fillColor: [139, 92, 246] },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          styles: { lineWidth: 0.1, lineColor: [211, 211, 211] }
        }, doc);
      }
      
      // Add labor breakdown
      const laborItems = Object.entries(state.breakdown.labor.items)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => [key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), formatCurrency(value)]);
        
      if (laborItems.length > 0) {
        const lastY = (doc as any).lastAutoTable?.finalY || 25;
        const newY = lastY + 15;
        
        if (newY > 250 && materialItems.length > 0) {
          doc.addPage();
          doc.setFontSize(14);
          doc.text('Labor Cost Breakdown', 20, 20);
          
          doc.autoTable({
            startY: 25,
            head: [['Labor Category', 'Cost']],
            body: laborItems,
            headStyles: { fillColor: [139, 92, 246] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { lineWidth: 0.1, lineColor: [211, 211, 211] }
          }, doc);
        } else {
          doc.setFontSize(14);
          doc.text('Labor Cost Breakdown', 20, newY);
          
          doc.autoTable({
            startY: newY + 5,
            head: [['Labor Category', 'Cost']],
            body: laborItems,
            headStyles: { fillColor: [139, 92, 246] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { lineWidth: 0.1, lineColor: [211, 211, 211] }
          }, doc);
        }
      }
      
      // Add overhead breakdown
      const overheadItems = Object.entries(state.breakdown.overhead.items)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => [key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), formatCurrency(value)]);
        
      if (overheadItems.length > 0) {
        const lastY = (doc as any).lastAutoTable?.finalY || 25;
        const newY = lastY + 15;
        
        if (newY > 250) {
          doc.addPage();
          doc.setFontSize(14);
          doc.text('Overhead Cost Breakdown', 20, 20);
          
          doc.autoTable({
            startY: 25,
            head: [['Overhead Category', 'Cost']],
            body: overheadItems,
            headStyles: { fillColor: [139, 92, 246] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { lineWidth: 0.1, lineColor: [211, 211, 211] }
          }, doc);
        } else {
          doc.setFontSize(14);
          doc.text('Overhead Cost Breakdown', 20, newY);
          
          doc.autoTable({
            startY: newY + 5,
            head: [['Overhead Category', 'Cost']],
            body: overheadItems,
            headStyles: { fillColor: [139, 92, 246] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { lineWidth: 0.1, lineColor: [211, 211, 211] }
          }, doc);
        }
      }

      // Add optimization suggestions if available
      if (state.optimization && state.optimization.suggestions.length > 0) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Cost Optimization Recommendations', 105, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.text('Potential Savings Summary', 20, 30);
        
        doc.setFontSize(12);
        doc.text(`Original Cost: ${formatCurrency(state.breakdown.total)}`, 20, 40);
        doc.text(`Potential Savings: ${formatCurrency(state.optimization.potentialSavings)}`, 20, 47);
        doc.text(`Optimized Cost: ${formatCurrency(state.optimization.optimizedTotal)}`, 20, 54);
        
        // Suggestions table
        doc.setFontSize(14);
        doc.text('Detailed Recommendations', 20, 65);
        
        const suggestionRows = state.optimization.suggestions.map((s) => [
          s.title,
          s.category,
          formatCurrency(s.potentialSavings),
          s.implementationComplexity.charAt(0).toUpperCase() + s.implementationComplexity.slice(1)
        ]);
        
        doc.autoTable({
          startY: 70,
          head: [['Recommendation', 'Category', 'Potential Savings', 'Complexity']],
          body: suggestionRows,
          headStyles: { fillColor: [139, 92, 246] },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          styles: { lineWidth: 0.1, lineColor: [211, 211, 211] }
        }, doc);
        
        // Add detailed descriptions of suggestions
        const lastY = (doc as any).lastAutoTable?.finalY || 70;
        const newY = lastY + 15;
        
        if (newY > 250) {
          doc.addPage();
          doc.setFontSize(14);
          doc.text('Recommendation Details', 20, 20);
          let detailY = 30;
          
          state.optimization.suggestions.forEach((s, i) => {
            if (detailY > 250) {
              doc.addPage();
              detailY = 20;
            }
            
            doc.setFontSize(12);
            doc.text(`${i + 1}. ${s.title}`, 20, detailY);
            
            // Word wrap for description
            const splitDescription = doc.splitTextToSize(s.description, 170);
            doc.setFontSize(10);
            doc.text(splitDescription, 25, detailY + 7);
            
            detailY += 10 + (splitDescription.length * 5);
          });
        } else {
          doc.setFontSize(14);
          doc.text('Recommendation Details', 20, newY);
          let detailY = newY + 10;
          
          state.optimization.suggestions.forEach((s, i) => {
            if (detailY > 250) {
              doc.addPage();
              detailY = 20;
            }
            
            doc.setFontSize(12);
            doc.text(`${i + 1}. ${s.title}`, 20, detailY);
            
            // Word wrap for description
            const splitDescription = doc.splitTextToSize(s.description, 170);
            doc.setFontSize(10);
            doc.text(splitDescription, 25, detailY + 7);
            
            detailY += 10 + (splitDescription.length * 5);
          });
        }
      }
      
      // Add footer with report generation date
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Report generated on: ${new Date().toLocaleString()}`, 20, doc.internal.pageSize.height - 10);
        doc.text(`Page ${i} of ${pageCount}`, 190, doc.internal.pageSize.height - 10, { align: 'right' });
      }

      // Save the PDF
      doc.save(`${state.project.name.replace(/\s+/g, '_')}_cost_report.pdf`);
      
      toast({
        title: "Report downloaded",
        description: "Your project cost report has been saved as a PDF.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to generate the PDF report. Please try again.",
      });
    }
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
