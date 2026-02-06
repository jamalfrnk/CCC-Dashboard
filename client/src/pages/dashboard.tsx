import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Activity, Shield, FileText, Download, Play } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8 space-y-8 bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-primary">FDS COMMAND CENTER <span className="text-muted-foreground text-sm font-sans font-normal ml-2">LITE // MVP</span></h1>
          <p className="text-muted-foreground mt-1">System Status: ONLINE // Risk Engine: ACTIVE</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="font-mono text-xs uppercase tracking-wider">
            <Play className="w-3 h-3 mr-2" /> Run Seed
          </Button>
          <Button variant="default" className="font-mono text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="w-3 h-3 mr-2" /> Export Data
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">NAV (Net Asset Value)</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">+0.0% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Risk Exposure</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">0.00%</div>
            <p className="text-xs text-muted-foreground mt-1">Within limits</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Active Positions</CardTitle>
            <Shield className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">0</div>
            <p className="text-xs text-muted-foreground mt-1">DeFi + Spot</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-slate-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Journal Entries</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">0</div>
            <p className="text-xs text-muted-foreground mt-1">Latest: None</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2 min-h-[400px]">
          <CardHeader>
             <CardTitle className="font-mono">Performance Trend (14D)</CardTitle>
             <CardDescription>Daily snapshot value history</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground font-mono text-sm border-2 border-dashed border-muted rounded-md bg-muted/50">
            [CHART PLACEHOLDER]
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-sm">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground font-mono">No active alerts. System nominal.</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="font-mono text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-sm text-muted-foreground font-mono">No recent trades logged.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
