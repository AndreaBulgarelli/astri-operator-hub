import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TelescopeArray } from "./TelescopeArray";
import { SiteServices } from "./SiteServices";

interface HierarchicalViewProps {
  onSelectSystem: (system: string) => void;
  selectedSystem: string | null;
}

export const HierarchicalView = ({ onSelectSystem, selectedSystem }: HierarchicalViewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Array Status</h2>
          <Badge variant="outline" className="text-xs">L1 View</Badge>
        </div>

        <Card className="control-panel p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Observing Systems</h3>
            <TelescopeArray onSelectTelescope={onSelectSystem} selectedTelescope={selectedSystem} />
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Site Services</h3>
            <SiteServices onSelectService={onSelectSystem} selectedService={selectedSystem} />
          </div>
        </Card>
      </div>
    </div>
  );
};
