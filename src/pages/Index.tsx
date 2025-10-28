import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { SystemMonitoring } from "@/components/tabs/SystemMonitoring";
import { StartupTab } from "@/components/tabs/StartupTab";
import { PreparationTab } from "@/components/tabs/PreparationTab";
import { ObservationTab } from "@/components/tabs/ObservationTab";
import { EndTab } from "@/components/tabs/EndTab";
import { UtilityTab } from "@/components/tabs/UtilityTab";
import { Card } from "@/components/ui/card";
import { Telescope, Box, AlertTriangle, CircleCheck, Activity, CloudSun, Eye } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("monitoring");

  const metrics = [
    { icon: Telescope, value: "6 Operational, 1 Safe, 1 Fault", label: "Telescopes Status", color: "text-status-online" },
    { icon: Box, value: 0, label: "Running Blocks", color: "text-status-active" },
    { icon: AlertTriangle, value: 2, label: "Unack. Alarms", color: "text-status-error" },
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
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
              <ObservationTab />
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
    </div>
  );
};

export default Index;
