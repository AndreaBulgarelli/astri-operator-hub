import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const PreparationTab = () => {
  const [checklist, setChecklist] = useState({
    weatherCheck: false,
    telescopeStatus: false,
    cameraStatus: false,
    networkStatus: false,
    timingSync: false,
  });

  const allChecked = Object.values(checklist).every(Boolean);

  const handlePrepare = () => {
    toast({
      title: "Array Preparation Started",
      description: "Preparing telescopes for observation...",
    });
  };

  return (
    <div className="h-full p-6 space-y-6">
      <Card className="control-panel p-6">
        <h2 className="text-xl font-semibold mb-2 text-primary">Observation Preparation</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Use Cases: ASTRI-UC-9.1.0.0-050 & ASTRI-UC-9.1.0.0-060
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Pre-Observation Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="weather"
                  checked={checklist.weatherCheck}
                  onCheckedChange={(checked) =>
                    setChecklist({ ...checklist, weatherCheck: checked as boolean })
                  }
                />
                <label htmlFor="weather" className="text-sm flex-1 cursor-pointer">
                  Weather conditions acceptable for observation
                </label>
                <Badge variant="outline" className="text-xs">WS1/WS2</Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="telescope"
                  checked={checklist.telescopeStatus}
                  onCheckedChange={(checked) =>
                    setChecklist({ ...checklist, telescopeStatus: checked as boolean })
                  }
                />
                <label htmlFor="telescope" className="text-sm flex-1 cursor-pointer">
                  All telescopes in ready state
                </label>
                <Badge variant="outline" className="text-xs">A1-A9</Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="camera"
                  checked={checklist.cameraStatus}
                  onCheckedChange={(checked) =>
                    setChecklist({ ...checklist, cameraStatus: checked as boolean })
                  }
                />
                <label htmlFor="camera" className="text-sm flex-1 cursor-pointer">
                  Camera systems initialized and cooled
                </label>
                <Badge variant="outline" className="text-xs">CAM</Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="network"
                  checked={checklist.networkStatus}
                  onCheckedChange={(checked) =>
                    setChecklist({ ...checklist, networkStatus: checked as boolean })
                  }
                />
                <label htmlFor="network" className="text-sm flex-1 cursor-pointer">
                  Network connectivity verified
                </label>
                <Badge variant="outline" className="text-xs">NET</Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="timing"
                  checked={checklist.timingSync}
                  onCheckedChange={(checked) =>
                    setChecklist({ ...checklist, timingSync: checked as boolean })
                  }
                />
                <label htmlFor="timing" className="text-sm flex-1 cursor-pointer">
                  Timing system synchronized
                </label>
                <Badge variant="outline" className="text-xs">TIM</Badge>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePrepare}
            disabled={!allChecked}
            className="w-full"
            size="lg"
          >
            {allChecked ? "Start Preparation" : "Complete Checklist to Continue"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
