import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function DefiPage() {
  const { data: positions, isLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: () => api.getDefiPositions()
  });

  return (
    <div className="min-h-screen p-8 space-y-8 bg-background text-foreground">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-primary">DEFI POSITIONS</h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">
            ACTIVE PROTOCOLS: {positions?.length || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
           <div className="text-muted-foreground font-mono">Loading positions...</div>
        ) : positions?.map((pos) => (
          <Card key={pos.id} className="border-l-4 border-l-primary transition-all hover:bg-muted/10">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="font-mono text-lg">{pos.protocol}</CardTitle>
                <CardDescription className="font-mono text-xs uppercase mt-1">{pos.chain} • {pos.type}</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {pos.asset}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Balance</div>
                  <div className="font-mono text-lg font-bold">{pos.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground font-mono">${pos.usdValue.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">APY</div>
                  <div className="font-mono text-lg font-bold text-emerald-500">{pos.apy}%</div>
                </div>
              </div>

              {pos.healthFactor && (
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Health Factor</span>
                  <div className={`flex items-center gap-2 font-mono font-bold ${pos.healthFactor < 1.5 ? "text-orange-500" : "text-emerald-500"}`}>
                    {pos.healthFactor < 1.5 ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    {pos.healthFactor}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
