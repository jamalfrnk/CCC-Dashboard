import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { db } from "@/lib/db/mock-db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw, Download, Database, FileSpreadsheet, FileJson } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRunSeed = async () => {
    db.seed();
    queryClient.invalidateQueries();
    toast({
      title: "System Reset",
      description: "Database re-seeded with 14 days of fresh deterministic data.",
    });
  };

  const handleExportSheets = async () => {
    try {
      const data = await api.getSheetsExport();
      const jsonString = JSON.stringify(data, null, 2);
      downloadFile(jsonString, "fds_sheets_export.json", "application/json");
      toast({ title: "Sheets Export Ready", description: "JSON for Sheets downloaded." });
    } catch (e) {
      toast({ title: "Export Failed", variant: "destructive" });
    }
  };

  const handleExportNotion = async () => {
    try {
      const data = await api.getNotionExport();
      const jsonString = JSON.stringify(data, null, 2);
      downloadFile(jsonString, "fds_notion_export.json", "application/json");
      toast({ title: "Notion Export Ready", description: "JSON payload for Notion downloaded." });
    } catch (e) {
      toast({ title: "Export Failed", variant: "destructive" });
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-8 space-y-8 bg-background text-foreground">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-primary">SYSTEM SETTINGS</h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">
            CONFIGURATION & MAINTENANCE
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" /> Data Management
            </CardTitle>
            <CardDescription>Control the mock database state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50">
              <div>
                <h3 className="font-medium text-sm">Reset & Seed Database</h3>
                <p className="text-xs text-muted-foreground mt-1">Wipes current data and generates 14 days of history.</p>
              </div>
              <Button onClick={handleRunSeed} variant="outline" size="sm">
                <RefreshCcw className="w-4 h-4 mr-2" /> Run Seed
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" /> Export Data
            </CardTitle>
            <CardDescription>Download data for external tools.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50">
              <div>
                <h3 className="font-medium text-sm">Google Sheets Format</h3>
                <p className="text-xs text-muted-foreground mt-1">JSON optimized for tabular import.</p>
              </div>
              <Button onClick={handleExportSheets} variant="secondary" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50">
              <div>
                <h3 className="font-medium text-sm">Notion API Format</h3>
                <p className="text-xs text-muted-foreground mt-1">JSON payloads for database sync.</p>
              </div>
              <Button onClick={handleExportNotion} variant="secondary" size="sm">
                <FileJson className="w-4 h-4 mr-2" /> Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
