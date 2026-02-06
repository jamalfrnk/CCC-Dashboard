import { useEffect, useState } from "react";
import { runTests } from "@/tests/unit/runner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function TestRunnerPage() {
  const [results, setResults] = useState<{ name: string; passed: boolean; message: string }[]>([]);

  useEffect(() => {
    // Run tests on mount
    setResults(runTests());
  }, []);

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="min-h-screen p-8 bg-background text-foreground space-y-8">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-primary">UNIT TEST RUNNER</h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">
            STATUS: {passedCount === totalCount ? "ALL SYSTEMS GO" : "FAILURES DETECTED"}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
             <CardTitle className="font-mono text-sm">Test Suite Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-border rounded bg-card/50">
                  <span className="font-mono text-sm">{result.name}</span>
                  <Badge variant="outline" className={result.passed ? "text-emerald-500 border-emerald-500/30" : "text-destructive border-destructive/30"}>
                    {result.passed ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {result.message}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border text-right font-mono text-sm text-muted-foreground">
              Total Tests: {totalCount} | Passed: <span className="text-emerald-500">{passedCount}</span> | Failed: <span className="text-destructive">{totalCount - passedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
