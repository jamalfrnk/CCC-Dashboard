import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Bell, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function AlertsPage() {
  const [status, setStatus] = useState<'active' | 'acknowledged' | 'all'>('all');

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts', status],
    queryFn: () => api.getAlerts({ status })
  });

  return (
    <div className="min-h-screen p-8 space-y-8 bg-background text-foreground">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-mono tracking-tight text-primary">RISK ALERTS</h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">
            MONITORING SYSTEM EVENTS
          </p>
        </div>
        
        <ToggleGroup type="single" value={status} onValueChange={(v) => v && setStatus(v as any)}>
          <ToggleGroupItem value="all" aria-label="Toggle all">
            ALL
          </ToggleGroupItem>
          <ToggleGroupItem value="active" aria-label="Toggle active">
            ACTIVE
          </ToggleGroupItem>
          <ToggleGroupItem value="acknowledged" aria-label="Toggle acknowledged">
            ACKNOWLEDGED
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-4">
        {isLoading ? (
           <div className="text-muted-foreground font-mono">Loading alerts...</div>
        ) : alerts && alerts.length > 0 ? (
          alerts.map((alert) => (
            <Card key={alert.id} className={`transition-all ${alert.severity === 'CRITICAL' ? "border-destructive/50 bg-destructive/5" : alert.severity === 'WARNING' ? "border-orange-500/50 bg-orange-500/5" : ""}`}>
              <CardContent className="p-6 flex items-start gap-4">
                <div className={`p-2 rounded-full ${alert.severity === 'CRITICAL' ? "bg-destructive/10 text-destructive" : "bg-orange-500/10 text-orange-500"}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-mono font-bold text-lg">{alert.type} ALERT</h3>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground">{alert.date}</span>
                      <Badge variant={alert.acknowledged ? "outline" : "default"} className={alert.acknowledged ? "text-muted-foreground" : alert.severity === 'CRITICAL' ? "bg-destructive" : "bg-orange-500"}>
                        {alert.acknowledged ? "ACKNOWLEDGED" : "ACTIVE"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground font-mono text-sm">{alert.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-mono font-bold">No Alerts Found</h3>
            <p className="text-muted-foreground">System operating within normal parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
