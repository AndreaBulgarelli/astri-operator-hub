import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ObservingPlanExplorer } from "@/components/utility/ObservingPlanExplorer";

export const UtilityTab = () => {
  return (
    <div className="h-full p-6">
      <Card className="control-panel p-6 h-full flex flex-col">
        <h2 className="text-xl font-semibold mb-6 text-primary">Observing Plan Explorer</h2>
        <ScrollArea className="flex-1">
          <ObservingPlanExplorer />
        </ScrollArea>
      </Card>
    </div>
  );
};
