import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { db } from "@/lib/db/mock-db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Activity, Shield, FileText, Download, Play, TrendingUp, TrendingDown, RefreshCcw, ArrowRight, Settings, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: snapshots, isLoading: isLoadingSnap } = useQuery({
    queryKey: ['snapshots'],
    queryFn: () => api.getSnapshots()
  });

  const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['activeAlerts'],
    queryFn: () => api.getAlerts({ status: 'active' })
  });

  const { data: journal, isLoading: isLoadingJournal } = useQuery({
    queryKey: ['journal'],
    queryFn: () => api.getJournal()
  });

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => api.getDefiPositions()
  });

  const handleRunSeed = async () => {
    db.seed();
    queryClient.invalidateQueries();
    toast({
      title: "System Reset",
      description: "Database re-seeded with 14 days of fresh deterministic data.",
    });
  };

  const handleExport = async () => {
    try {
      const data = await api.getSheetsExport();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fds_lite_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: "Data downloaded successfully.",
      });
    } catch (e) {
      toast({
        title: "Export Failed",
        description: "Could not generate export data.",
        variant: "destructive"
      });
    }
  };

  const snapshot = snapshots?.[snapshots.length - 1];
  const activeAlerts = alerts || [];
  const latestJournal = journal?.[journal.length - 1];

  // Prepare chart data (reverse to show chronological left-to-right)
  const chartData = snapshots ? [...snapshots].slice(-14) : [];

  return (
    <div className="min-h-screen p-8 space-y-8 bg-background text-foreground font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-primary">FDS COMMAND CENTER <span className="text-muted-foreground text-sm font-sans font-normal ml-2">LITE // MVP</span></h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            STATUS: {isLoadingSnap ? "CONNECTING..." : "ONLINE"} // 
            RISK: <span className={snapshot?.riskStatus === 'CRITICAL' ? "text-destructive" : snapshot?.riskStatus === 'WARNING' ? "text-orange-500" : "text-emerald-500"}>
              {snapshot?.riskStatus || "UNKNOWN"}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
           <Link href="/settings">
             <Button variant="ghost" size="icon" title="Settings">
               <Settings className="w-4 h-4" />
             </Button>
           </Link>
           <Link href="/trades">
            <Button variant="outline" className="font-mono text-xs uppercase tracking-wider">
               View Trades
            </Button>
           </Link>
           <Link href="/tests">
            <Button variant="outline" className="font-mono text-xs uppercase tracking-wider">
               Test Runner
            </Button>
           </Link>
           <Button variant="outline" onClick={handleRunSeed} className="font-mono text-xs uppercase tracking-wider">
            <RefreshCcw className="w-3 h-3 mr-2" /> Reset Seed
          </Button>
          <Button onClick={handleExport} variant="default" className="font-mono text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="w-3 h-3 mr-2" /> Export
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
            {isLoadingSnap ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold font-mono text-foreground">${snapshot?.totalValue.toLocaleString()}</div>
                <div className={`text-xs mt-1 flex items-center ${snapshot?.pnlPct && snapshot.pnlPct >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                  {snapshot?.pnlPct && snapshot.pnlPct >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {snapshot?.pnlPct}% (24h)
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className={`bg-card border-l-4 shadow-sm hover:shadow-md transition-shadow ${snapshot?.riskStatus === 'CRITICAL' ? "border-l-destructive" : snapshot?.riskStatus === 'WARNING' ? "border-l-orange-500" : "border-l-emerald-500"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Risk Exposure</CardTitle>
            <AlertCircle className={`h-4 w-4 ${snapshot?.riskStatus === 'CRITICAL' ? "text-destructive" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            {isLoadingSnap ? (
               <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold font-mono text-foreground">{snapshot?.drawdownPct}%</div>
                <p className="text-xs text-muted-foreground mt-1">Current Drawdown</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-slate-500 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href='/defi'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Active Positions</CardTitle>
            <Shield className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">{positions?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">DeFi Protocols Active</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-slate-500 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href='/journal'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Journal</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
             {isLoadingJournal ? (
               <div className="h-8 w-24 bg-muted animate-pulse rounded" />
             ) : (
               <>
                 <div className="text-2xl font-bold font-mono truncate text-sm text-foreground" title={latestJournal?.summary}>
                  {latestJournal ? "Logged" : "Missing"}
                 </div>
                 <p className="text-xs text-muted-foreground mt-1 truncate">
                   {latestJournal?.date || "No entry today"}
                 </p>
               </>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Chart + Table */}
        <div className="col-span-2 space-y-8">
          {/* Chart */}
          <Card className="min-h-[400px]">
            <CardHeader>
               <CardTitle className="font-mono">Performance Trend (14D)</CardTitle>
               <CardDescription>Daily snapshot value history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {isLoadingSnap ? (
                  <div className="w-full h-full bg-muted/20 animate-pulse rounded" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickFormatter={(str) => str.slice(5)}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        domain={['auto', 'auto']}
                        tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '4px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))', fontFamily: 'monospace' }}
                        formatter={(val: number) => [`$${val.toLocaleString()}`, "NAV"]}
                        labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="totalValue" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 14-Day History Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                   <CardTitle className="font-mono text-sm">Portfolio History</CardTitle>
                   <CardDescription>Last 14 daily snapshots</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-mono text-xs">DATE</TableHead>
                    <TableHead className="font-mono text-xs text-right">TOTAL VALUE</TableHead>
                    <TableHead className="font-mono text-xs text-right">CASH</TableHead>
                    <TableHead className="font-mono text-xs text-right">PnL</TableHead>
                    <TableHead className="font-mono text-xs text-center">RISK</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshots?.slice().reverse().map((s) => (
                    <TableRow key={s.id} className="font-mono text-xs hover:bg-muted/50">
                      <TableCell>{s.date}</TableCell>
                      <TableCell className="text-right font-medium">${s.totalValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-muted-foreground">${s.cashBalance.toLocaleString()}</TableCell>
                      <TableCell className={`text-right ${s.pnlPct >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                        {s.pnlPct > 0 ? "+" : ""}{s.pnlPct}%
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-[10px] h-5 ${
                          s.riskStatus === 'SAFE' ? 'text-emerald-500 border-emerald-500/30' : 
                          s.riskStatus === 'WARNING' ? 'text-orange-500 border-orange-500/30' : 
                          'text-destructive border-destructive/30'
                        }`}>
                          {s.riskStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Alerts & Journal */}
        <div className="space-y-6">
          <Card className={`cursor-pointer ${activeAlerts.length > 0 ? "border-destructive/50" : ""}`} onClick={() => window.location.href='/alerts'}>
            <CardHeader>
              <CardTitle className="font-mono text-sm flex items-center justify-between">
                Active Alerts
                {activeAlerts.length > 0 && <Badge variant="destructive">{activeAlerts.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                 <div className="text-sm text-muted-foreground font-mono flex items-center gap-2">
                   <CheckCircle className="h-4 w-4 text-emerald-500" />
                   System nominal.
                 </div>
              ) : (
                <div className="space-y-3">
                  {activeAlerts.map(alert => (
                    <div key={alert.id} className="p-3 border border-destructive/20 bg-destructive/5 rounded-md flex flex-col gap-2 animate-in fade-in slide-in-from-right-4">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-[10px] border-destructive text-destructive font-bold uppercase tracking-wider">{alert.type}</Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">{alert.date}</span>
                      </div>
                      <p className="text-xs text-foreground font-mono leading-relaxed">{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
           <Card className="cursor-pointer" onClick={() => window.location.href='/journal'}>
            <CardHeader>
              <CardTitle className="font-mono text-sm">Latest Journal</CardTitle>
            </CardHeader>
            <CardContent>
               {latestJournal ? (
                 <div className="space-y-4 text-sm">
                   <div className="p-3 bg-muted/30 rounded-md border border-border">
                     <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Tomorrow's Focus</span>
                     <span className="font-mono text-xs font-medium text-primary">{latestJournal.tomorrowFocus}</span>
                   </div>
                   <div className="space-y-1">
                     <span className="text-xs text-muted-foreground uppercase tracking-widest">Summary</span>
                     <p className="italic text-muted-foreground border-l-2 border-primary/20 pl-3 py-1">"{latestJournal.summary}"</p>
                   </div>
                 </div>
               ) : (
                 <div className="text-sm text-muted-foreground font-mono">No entries found.</div>
               )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-sm">System Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-mono space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Version</span>
                  <span>v1.0.0-LITE</span>
                </div>
                <div className="flex justify-between">
                  <span>Environment</span>
                  <span>Mockup</span>
                </div>
                <div className="flex justify-between">
                   <span>Storage</span>
                   <span>Local</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
