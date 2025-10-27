import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { SystemMonitoring } from "@/components/tabs/SystemMonitoring";
import { StartupTab } from "@/components/tabs/StartupTab";
import { PreparationTab } from "@/components/tabs/PreparationTab";
import { ObservationTab } from "@/components/tabs/ObservationTab";
import { EndTab } from "@/components/tabs/EndTab";
import { UtilityTab } from "@/components/tabs/UtilityTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("monitoring");

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      <Header />

      <div className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-primary">ASTRI Mini-Array Operator HMI</h1>
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

          <div className="flex-1 overflow-auto mt-2">
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
