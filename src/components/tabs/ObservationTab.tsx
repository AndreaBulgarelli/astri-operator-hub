import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OOQSPanel } from "@/components/observation/OOQSPanel";
import { DataCapturePanel } from "@/components/observation/DataCapturePanel";
import { PointingPanel } from "@/components/observation/PointingPanel";
import { WeatherPanel } from "@/components/observation/WeatherPanel";
import { RunningPlanTab } from "./RunningPlanTab";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Play, Square, ChevronRight, ChevronDown, ExternalLink, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type CheckStatus = "idle" | "checking" | "ok" | "error";

interface RunningPlan {
  planId: string;
  planName: string;
  selectedSB: string;
  selectedOB: string;
  expandedSB: string | null;
}

export const ObservationTab = ({ 
  onPlanDataChange,
  onPlanStart
}: { 
  onPlanDataChange?: (planData: any) => void;
  onPlanStart?: (planData: any) => void;
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedSB, setSelectedSB] = useState<string>("");
  const [selectedOB, setSelectedOB] = useState<string>("");
  const [expandedSB, setExpandedSB] = useState<string | null>(null);
  const [runningPlans, setRunningPlans] = useState<RunningPlan[]>([]);
  const [activeTab, setActiveTab] = useState<string>("observing-plan");
  const [activePlanTab, setActivePlanTab] = useState<string>("main");
  
  // Check statuses per SB
  const [sbChecks, setSBChecks] = useState<{[key: string]: {weather: CheckStatus, atmo: CheckStatus, telescopes: CheckStatus}}>({});
  const [isPlanRunning, setIsPlanRunning] = useState(false);

  // Mock observing plans with metadata
  const [observingPlans, setObservingPlans] = useState([
    { 
      id: "OP-2024-000", 
      name: "Pre-calibration",
      startDate: "2024-01-10T00:00:00Z",
      endDate: "2024-01-11T02:00:00Z",
      schedulingBlocks: [
        {
          id: "SB.001",
          name: "Pre-calibration SB",
          progress: 0,
          status: "pending",
          observationBlocks: [
            { id: "OB.01", name: "Stairs Calibration (C1,1)", duration: "15min", progress: 0, status: "pending", runId: "" },
            { id: "OB.02", name: "HG/LG Pulse Height Distribution (C1,4)", duration: "20min", progress: 0, status: "pending", runId: "" },
            { id: "OB.03", name: "Pulse Height Distribution for HG gain (C1,4)", duration: "20min", progress: 0, status: "pending", runId: "" },
          ]
        }
      ]
    },
    { 
      id: "OP-2024-001", 
      name: "Crab Nebula Survey",
      startDate: "2024-02-01T00:00:00Z",
      endDate: "2024-05-10T02:00:00Z",
      schedulingBlocks: [
        {
          id: "SB.001",
          name: "Wobble Mode Observation - Set 1",
          progress: 0,
          status: "pending",
          observationBlocks: [
            { id: "OB.01", name: "Wobble 1", duration: "30min", progress: 0, status: "pending", runId: "" },
            { id: "OB.02", name: "Wobble 2", duration: "30min", progress: 0, status: "pending", runId: "" },
            { id: "OB.03", name: "Wobble 3", duration: "30min", progress: 0, status: "pending", runId: "" },
            { id: "OB.04", name: "Wobble 4", duration: "30min", progress: 0, status: "pending", runId: "" },
          ]
        },
        {
          id: "SB.002",
          name: "Wobble Mode Observation - Set 2",
          progress: 0,
          status: "pending",
          observationBlocks: [
            { id: "OB.05", name: "Wobble 5", duration: "30min", progress: 0, status: "pending", runId: "" },
            { id: "OB.06", name: "Wobble 6", duration: "30min", progress: 0, status: "pending", runId: "" },
            { id: "OB.07", name: "Wobble 7", duration: "30min", progress: 0, status: "pending", runId: "" },
            { id: "OB.08", name: "Wobble 8", duration: "30min", progress: 0, status: "pending", runId: "" },
          ]
        },
        {
          id: "SB.003",
          name: "Deep Field Observation",
          progress: 0,
          status: "pending",
          observationBlocks: [
            { id: "OB.09", name: "Deep Field 1", duration: "60min", progress: 0, status: "pending", runId: "" },
            { id: "OB.10", name: "Deep Field 2", duration: "60min", progress: 0, status: "pending", runId: "" },
          ]
        }
      ]
    },
    { 
      id: "OP-2024-002", 
      name: "AGN Monitoring",
      startDate: "2024-03-15T00:00:00Z",
      endDate: "2024-06-15T02:00:00Z",
      schedulingBlocks: [
        {
          id: "SB.001",
          name: "Mrk 421 Monitoring",
          progress: 0,
          status: "pending",
          observationBlocks: [
            { id: "OB.01", name: "Mrk 421 - Night 1", duration: "45min", progress: 0, status: "pending", runId: "" },
            { id: "OB.02", name: "Mrk 421 - Night 2", duration: "45min", progress: 0, status: "pending", runId: "" },
            { id: "OB.03", name: "Mrk 421 - Night 3", duration: "45min", progress: 0, status: "pending", runId: "" },
          ]
        },
        {
          id: "SB.002",
          name: "Mrk 501 Monitoring",
          progress: 0,
          status: "pending",
          observationBlocks: [
            { id: "OB.04", name: "Mrk 501 - Night 1", duration: "45min", progress: 0, status: "pending", runId: "" },
            { id: "OB.05", name: "Mrk 501 - Night 2", duration: "45min", progress: 0, status: "pending", runId: "" },
          ]
        }
      ]
    },
    { 
      id: "OP-2024-003", 
      name: "Galactic Center",
      startDate: "2024-04-01T00:00:00Z",
      endDate: "2024-07-01T02:00:00Z",
      schedulingBlocks: [
        {
          id: "SB.001",
          name: "GC Deep Survey - Phase 1",
          progress: 0,
          status: "pending",
          observationBlocks: [
            { id: "OB.01", name: "GC Region A", duration: "90min", progress: 0, status: "pending", runId: "" },
            { id: "OB.02", name: "GC Region B", duration: "90min", progress: 0, status: "pending", runId: "" },
            { id: "OB.03", name: "GC Region C", duration: "90min", progress: 0, status: "pending", runId: "" },
          ]
        },
        {
          id: "SB.002",
          name: "GC Deep Survey - Phase 2",
          progress: 0,
          status: "pending",
          observationBlocks: [
            { id: "OB.04", name: "GC Region D", duration: "90min", progress: 0, status: "pending", runId: "" },
            { id: "OB.05", name: "GC Region E", duration: "90min", progress: 0, status: "pending", runId: "" },
          ]
        },
        {
          id: "SB.003",
          name: "GC Extended Sources",
          progress: 0,
          status: "pending",
          observationBlocks: [
            { id: "OB.06", name: "Extended Source 1", duration: "60min", progress: 0, status: "pending", runId: "" },
            { id: "OB.07", name: "Extended Source 2", duration: "60min", progress: 0, status: "pending", runId: "" },
            { id: "OB.08", name: "Extended Source 3", duration: "60min", progress: 0, status: "pending", runId: "" },
          ]
        }
      ]
    },
  ]);

  const selectedPlanData = observingPlans.find(p => p.id === selectedPlan);
  const selectedSBData = selectedPlanData?.schedulingBlocks.find(sb => sb.id === selectedSB);
  const selectedOBData = selectedSBData?.observationBlocks.find(ob => ob.id === selectedOB);

  // Notify parent component of plan data changes
  useEffect(() => {
    if (onPlanDataChange && selectedPlanData) {
      onPlanDataChange(selectedPlanData);
    }
  }, [selectedPlanData, onPlanDataChange]);

  // Mock metadata for selected SB
  const sbMetadata = selectedSBData ? {
    sblId: "2021.S0001.R.SB0001",
    proID: "2021.S0001.R",
    proName: "ASTRI SVF 1",
    target: "CrabNebula",
    coordinates: { ra: "83.63321 deg", dec: "22.01444 deg" },
    instrumentMode: "SCI - SWB",
    telescopes: ["ASTRI1", "ASTRI8", "ASTRI9"],
    maxWindVelocity: "30 km/s",
    skyBackground: "15.0 DarkNSB",
    observingWindow: {
      start: "2024-01-10T00:00:00Z",
      end: "2024-12-10T00:00:00Z"
    },
    haRange: { min: "-4 hour", max: "4 hour" },
    zaRange: { min: "0 deg", max: "60 deg" }
  } : null;

  const performChecks = async (sbId: string) => {
    setSBChecks(prev => ({
      ...prev,
      [sbId]: { weather: "checking", atmo: "checking", telescopes: "checking" }
    }));

    await new Promise(resolve => setTimeout(resolve, 1500));
    const weatherOk = Math.random() > 0.2 ? "ok" : "error";
    setSBChecks(prev => ({
      ...prev,
      [sbId]: { ...prev[sbId], weather: weatherOk }
    }));

    await new Promise(resolve => setTimeout(resolve, 1000));
    const atmoOk = Math.random() > 0.2 ? "ok" : "error";
    setSBChecks(prev => ({
      ...prev,
      [sbId]: { ...prev[sbId], atmo: atmoOk }
    }));

    await new Promise(resolve => setTimeout(resolve, 1000));
    const telescopesOk = Math.random() > 0.1 ? "ok" : "error";
    setSBChecks(prev => ({
      ...prev,
      [sbId]: { ...prev[sbId], telescopes: telescopesOk }
    }));

    return weatherOk === "ok" && atmoOk === "ok" && telescopesOk === "ok";
  };

  const simulateExecution = (planId: string, sbId: string) => {
    const plan = observingPlans.find(p => p.id === planId);
    const sb = plan?.schedulingBlocks.find(s => s.id === sbId);
    if (!sb) return;

    let currentOBIndex = 0;
    const obs = sb.observationBlocks;

    const interval = setInterval(() => {
      setObservingPlans(prev => prev.map(p => {
        if (p.id !== planId) return p;
        return {
          ...p,
          schedulingBlocks: p.schedulingBlocks.map(s => {
            if (s.id !== sbId) return s;
            
            const updatedOBs = s.observationBlocks.map((ob, idx) => {
              if (idx < currentOBIndex) {
                return { ...ob, progress: 100, status: "succeeded" as const, runId: ob.runId || `RUN-2024-${Math.floor(Math.random() * 10000)}` };
              } else if (idx === currentOBIndex) {
                const newProgress = Math.min(ob.progress + 10, 100);
                const newStatus = newProgress === 100 ? "succeeded" as const : "running" as const;
                const newRunId = ob.runId || `RUN-2024-${Math.floor(Math.random() * 10000)}`;
                
                if (newProgress === 100) {
                  currentOBIndex++;
                }
                
                return { ...ob, progress: newProgress, status: newStatus, runId: newRunId };
              }
              return ob;
            });

            const sbProgress = Math.floor(updatedOBs.reduce((acc, ob) => acc + ob.progress, 0) / updatedOBs.length);
            const allDone = updatedOBs.every(ob => ob.progress === 100);

            if (allDone) {
              clearInterval(interval);
              toast({
                title: "Scheduling Block Completed",
                description: `${s.name} has completed successfully.`,
              });
            }

            return {
              ...s,
              observationBlocks: updatedOBs,
              progress: sbProgress,
              status: allDone ? "succeeded" as const : "running" as const
            };
          })
        };
      }));
    }, 2000);
  };

  const handleStartPlan = async () => {
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select an observing plan.",
        variant: "destructive",
      });
      return;
    }

    const plan = observingPlans.find(p => p.id === selectedPlan);
    if (!plan || plan.schedulingBlocks.length === 0) {
      toast({
        title: "No Scheduling Blocks",
        description: "This plan has no scheduling blocks.",
        variant: "destructive",
      });
      return;
    }

    // Check if plan tab already exists
    const existingPlanIndex = runningPlans.findIndex(rp => rp.planId === plan.id);
    
    if (existingPlanIndex === -1) {
      // Check if there's a finished plan to replace
      const finishedPlanIndex = runningPlans.findIndex(rp => {
        const planData = observingPlans.find(p => p.id === rp.planId);
        return planData?.schedulingBlocks.every(sb => sb.status === "succeeded");
      });

      if (finishedPlanIndex !== -1) {
        // Replace the finished plan
        setRunningPlans(prev => prev.map((rp, idx) => 
          idx === finishedPlanIndex 
            ? {
                planId: plan.id,
                planName: plan.name,
                selectedSB: "",
                selectedOB: "",
                expandedSB: null
              }
            : rp
        ));
      } else {
        // Add new running plan tab
        setRunningPlans(prev => [...prev, {
          planId: plan.id,
          planName: plan.name,
          selectedSB: "",
          selectedOB: "",
          expandedSB: null
        }]);
      }
    }

    // Switch to the plan tab
    setActivePlanTab(plan.id);

    // Notify parent
    if (onPlanStart) {
      onPlanStart(plan);
    }

    // Execute all SBs in sequence
    for (const sb of plan.schedulingBlocks) {
      const checksOk = await performChecks(sb.id);
      
      if (!checksOk) {
        toast({
          title: "Pre-checks Failed",
          description: `Cannot start ${sb.name} due to failed conditions.`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Starting Scheduling Block",
        description: `Starting ${sb.name}...`,
      });

      await new Promise(resolve => {
        simulateExecution(selectedPlan, sb.id);
        // Wait for this SB to complete before starting next
        const checkInterval = setInterval(() => {
          const currentSB = observingPlans.find(p => p.id === selectedPlan)?.schedulingBlocks.find(s => s.id === sb.id);
          if (currentSB?.status === "succeeded") {
            clearInterval(checkInterval);
            resolve(null);
          }
        }, 1000);
      });
    }

    toast({
      title: "Plan Completed",
      description: `${plan.name} has completed successfully.`,
    });
  };

  const handleStartSB = async (sbId: string) => {
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select an observing plan.",
        variant: "destructive",
      });
      return;
    }

    const checksOk = await performChecks(sbId);

    if (!checksOk) {
      toast({
        title: "Pre-checks Failed",
        description: "Cannot start SB due to failed conditions.",
        variant: "destructive",
      });
      return;
    }

    // Auto-select the SB when started
    setSelectedSB(sbId);

    const sbData = selectedPlanData?.schedulingBlocks.find(sb => sb.id === sbId);
    toast({
      title: "Scheduling Block Started",
      description: `Starting ${sbData?.name}...`,
    });

    simulateExecution(selectedPlan, sbId);
  };

  const handleStop = () => {
    setIsPlanRunning(false);
    toast({
      title: "Observation Stopped",
      description: "Observation sequence terminated.",
      variant: "destructive",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded": return "bg-success";
      case "running": return "bg-status-active";
      case "pending": return "bg-muted";
      default: return "bg-muted";
    }
  };

  const getCheckIcon = (status: CheckStatus) => {
    if (status === "idle") return <div className="w-4 h-4 rounded-full bg-muted" />;
    if (status === "checking") return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    if (status === "ok") return <CheckCircle2 className="w-4 h-4 text-success" />;
    return <XCircle className="w-4 h-4 text-destructive" />;
  };

  const getSBCheckStatus = (sbId: string) => {
    return sbChecks[sbId] || { weather: "idle", atmo: "idle", telescopes: "idle" };
  };

  return (
    <div className="h-full p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="bg-secondary">
          <TabsTrigger value="observing-plan">Observing Plan</TabsTrigger>
          <TabsTrigger value="ooqs">OOQS</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="pointing">Pointing</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
        </TabsList>

        <TabsContent value="observing-plan" className="mt-4">
          <Card className="control-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-primary">Observation Control</h2>
                <p className="text-sm text-muted-foreground">Select and execute observing plans</p>
              </div>
            </div>

            <Tabs value={activePlanTab} onValueChange={setActivePlanTab} className="flex-1">
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="main">Observing Plan</TabsTrigger>
                {runningPlans.map((runningPlan) => (
                  <TabsTrigger key={runningPlan.planId} value={runningPlan.planId}>
                    {runningPlan.planName}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="main" className="mt-4">
                <div className="grid grid-cols-3 gap-6">
                  {/* Left: Selection & Checks */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Observing Plan</label>
                      <Select value={selectedPlan} onValueChange={(val) => {
                        setSelectedPlan(val);
                        setSelectedSB("");
                        setSelectedOB("");
                        setExpandedSB(null);
                      }}>
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

                    {selectedPlanData && (
                      <>
                        <div className="text-sm space-y-1 p-3 bg-secondary/30 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Start:</span>
                            <span className="font-mono text-xs">{new Date(selectedPlanData.startDate).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">End:</span>
                            <span className="font-mono text-xs">{new Date(selectedPlanData.endDate).toLocaleString()}</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-primary hover:bg-primary/90" 
                          onClick={handleStartPlan}
                        >
                          <Play className="mr-2 h-4 w-4" /> Start Plan
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Middle: SBs List */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scheduling Blocks</label>
                    <ScrollArea className="h-[400px] border rounded-lg p-3">
                      {selectedPlanData?.schedulingBlocks.map((sb) => {
                        return (
                          <div key={sb.id} className="mb-3">
                            {/* SB Block */}
                            <div 
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedSB === sb.id ? 'bg-primary/20 border-2 border-primary' : 'bg-secondary/50 hover:bg-secondary/80'}`}
                              onClick={() => setSelectedSB(sb.id)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">{sb.id}</span>
                                  <Badge className={getStatusColor(sb.status)} variant="outline">{sb.status}</Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress value={sb.progress} className="flex-1 h-2" />
                                <span className="text-xs font-mono">{sb.progress}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </ScrollArea>
                  </div>

                  {/* Right: SB Metadata or OBs */}
                  <div className="space-y-2">
                    {selectedSB && !selectedSBData?.observationBlocks.some(ob => ob.status === "running" || ob.status === "succeeded") ? (
                      <>
                        <label className="text-sm font-medium">SB Metadata</label>
                        <div className="border rounded-lg p-4 h-[400px] overflow-y-auto">
                          {sbMetadata && (
                            <div className="space-y-3 text-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">SBL ID:</span>
                                <span className="font-mono text-xs">{sbMetadata.sblId}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">PRO ID:</span>
                                <span className="font-mono text-xs">{sbMetadata.proID}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">PRO Name:</span>
                                <span className="font-mono text-xs">{sbMetadata.proName}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">Target:</span>
                                <span className="font-mono text-xs">{sbMetadata.target}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">RA:</span>
                                <span className="font-mono text-xs">{sbMetadata.coordinates.ra}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">DEC:</span>
                                <span className="font-mono text-xs">{sbMetadata.coordinates.dec}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">Instrument Mode:</span>
                                <span className="font-mono text-xs">{sbMetadata.instrumentMode}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">Telescopes:</span>
                                <span className="font-mono text-xs">{sbMetadata.telescopes.join(", ")}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">Max Wind:</span>
                                <span className="font-mono text-xs">{sbMetadata.maxWindVelocity}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">Sky Background:</span>
                                <span className="font-mono text-xs">{sbMetadata.skyBackground}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">Obs. Window Start:</span>
                                <span className="font-mono text-xs">{new Date(sbMetadata.observingWindow.start).toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">Obs. Window End:</span>
                                <span className="font-mono text-xs">{new Date(sbMetadata.observingWindow.end).toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">HA Range:</span>
                                <span className="font-mono text-xs">{sbMetadata.haRange.min} to {sbMetadata.haRange.max}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">ZA Range:</span>
                                <span className="font-mono text-xs">{sbMetadata.zaRange.min} to {sbMetadata.zaRange.max}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <label className="text-sm font-medium">Observation Blocks</label>
                        <ScrollArea className="h-[400px] border rounded-lg p-3">
                          {selectedSBData && selectedSBData.observationBlocks.length > 0 ? (
                            <div className="space-y-2">
                              {selectedSBData.observationBlocks.map((ob) => (
                                <div
                                  key={ob.id}
                                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedOB === ob.id ? "bg-primary/10 border-2 border-primary" : "bg-card border border-border hover:bg-secondary/30"
                                  }`}
                                  onClick={() => setSelectedOB(ob.id)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">{ob.id}</Badge>
                                      <span className="text-sm font-medium">{ob.name}</span>
                                    </div>
                                    <Badge className={getStatusColor(ob.status)} variant="secondary">
                                      {ob.status}
                                    </Badge>
                                  </div>
                                  
                                  {ob.runId && (
                                    <div className="mb-2">
                                      <a 
                                        href={`#/data-capture/${ob.runId}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                      >
                                        {ob.runId}
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </div>
                                  )}
                                  
                                  <Progress value={ob.progress} className="h-2 mb-1" />
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">{ob.duration}</span>
                                    <span className="text-xs text-muted-foreground">{ob.progress}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground text-center py-8">
                              {selectedSB ? "No observation blocks available" : "Select a scheduling block"}
                            </div>
                          )}
                        </ScrollArea>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              {runningPlans.map((runningPlan) => {
                const planData = observingPlans.find(p => p.id === runningPlan.planId);
                return planData ? (
                  <TabsContent key={runningPlan.planId} value={runningPlan.planId} className="mt-4">
                    <RunningPlanTab planData={planData} />
                  </TabsContent>
                ) : null;
              })}
            </Tabs>
          </Card>
        </TabsContent>

        <TabsContent value="ooqs" className="mt-4">
          <OOQSPanel />
        </TabsContent>


        <TabsContent value="monitoring" className="mt-4">
          <DataCapturePanel />
        </TabsContent>

        <TabsContent value="pointing" className="mt-4">
          <PointingPanel />
        </TabsContent>

        <TabsContent value="weather" className="mt-4">
          <WeatherPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

