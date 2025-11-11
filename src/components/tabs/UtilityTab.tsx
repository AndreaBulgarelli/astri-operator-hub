import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpSbBrowser } from "@/components/utility/OpSbBrowser";
import { AlarmsViewer } from "@/components/utility/AlarmsViewer";
import { MonitoringPointsViewer } from "@/components/utility/MonitoringPointsViewer";

export const UtilityTab = () => {
  return (
    <div className="h-full p-6">
      <Card className="control-panel p-6 h-full flex flex-col">
        <Tabs defaultValue="observing-plans" className="h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="observing-plans">Observing Plans</TabsTrigger>
            <TabsTrigger value="alarms">Alarms</TabsTrigger>
            <TabsTrigger value="monitoring-points">Monitoring Points</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TabsContent value="observing-plans" className="h-full m-0">
              <ScrollArea className="h-full">
                <OpSbBrowser />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="alarms" className="h-full m-0">
              <ScrollArea className="h-full">
                <AlarmsViewer />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="monitoring-points" className="h-full m-0">
              <ScrollArea className="h-full">
                <MonitoringPointsViewer />
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};
