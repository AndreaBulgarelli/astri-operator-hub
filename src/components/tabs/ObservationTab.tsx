import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OOQSPanel } from "@/components/observation/OOQSPanel";
import { DataCapturePanel } from "@/components/observation/DataCapturePanel";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Play, Square, ChevronRight, ChevronDown, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ObservationTab = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedSB, setSelectedSB] = useState<string>("");
  const [selectedOB, setSelectedOB] = useState<string>("");
  const [isObserving, setIsObserving] = useState(false);
  const [expandedSB, setExpandedSB] = useState<string | null>(null);

  // Mock observing plans with metadata
  const observingPlans = [
    { 
      id: "OP-2024-000", 
      name: "Pre-calibration",
      startDate: "2024-01-10T00:00:00Z",
      endDate: "2024-01-11T02:00:00Z",
      schedulingBlocks: [
        {
          id: "SB.001",
          name: "Pre-calibration SB",
          progress: 66,
          status: "running",
          observationBlocks: [
            { id: "OB.01", name: "Stairs Calibration (C1,1)", duration: "15min", progress: 100, status: "succeeded", runId: "RUN-2024-0001" },
            { id: "OB.02", name: "HG/LG Pulse Height Distribution (C1,4)", duration: "20min", progress: 100, status: "succeeded", runId: "RUN-2024-0002" },
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
          name: "Wobble Mode Observation",
          progress: 50,
          status: "running",
          observationBlocks: [
            { id: "OB.01", name: "Wobble 1", duration: "30min", progress: 100, status: "succeeded", runId: "RUN-2024-0003" },
            { id: "OB.02", name: "Wobble 2", duration: "30min", progress: 100, status: "succeeded", runId: "RUN-2024-0004" },
            { id: "OB.03", name: "Wobble 3", duration: "30min", progress: 0, status: "pending", runId: "" },
            { id: "OB.04", name: "Wobble 4", duration: "30min", progress: 0, status: "pending", runId: "" },
          ]
        }
      ]
    },
    { 
      id: "OP-2024-002", 
      name: "AGN Monitoring",
      startDate: "2024-03-15T00:00:00Z",
      endDate: "2024-06-15T02:00:00Z",
      schedulingBlocks: []
    },
    { 
      id: "OP-2024-003", 
      name: "Galactic Center",
      startDate: "2024-04-01T00:00:00Z",
      endDate: "2024-07-01T02:00:00Z",
      schedulingBlocks: []
    },
  ];

  const selectedPlanData = observingPlans.find(p => p.id === selectedPlan);
  const selectedSBData = selectedPlanData?.schedulingBlocks.find(sb => sb.id === selectedSB);
  const selectedOBData = selectedSBData?.observationBlocks.find(ob => ob.id === selectedOB);

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

  const handleStart = () => {
    if (!selectedPlan || !selectedSB || !selectedOB) {
      toast({
        title: "Incomplete Selection",
        description: "Please select an observing plan, scheduling block, and observation block.",
        variant: "destructive",
      });
      return;
    }

    setIsObserving(true);
    toast({
      title: "Observation Started",
      description: `Starting ${selectedOBData?.name}...`,
    });
  };

  const handleStop = () => {
    setIsObserving(false);
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

        <div className="grid grid-cols-3 gap-6">
          {/* Left: Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Observing Plan</label>
              <Select value={selectedPlan} onValueChange={(val) => {
                setSelectedPlan(val);
                setSelectedSB("");
                setSelectedOB("");
                setExpandedSB(null);
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

            {selectedPlanData && (
              <div className="p-3 rounded-lg bg-secondary/30 space-y-1 text-xs">
                <div><span className="text-muted-foreground">Start:</span> {new Date(selectedPlanData.startDate).toLocaleString()}</div>
                <div><span className="text-muted-foreground">End:</span> {new Date(selectedPlanData.endDate).toLocaleString()}</div>
              </div>
            )}

            <div className="flex gap-2">
              {!isObserving ? (
                <Button onClick={handleStart} disabled={!selectedOB} size="lg" className="gap-2 w-full">
                  <Play className="h-4 w-4" />
                  Start OB
                </Button>
              ) : (
                <Button onClick={handleStop} variant="destructive" size="lg" className="gap-2 w-full">
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>
          </div>

          {/* Middle: SB & OB List */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Scheduling Blocks & OBs</label>
            <ScrollArea className="h-[400px] border rounded-lg p-2">
              {selectedPlanData?.schedulingBlocks.map(sb => (
                <div key={sb.id} className="mb-2">
                  <div 
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedSB === sb.id ? 'bg-primary/20 border-2 border-primary' : 'bg-secondary/50 hover:bg-secondary/80'}`}
                    onClick={() => {
                      setSelectedSB(sb.id);
                      setExpandedSB(expandedSB === sb.id ? null : sb.id);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {expandedSB === sb.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <span className="font-semibold text-sm">{sb.id}</span>
                        <Badge className={getStatusColor(sb.status)} variant="outline">{sb.status}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={sb.progress} className="flex-1 h-2" />
                      <span className="text-xs font-mono">{sb.progress}%</span>
                    </div>
                  </div>

                  {expandedSB === sb.id && (
                    <div className="ml-4 mt-2 space-y-1">
                      {sb.observationBlocks.map(ob => (
                        <div 
                          key={ob.id}
                          className={`p-2 rounded-lg text-sm cursor-pointer transition-colors ${selectedOB === ob.id ? 'bg-primary/20 border-2 border-primary' : 'bg-card/50 hover:bg-card/80 border border-border'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOB(ob.id);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{ob.id}</Badge>
                              {ob.runId && (
                                <a href={`#/data-capture/${ob.runId}`} className="text-xs text-primary hover:underline flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                  {ob.runId}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <Badge className={getStatusColor(ob.status)} variant="outline">{ob.status}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">{ob.name} ({ob.duration})</div>
                          <div className="flex items-center gap-2">
                            <Progress value={ob.progress} className="flex-1 h-1.5" />
                            <span className="text-xs font-mono">{ob.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Right: Metadata */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Metadata</label>
            <ScrollArea className="h-[400px] border rounded-lg p-4">
              {sbMetadata && selectedSB ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="font-semibold text-primary mb-1">Scheduling Block</div>
                    <div className="text-muted-foreground">{sbMetadata.sblId}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary mb-1">Project</div>
                    <div>{sbMetadata.proID} - {sbMetadata.proName}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary mb-1">Target</div>
                    <div>{sbMetadata.target}</div>
                    <div className="text-muted-foreground">RA: {sbMetadata.coordinates.ra}, Dec: {sbMetadata.coordinates.dec}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary mb-1">Instrument</div>
                    <div>{sbMetadata.instrumentMode}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary mb-1">Array Configuration</div>
                    <div>{sbMetadata.telescopes.join(", ")}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary mb-1">Weather Constraints</div>
                    <div>Max Wind: {sbMetadata.maxWindVelocity}</div>
                    <div>Sky Background: {sbMetadata.skyBackground}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary mb-1">Observing Window</div>
                    <div className="text-muted-foreground">
                      {new Date(sbMetadata.observingWindow.start).toLocaleDateString()} - {new Date(sbMetadata.observingWindow.end).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary mb-1">Pointing Constraints</div>
                    <div>HA: {sbMetadata.haRange.min} to {sbMetadata.haRange.max}</div>
                    <div>ZA: {sbMetadata.zaRange.min} to {sbMetadata.zaRange.max}</div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  Select a Scheduling Block to view metadata
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="ooqs" className="flex-1">
        <TabsList className="bg-secondary">
          <TabsTrigger value="ooqs">OOQS</TabsTrigger>
          <TabsTrigger value="summary">Array Summary</TabsTrigger>
          <TabsTrigger value="datacapture">Data Capture</TabsTrigger>
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

        <TabsContent value="datacapture" className="mt-4">
          <DataCapturePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
