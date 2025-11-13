import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { CameraGrid } from "./CameraGrid";

export const OOQSPanel = () => {
  const [viewMode, setViewMode] = useState<"var-hg" | "var-lg" | "sci-hg" | "sci-lg" | "cal-hg" | "cal-lg" | "pdm-rate">("var-hg");
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    const element = document.getElementById('ooqs-panel');
    if (element) {
      if (!document.fullscreenElement) {
        element.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <Card id="ooqs-panel" className="control-panel p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-primary">
              On-line Observation Quick-look System (OOQS)
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="gap-2"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </Button>
          </div>
          <RadioGroup value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="flex gap-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="var-hg" id="var-hg" />
              <Label htmlFor="var-hg" className="text-xs cursor-pointer">VAR HG</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="var-lg" id="var-lg" />
              <Label htmlFor="var-lg" className="text-xs cursor-pointer">VAR LG</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sci-hg" id="sci-hg" />
              <Label htmlFor="sci-hg" className="text-xs cursor-pointer">SCI HG</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sci-lg" id="sci-lg" />
              <Label htmlFor="sci-lg" className="text-xs cursor-pointer">SCI LG</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cal-hg" id="cal-hg" />
              <Label htmlFor="cal-hg" className="text-xs cursor-pointer">CAL HG</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cal-lg" id="cal-lg" />
              <Label htmlFor="cal-lg" className="text-xs cursor-pointer">CAL LG</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdm-rate" id="pdm-rate" />
              <Label htmlFor="pdm-rate" className="text-xs cursor-pointer">PDM Rate</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }, (_, i) => (
            <CameraGrid
              key={i}
              cameraId={i + 1}
              viewMode={viewMode}
              isSelected={selectedCamera === i + 1}
              onSelect={() => setSelectedCamera(i + 1)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
