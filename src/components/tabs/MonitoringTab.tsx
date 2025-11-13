import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataCapturePanel } from "@/components/observation/DataCapturePanel";
import { WeatherPanel } from "@/components/observation/WeatherPanel";
import { ASCPanel } from "@/components/monitoring/ASCPanel";
import { SQMPanel } from "@/components/monitoring/SQMPanel";
import { LIDARPanel } from "@/components/monitoring/LIDARPanel";
import { UVSiPMPanel } from "@/components/monitoring/UVSiPMPanel";

export const MonitoringTab = () => {
  return (
    <div className="h-full overflow-auto">
      <Tabs defaultValue="data-capture" className="h-full flex flex-col">
        <TabsList className="mx-6 mt-6">
          <TabsTrigger value="data-capture">Data Capture</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="asc">All Sky Camera</TabsTrigger>
          <TabsTrigger value="sqm">SQM</TabsTrigger>
          <TabsTrigger value="lidar">LIDAR</TabsTrigger>
          <TabsTrigger value="uvsipm">UVSiPM (NSB)</TabsTrigger>
        </TabsList>

        <TabsContent value="data-capture" className="flex-1 overflow-auto p-6">
          <DataCapturePanel />
        </TabsContent>

        <TabsContent value="weather" className="flex-1 overflow-auto p-6">
          <WeatherPanel />
        </TabsContent>

        <TabsContent value="asc" className="flex-1 overflow-auto p-6">
          <ASCPanel />
        </TabsContent>

        <TabsContent value="sqm" className="flex-1 overflow-auto p-6">
          <SQMPanel />
        </TabsContent>

        <TabsContent value="lidar" className="flex-1 overflow-auto p-6">
          <LIDARPanel />
        </TabsContent>

        <TabsContent value="uvsipm" className="flex-1 overflow-auto p-6">
          <UVSiPMPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
