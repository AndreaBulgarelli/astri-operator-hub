import { useState } from "react";
import { HierarchicalView } from "@/components/monitoring/HierarchicalView";
import { DetailPanel } from "@/components/monitoring/DetailPanel";
import { AlarmPanel } from "@/components/monitoring/AlarmPanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export const SystemMonitoring = () => {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  return (
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full p-4 overflow-auto">
            <HierarchicalView onSelectSystem={setSelectedSystem} selectedSystem={selectedSystem} />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={40} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60}>
              <div className="h-full p-4 overflow-auto">
                <DetailPanel selectedSystem={selectedSystem} />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={40}>
              <div className="h-full p-4 overflow-auto">
                <AlarmPanel />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
