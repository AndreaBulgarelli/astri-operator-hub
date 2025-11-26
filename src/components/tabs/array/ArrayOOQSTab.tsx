import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { CameraGrid } from "@/components/observation/CameraGrid";

export const ArrayOOQSTab = () => {
  const [viewMode, setViewMode] = useState<"var-hg" | "var-lg" | "sci-hg" | "sci-lg" | "cal-hg" | "cal-lg" | "pdm-rate">("var-hg");
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [fullscreenCamera, setFullscreenCamera] = useState<number | null>(null);
  const [isTabFullscreen, setIsTabFullscreen] = useState(false);

  if (isTabFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsTabFullscreen(false)}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
        <div className="pt-12">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">
                On-line Observation Quick-look System (OOQS)
              </h3>
              <RadioGroup value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="flex gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="var-hg" id="var-hg-full" />
                  <Label htmlFor="var-hg-full" className="text-xs cursor-pointer">VAR HG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="var-lg" id="var-lg-full" />
                  <Label htmlFor="var-lg-full" className="text-xs cursor-pointer">VAR LG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sci-hg" id="sci-hg-full" />
                  <Label htmlFor="sci-hg-full" className="text-xs cursor-pointer">SCI HG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sci-lg" id="sci-lg-full" />
                  <Label htmlFor="sci-lg-full" className="text-xs cursor-pointer">SCI LG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cal-hg" id="cal-hg-full" />
                  <Label htmlFor="cal-hg-full" className="text-xs cursor-pointer">CAL HG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cal-lg" id="cal-lg-full" />
                  <Label htmlFor="cal-lg-full" className="text-xs cursor-pointer">CAL LG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdm-rate" id="pdm-rate-full" />
                  <Label htmlFor="pdm-rate-full" className="text-xs cursor-pointer">PDM Rate</Label>
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
        </div>
      </div>
    );
  }

  if (fullscreenCamera !== null) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFullscreenCamera(null)}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
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
            <div className="flex items-center gap-4">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTabFullscreen(true)}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
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
