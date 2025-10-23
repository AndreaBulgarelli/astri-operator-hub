import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { StopCircle } from "lucide-react";

export const EndTab = () => {
  const [shutdownChecklist, setShutdownChecklist] = useState({
    dataArchived: false,
    telescopesParked: false,
    camerasShutdown: false,
    logsGenerated: false,
  });

  const allChecked = Object.values(shutdownChecklist).every(Boolean);

  const handleShutdown = () => {
    toast({
      title: "Shutdown Initiated",
      description: "Safely shutting down all systems...",
    });
  };

  return (
    <div className="h-full p-6 space-y-6">
      <Card className="control-panel p-6">
        <h2 className="text-xl font-semibold mb-2 text-primary">End of Operations</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Safely shut down observation systems
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shutdown Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="data"
                  checked={shutdownChecklist.dataArchived}
                  onCheckedChange={(checked) =>
                    setShutdownChecklist({ ...shutdownChecklist, dataArchived: checked as boolean })
                  }
                />
                <label htmlFor="data" className="text-sm flex-1 cursor-pointer">
                  All observation data archived
                </label>
                <Badge variant="outline" className="text-xs">DATA</Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="telescopes"
                  checked={shutdownChecklist.telescopesParked}
                  onCheckedChange={(checked) =>
                    setShutdownChecklist({ ...shutdownChecklist, telescopesParked: checked as boolean })
                  }
                />
                <label htmlFor="telescopes" className="text-sm flex-1 cursor-pointer">
                  All telescopes parked safely
                </label>
                <Badge variant="outline" className="text-xs">A1-A9</Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="cameras"
                  checked={shutdownChecklist.camerasShutdown}
                  onCheckedChange={(checked) =>
                    setShutdownChecklist({ ...shutdownChecklist, camerasShutdown: checked as boolean })
                  }
                />
                <label htmlFor="cameras" className="text-sm flex-1 cursor-pointer">
                  Camera systems shut down properly
                </label>
                <Badge variant="outline" className="text-xs">CAM</Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="logs"
                  checked={shutdownChecklist.logsGenerated}
                  onCheckedChange={(checked) =>
                    setShutdownChecklist({ ...shutdownChecklist, logsGenerated: checked as boolean })
                  }
                />
                <label htmlFor="logs" className="text-sm flex-1 cursor-pointer">
                  Operation logs generated and saved
                </label>
                <Badge variant="outline" className="text-xs">LOG</Badge>
              </div>
            </div>
          </div>

          <Button
            onClick={handleShutdown}
            disabled={!allChecked}
            variant="destructive"
            className="w-full gap-2"
            size="lg"
          >
            <StopCircle className="h-5 w-5" />
            {allChecked ? "Initiate System Shutdown" : "Complete Checklist to Continue"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
