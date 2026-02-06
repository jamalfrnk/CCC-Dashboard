import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import TradesPage from "@/pages/trades";
import DefiPage from "@/pages/defi";
import AlertsPage from "@/pages/alerts";
import JournalPage from "@/pages/journal";
import SettingsPage from "@/pages/settings";
import TestRunnerPage from "@/pages/tests";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/trades" component={TradesPage} />
      <Route path="/defi" component={DefiPage} />
      <Route path="/alerts" component={AlertsPage} />
      <Route path="/journal" component={JournalPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/tests" component={TestRunnerPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
