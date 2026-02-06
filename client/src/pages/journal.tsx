import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Target, Brain, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export default function JournalPage() {
  const { data: journal, isLoading } = useQuery({
    queryKey: ['journal'],
    queryFn: () => api.getJournal()
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
          <h1 className="text-3xl font-bold font-mono tracking-tight text-primary">AI TRADING JOURNAL</h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">
            PERFORMANCE REFLECTION & ANALYSIS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
           <div className="text-muted-foreground font-mono">Loading journal...</div>
        ) : journal?.slice().reverse().map((entry) => (
          <Card key={entry.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="font-mono">{entry.date}</Badge>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </div>
              <CardTitle className="font-sans text-lg italic">"{entry.summary}"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  <Brain className="w-3 h-3" /> Discipline
                </div>
                <p className="text-sm">{entry.disciplineNotes}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  <ShieldAlert className="w-3 h-3" /> Risk Check
                </div>
                <p className="text-sm">{entry.riskCommentary}</p>
              </div>

              <Separator className="my-2" />
              
              <div className="bg-primary/5 p-3 rounded border border-primary/20">
                <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
                  <Target className="w-3 h-3" /> Tomorrow's Focus
                </div>
                <p className="text-sm font-medium">{entry.tomorrowFocus}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
