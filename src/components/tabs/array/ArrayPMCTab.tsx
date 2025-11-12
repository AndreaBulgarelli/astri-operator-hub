import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export const ArrayPMCTab = () => {
  const [fullscreenTelescope, setFullscreenTelescope] = useState<number | null>(null);
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
          <h3 className="text-lg font-semibold text-primary mb-6">
            Pointing Monitoring Camera (PMC)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }, (_, i) => (
              <Card key={i} className="p-3 bg-background/50 relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFullscreenTelescope(i + 1)}
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
                
                <div className="space-y-2">
                  <div className="font-semibold text-sm">ASTRI-{i + 1}</div>
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mb-1"></div>
                      <p className="text-[8px] text-muted-foreground">PMC Feed</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (fullscreenTelescope !== null) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFullscreenTelescope(null)}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
        <div className="h-full flex items-center justify-center">
          <Card className="p-6 max-w-4xl w-full">
            <h3 className="text-xl font-semibold mb-4">ASTRI-{fullscreenTelescope} PMC</h3>
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-3 h-3 bg-white rounded-full mx-auto mb-2"></div>
                <p className="text-xs text-muted-foreground">PMC Image Feed</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="control-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-primary">
            Pointing Monitoring Camera (PMC)
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTabFullscreen(true)}
            className="h-8 w-8 p-0"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }, (_, i) => (
            <Card key={i} className="p-3 bg-background/50 relative group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFullscreenTelescope(i + 1)}
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              
              <div className="space-y-2">
                <div className="font-semibold text-sm">ASTRI-{i + 1}</div>
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mb-1"></div>
                    <p className="text-[8px] text-muted-foreground">PMC Feed</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
