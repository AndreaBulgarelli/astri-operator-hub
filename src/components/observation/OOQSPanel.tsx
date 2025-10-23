import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CameraGrid } from "./CameraGrid";

export const OOQSPanel = () => {
  const [viewMode, setViewMode] = useState<"variance-hg" | "variance-lg" | "scientific" | "pdm">("variance-hg");
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);

  return (
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
