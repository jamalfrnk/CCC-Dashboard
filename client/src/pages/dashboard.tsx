
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db/mock-db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Activity, Shield, FileText, Download, Play, TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: snapshot, isLoading: isLoadingSnap } = useQuery({
    queryKey: ['latestSnapshot'],
    queryFn: () => db.getLatestSnapshot()
  });

  const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['activeAlerts'],
    queryFn: () => db.getAlerts()
  });

  const { data: journal, isLoading: isLoadingJournal } = useQuery({
    queryKey: ['latestJournal'],
    queryFn: () => db.getJournal()
  });

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => db.getPositions()
  });

  const handleRunSeed = async () => {
    db.seed();
    queryClient.invalidateQueries();
    toast({
      title: "System Reset",
      description: "Database re-seeded with 14 days of fresh deterministic data.",
    });
  };

  const activeAlerts = alerts?.filter(a => !a.acknowledged) || [];
  const latestJournal = journal?.[journal.length - 1];

  return (
    <div className="min-h-screen p-8 space-y-8 bg-background text-foreground">
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
           <Link href="/trades">
            <Button variant="outline" className="font-mono text-xs uppercase tracking-wider">
               View Trades
            </Button>
           </Link>
           <Button variant="outline" onClick={handleRunSeed} className="font-mono text-xs uppercase tracking-wider">
            <RefreshCcw className="w-3 h-3 mr-2" /> Reset Seed
          </Button>
          <Button variant="default" className="font-mono text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground">
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
                <div className="text-2xl font-bold font-mono">${snapshot?.totalValue.toLocaleString()}</div>
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
                <div className="text-2xl font-bold font-mono">{snapshot?.drawdownPct}%</div>
                <p className="text-xs text-muted-foreground mt-1">Current Drawdown</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-slate-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Active Positions</CardTitle>
            <Shield className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{positions?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">DeFi Protocols Active</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-slate-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Journal</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
             {isLoadingJournal ? (
               <div className="h-8 w-24 bg-muted animate-pulse rounded" />
             ) : (
               <>
                 <div className="text-2xl font-bold font-mono truncate text-sm" title={latestJournal?.summary}>
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
        <Card className="col-span-2 min-h-[400px]">
          <CardHeader>
             <CardTitle className="font-mono">Performance Trend (14D)</CardTitle>
             <CardDescription>Daily snapshot value history</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground font-mono text-sm border-2 border-dashed border-muted rounded-md bg-muted/50">
            [CHART COMPONENT WILL GO HERE IN ITERATION 03]
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-sm flex items-center justify-between">
                Active Alerts
                {activeAlerts.length > 0 && <Badge variant="destructive">{activeAlerts.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                 <div className="text-sm text-muted-foreground font-mono">No active alerts. System nominal.</div>
              ) : (
                <div className="space-y-2">
                  {activeAlerts.map(alert => (
                    <div key={alert.id} className="p-3 border border-destructive/20 bg-destructive/5 rounded flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs border-destructive text-destructive">{alert.type}</Badge>
                        <span className="text-[10px] text-muted-foreground">{alert.date}</span>
                      </div>
                      <p className="text-xs text-foreground font-mono mt-1">{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle className="font-mono text-sm">Latest Journal</CardTitle>
            </CardHeader>
            <CardContent>
               {latestJournal ? (
                 <div className="space-y-2 text-sm">
                   <div className="grid grid-cols-3 gap-2 border-b border-border pb-2">
                     <span className="text-muted-foreground">Focus:</span>
                     <span className="col-span-2 font-mono text-xs">{latestJournal.tomorrowFocus}</span>
                   </div>
                   <div className="pt-2">
                     <p className="italic text-muted-foreground">"{latestJournal.summary}"</p>
                   </div>
                 </div>
               ) : (
                 <div className="text-sm text-muted-foreground font-mono">No entries found.</div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
