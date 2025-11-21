import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { SystemMonitoring } from "@/components/tabs/SystemMonitoring";
import { StartupTab } from "@/components/tabs/StartupTab";
import { PreparationTab } from "@/components/tabs/PreparationTab";
import { ObservationTab } from "@/components/tabs/ObservationTab";
import { EndTab } from "@/components/tabs/EndTab";
import { UtilityTab } from "@/components/tabs/UtilityTab";
import { AlarmPanel } from "@/components/monitoring/AlarmPanel";
import { EventLog } from "@/components/monitoring/EventLog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { Telescope, Box, AlertTriangle, CircleCheck, Activity, CloudSun, Eye } from "lucide-react";
import { AlarmEvent, setWS } from "@/lib/alarm-utilities";
import { set } from "date-fns";

const Index = () => {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [currentPlanData, setCurrentPlanData] = useState<any[]>([]);
  const [alarms, setAlarms] = useState<AlarmEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const ws = setWS(updateAlarms, onConnected, onError, onClose);
    if (!ws) {
      setError("Failed to connect to WebSocket");
      setConnected(false);
    } else {
      setError(null);
      setConnected(true);
    }
  }, []);
  
  const updateAlarms = (newAlarms: AlarmEvent[]) => {
    console.log("New alarms received in AlarmPanel:", newAlarms);
    setAlarms((prevAlarms) => {
      const combined = [...newAlarms, ...prevAlarms];
      const unique = combined.filter((alarm, index, self) =>
        index === self.findIndex(a => 
          a.alarmId === alarm.alarmId && 
          a.sourceTimestamp === alarm.sourceTimestamp
        )
      );
      return unique;
    });
  };

  const onError = (err) => {
    if (!err) return;
    console.error("WebSocket error in Index page:", err);
    setError("WebSocket connection error");
  };
  const onClose = () => {
    console.log("WebSocket closed in Index page");
    setConnected(false);
  };
  const onConnected = (state: boolean) => {
    setConnected(state);
    if (state) {
      setError(null);
    }
  };

  const metrics = [
    { icon: Telescope, value: 9 , label: "6 Operational, 1 Safe, 1 Fault", color: "text-status-online" },
    { icon: Box, value: 0, label: "Running Obs. Blocks", color: "text-status-active" },
    { icon: AlertTriangle, value: alarms.filter(a => !a.shelved).length, label: "Unack. Alarms", color: "text-status-error" },
    { icon: CircleCheck, value: "92%", label: "Data Quality", color: "text-status-online" },
    { icon: Activity, value: "1.2 GB/s", label: "Data Rate", color: "text-status-active" },
    { icon: CloudSun, value: "Good", label: "Environmental Condition", color: "text-status-online" },
    { icon: Eye, value: "21.5", label: "Sky Quality", color: "text-status-online" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <Header />

      <div className="flex-1 flex flex-col p-4">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-4 flex flex-col items-start gap-2 bg-card border-border">
              <div className="flex items-center gap-2">
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                <span className="text-2xl font-bold text-foreground">{metric.value}</span>
              </div>
              <span className="text-xs text-muted-foreground">{metric.label}</span>
            </Card>
          ))}
        </div>

        {/* Plan Progress Bar - supports multiple plans */}
        {currentPlanData && Array.isArray(currentPlanData) && currentPlanData.length > 0 && (
          <div className="mb-3 p-2 rounded-lg bg-secondary/30 border border-border space-y-1">
            {currentPlanData.map((planData: any) => (
              <div key={planData.id} className="flex items-center gap-3">
                <div className="text-xs font-medium text-muted-foreground whitespace-nowrap w-32 truncate" title={planData.name}>
                  {planData.name}
                </div>
                <div className="flex gap-1 flex-1">
                  {planData.schedulingBlocks.map((sb: any) => {
                    const totalOBs = sb.observationBlocks.length;
                    const sbWidth = `${(totalOBs / planData.schedulingBlocks.reduce((acc: number, s: any) => acc + s.observationBlocks.length, 0)) * 100}%`;
                    
                    return (
                      <div key={sb.id} className="flex gap-0.5" style={{ width: sbWidth }}>
                        {sb.observationBlocks.map((ob: any) => {
                          let bgColor = "bg-muted";
                          if (ob.status === "running") bgColor = "bg-status-active";
                          if (ob.status === "succeeded") bgColor = "bg-success";
                          
                          return (
                            <div
                              key={ob.id}
                              className={`h-2.5 ${bgColor} transition-colors border border-border/50 cursor-pointer hover:opacity-80`}
                              style={{ flex: 1 }}
                              title={`Plan: ${planData.name}\nSB: ${sb.id}\nOB: ${ob.name}\nStatus: ${ob.status}`}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full pr-2 pb-2">
                  <AlarmPanel alarms={alarms} setAlarms={setAlarms} connected={connected} />
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full pr-2 pt-2">
                  <EventLog />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={75} minSize={60}>
            <div className="h-full pl-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="bg-secondary w-full justify-start">
                  <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
                  <TabsTrigger value="startup">Startup</TabsTrigger>
                  <TabsTrigger value="preparation">Preparation</TabsTrigger>
                  <TabsTrigger value="observation">Observation</TabsTrigger>
                  <TabsTrigger value="end">End</TabsTrigger>
                  <TabsTrigger value="utility">Utility</TabsTrigger>
                </TabsList>

                <div className="flex-1 mt-2">
                  <TabsContent value="monitoring" className="h-full m-0">
                    <SystemMonitoring />
                  </TabsContent>

                  <TabsContent value="startup" className="h-full m-0">
                    <StartupTab />
                  </TabsContent>

                  <TabsContent value="preparation" className="h-full m-0">
                    <PreparationTab />
                  </TabsContent>

                  <TabsContent value="observation" className="h-full m-0">
                    <ObservationTab 
                      onPlanDataChange={(planData) => {
                        if (planData) {
                          setCurrentPlanData(prev => {
                            const exists = prev.find(p => p.id === planData.id);
                            if (exists) {
                              return prev.map(p => p.id === planData.id ? planData : p);
                            }
                            return [...prev, planData];
                          });
                        }
                      }}
                      onPlanStart={(planData) => {
                        setCurrentPlanData(prev => {
                          const exists = prev.find(p => p.id === planData.id);
                          if (!exists) {
                            return [...prev, planData];
                          }
                          return prev;
                        });
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="end" className="h-full m-0">
                    <EndTab />
                  </TabsContent>

                  <TabsContent value="utility" className="h-full m-0">
                    <UtilityTab />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
