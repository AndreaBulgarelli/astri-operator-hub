import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { CameraGrid } from "@/components/observation/CameraGrid";

export const ArrayOOQSTab = () => {
  const [viewMode, setViewMode] = useState<"variance-hg" | "variance-lg" | "scientific" | "pdm">("variance-hg");
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [fullscreenCamera, setFullscreenCamera] = useState<number | null>(null);

  if (fullscreenCamera !== null) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFullscreenCamera(null)}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          Exit Fullscreen
        </Button>
        <div className="h-full flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <CameraGrid
              cameraId={fullscreenCamera}
              viewMode={viewMode}
              isSelected={true}
              onSelect={() => {}}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="control-panel p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">
              On-line Observation Quick-look System (OOQS)
            </h3>
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
              <div key={i} className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFullscreenCamera(i + 1)}
                  className="absolute top-2 right-2 z-10 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
                <CameraGrid
                  cameraId={i + 1}
                  viewMode={viewMode}
                  isSelected={selectedCamera === i + 1}
                  onSelect={() => setSelectedCamera(i + 1)}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
