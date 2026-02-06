import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db/mock-db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function TradesPage() {
  const { data: trades, isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => db.getTrades()
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
          <h1 className="text-3xl font-bold font-mono tracking-tight text-primary">TRADE LOG</h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">
            {isLoading ? "LOADING..." : `${trades?.length || 0} RECORDS FOUND`}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-sm">Recent Executions</CardTitle>
          <CardDescription>All historical trade data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono text-xs">DATE</TableHead>
                <TableHead className="font-mono text-xs">SYMBOL</TableHead>
                <TableHead className="font-mono text-xs">SIDE</TableHead>
                <TableHead className="font-mono text-xs text-right">PRICE</TableHead>
                <TableHead className="font-mono text-xs text-right">AMOUNT</TableHead>
                <TableHead className="font-mono text-xs text-right">TOTAL (USD)</TableHead>
                <TableHead className="font-mono text-xs text-center">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground font-mono">Loading data...</TableCell>
                </TableRow>
              ) : trades && trades.length > 0 ? (
                trades.map((trade) => (
                  <TableRow key={trade.id} className="font-mono text-xs">
                    <TableCell>{trade.date}</TableCell>
                    <TableCell className="font-bold">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={trade.side === 'BUY' ? "text-emerald-500 border-emerald-500/30" : "text-destructive border-destructive/30"}>
                        {trade.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{trade.amount}</TableCell>
                    <TableCell className="text-right">${(trade.price * trade.amount).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <span className="text-[10px] text-muted-foreground uppercase">{trade.status}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground font-mono">No trades recorded.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
