import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OOQSPanel } from "@/components/observation/OOQSPanel";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Play, Square } from "lucide-react";

export const ObservationTab = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedSB, setSelectedSB] = useState<string>("all");
  const [isObserving, setIsObserving] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock observing plans
  const observingPlans = [
    { id: "OP-2024-000", name: "Pre-calibration" },
    { id: "OP-2024-001", name: "Crab Nebula Survey" },
    { id: "OP-2024-002", name: "AGN Monitoring" },
    { id: "OP-2024-003", name: "Galactic Center" },
  ];

  // Mock scheduling blocks for selected plan
  const getSchedulingBlocks = () => {
    if (!selectedPlan) return [];
    
    if (selectedPlan === "OP-2024-000") {
      // Pre-calibration plan with 3 OBs
      return [
        { id: "OB.01", name: "Stairs Calibration (C1,1)", duration: "15min" },
        { id: "OB.02", name: "HG/LG Pulse Height Distribution for the pedestal determination (C1,4)", duration: "20min" },
        { id: "OB.03", name: "Pulse Height Distribution for HG gain and cross-talk determination (C1,4)", duration: "20min" },
      ];
    } else {
      // Other plans with 4 Wobble mode OBs
      return [
        { id: "OB.01", name: "Wobble 1", duration: "30min" },
        { id: "OB.02", name: "Wobble 2", duration: "30min" },
        { id: "OB.03", name: "Wobble 3", duration: "30min" },
        { id: "OB.04", name: "Wobble 4", duration: "30min" },
      ];
    }
  };

  const schedulingBlocks = getSchedulingBlocks();

  const handleStart = () => {
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select an observing plan first.",
        variant: "destructive",
      });
      return;
    }

    setIsObserving(true);
    toast({
      title: "Observation Started",
      description: `Starting ${selectedSB !== "all" ? schedulingBlocks.find(sb => sb.id === selectedSB)?.name : "full observing plan"}...`,
    });

    // Simulate progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleStop = () => {
    setIsObserving(false);
    setProgress(0);
    toast({
      title: "Observation Stopped",
      description: "Observation sequence terminated.",
      variant: "destructive",
    });
  };

  return (
    <div className="h-full p-6 space-y-6">
      <Card className="control-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-primary">Observation Control</h2>
            <p className="text-sm text-muted-foreground">Select and execute observing plans</p>
          </div>
          {isObserving && <Badge className="bg-status-active">OBSERVING</Badge>}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Observing Plan</label>
              <Select value={selectedPlan} onValueChange={(val) => {
                setSelectedPlan(val);
                setSelectedSB("all");
              }} disabled={isObserving}>
                <SelectTrigger>
                  <SelectValue placeholder="Select observing plan..." />
                </SelectTrigger>
                <SelectContent>
                  {observingPlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.id} - {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Scheduling Block (Optional)</label>
              <Select value={selectedSB} onValueChange={setSelectedSB} disabled={!selectedPlan || isObserving}>
                <SelectTrigger>
                  <SelectValue placeholder="Execute entire plan or select SB..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scheduling Blocks</SelectItem>
                  {schedulingBlocks.map(sb => (
                    <SelectItem key={sb.id} value={sb.id}>
                      {sb.id} - {sb.name} ({sb.duration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            {!isObserving ? (
              <Button onClick={handleStart} disabled={!selectedPlan} size="lg" className="gap-2">
                <Play className="h-4 w-4" />
                Start Observation
              </Button>
            ) : (
              <Button onClick={handleStop} variant="destructive" size="lg" className="gap-2">
                <Square className="h-4 w-4" />
                Stop Observation
              </Button>
            )}
          </div>
        </div>

        {isObserving && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Observation Progress</div>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="flex-1" />
                  <span className="text-sm font-mono">{progress}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Active Telescopes</div>
                <div className="text-2xl font-bold text-primary">9/9</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Data Rate</div>
                <div className="text-2xl font-bold text-primary">2.3 GB/s</div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Tabs defaultValue="ooqs" className="flex-1">
        <TabsList className="bg-secondary">
          <TabsTrigger value="ooqs">OOQS</TabsTrigger>
          <TabsTrigger value="summary">Array Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="ooqs" className="mt-4">
          <OOQSPanel />
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card className="control-panel p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Array Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">A{i + 1}</span>
                    <Badge className="bg-telescope-ready text-xs">Ready</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Events: {1000 + i * 100}</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
