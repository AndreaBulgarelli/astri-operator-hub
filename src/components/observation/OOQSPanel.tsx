import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { CameraGrid } from "./CameraGrid";

export const OOQSPanel = () => {
  const [viewMode, setViewMode] = useState<"variance-hg" | "variance-lg" | "scientific" | "pdm">("variance-hg");
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
          <RadioGroup value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="variance-hg" id="variance-hg" />
              <Label htmlFor="variance-hg" className="text-xs cursor-pointer">Variance HG</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="variance-lg" id="variance-lg" />
              <Label htmlFor="variance-lg" className="text-xs cursor-pointer">Variance LG</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scientific" id="scientific" />
              <Label htmlFor="scientific" className="text-xs cursor-pointer">Scientific</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdm" id="pdm" />
              <Label htmlFor="pdm" className="text-xs cursor-pointer">PDM</Label>
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
