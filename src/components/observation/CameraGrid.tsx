import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CameraGridProps {
  cameraId: number;
  viewMode: "var-hg" | "var-lg" | "sci-hg" | "sci-lg" | "cal-hg" | "cal-lg" | "pdm-rate";
  isSelected: boolean;
  onSelect: () => void;
}

export const CameraGrid = ({ cameraId, viewMode, isSelected, onSelect }: CameraGridProps) => {
  const [gridData, setGridData] = useState<number[][]>([]);

  useEffect(() => {
    // Generate mock data for camera grid (37x37 pixels in a camera shape)
    const data: number[][] = [];
    const size = 11;
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        // Create camera hexagonal pattern
        const distance = Math.sqrt(Math.pow(i - size/2, 2) + Math.pow(j - size/2, 2));
        if (distance < size / 2) {
          row.push(Math.random() * 100);
        } else {
          row.push(-1); // Outside camera area
        }
      }
      data.push(row);
    }
    setGridData(data);
  }, [viewMode]);

  const getColorForValue = (value: number) => {
    if (value < 0) return "transparent";
    
    // Color scale from blue (low) to red (high)
    const normalized = value / 100;
    if (normalized < 0.2) return "rgb(0, 0, 255)";
    if (normalized < 0.4) return "rgb(0, 255, 255)";
    if (normalized < 0.6) return "rgb(0, 255, 0)";
    if (normalized < 0.8) return "rgb(255, 255, 0)";
    return "rgb(255, 0, 0)";
  };

  return (
    <Card
      className={cn(
        "control-panel p-4 cursor-pointer transition-all hover:scale-105",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onSelect}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">A{cameraId}</Badge>
          <span className="text-xs text-muted-foreground">
            {viewMode.toUpperCase().replace("-", " ")}
          </span>
        </div>

        <div className="flex justify-center">
          <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(11, 1fr)` }}>
            {gridData.map((row, i) =>
              row.map((value, j) => (
                <div
                  key={`${i}-${j}`}
                  className="w-2 h-2"
                  style={{
                    backgroundColor: getColorForValue(value),
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div className="text-[10px] text-muted-foreground text-center font-mono">
          Rate: {(1000 + Math.random() * 100).toFixed(0)} Hz
        </div>
      </div>
    </Card>
  );
};
