import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const StartupTab = () => {
  const [startupProgress, setStartupProgress] = useState(0);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartCCS = () => {
    setIsStarting(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setStartupProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsStarting(false);
        toast({
          title: "CCS Started Successfully",
          description: "Central Control System is now operational",
        });
      }
    }, 500);
  };

  const startupSteps = [
    { id: 1, name: "Initialize SCADA Services", status: startupProgress >= 20 ? "complete" : "pending" },
    { id: 2, name: "Start Central Control System (CCS)", status: startupProgress >= 40 ? "complete" : "pending" },
    { id: 3, name: "Connect to Telescope Systems", status: startupProgress >= 60 ? "complete" : "pending" },
    { id: 4, name: "Verify Site Services", status: startupProgress >= 80 ? "complete" : "pending" },
    { id: 5, name: "System Ready", status: startupProgress >= 100 ? "complete" : "pending" },
  ];

  return (
    <div className="h-full p-6 space-y-6">
      <Card className="control-panel p-6">
        <h2 className="text-xl font-semibold mb-6 text-primary">Central Control System Startup</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Startup Progress</span>
              <span className="text-sm font-mono">{startupProgress}%</span>
            </div>
            <Progress value={startupProgress} className="h-2" />
          </div>

          <div className="space-y-3">
            {startupSteps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  {step.status === "complete" ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-border"></div>
                  )}
                  <span className="text-sm">{step.name}</span>
                </div>
                <Badge variant={step.status === "complete" ? "default" : "outline"} className="text-xs">
                  {step.status === "complete" ? "Complete" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>

          <Button
            onClick={handleStartCCS}
            disabled={isStarting || startupProgress > 0}
            className="w-full gap-2"
            size="lg"
          >
            {isStarting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Starting CCS...
              </>
            ) : (
              <>
                <PlayCircle className="h-5 w-5" />
                Start Central Control System
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
