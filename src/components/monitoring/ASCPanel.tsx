import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Camera, Maximize2, Minimize2 } from "lucide-react";

const generateASCData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    allSkyCover: 30 + Math.sin(i * 0.1) * 20 + Math.random() * 10,
    windowCover: 15 + Math.sin(i * 0.15) * 10 + Math.random() * 5,
  }));
};

export const ASCPanel = () => {
  const [ascData, setAscData] = useState(generateASCData());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenItem, setFullscreenItem] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAscData(generateASCData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = ascData[ascData.length - 1];

  if (isFullscreen || fullscreenItem) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsFullscreen(false);
            setFullscreenItem(null);
          }}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
        
        <div className="pt-12">
          <Card className="control-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                All Sky Camera (ASC)
              </h3>
            </div>

            {fullscreenItem === "image" ? (
              <div className="aspect-square max-w-4xl mx-auto bg-gradient-to-br from-blue-900 via-purple-900 to-black rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)]"></div>
                <div className="relative text-center">
                  <div className="w-6 h-6 bg-white rounded-full mx-auto mb-3 animate-pulse"></div>
                  <p className="text-sm text-muted-foreground">All-Sky Camera Feed</p>
                  <p className="text-xs text-muted-foreground mt-2">Cloud Coverage: {latestData.allSkyCover.toFixed(1)}%</p>
                </div>
              </div>
            ) : fullscreenItem === "chart" ? (
              <div className="h-[600px]">
                <div className="text-sm text-muted-foreground mb-2">Cloud Cover (%)</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ascData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                    <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="allSkyCover" stroke="#3b82f6" strokeWidth={2} name="All Sky Cover" dot={false} />
                    <Line type="monotone" dataKey="windowCover" stroke="#8b5cf6" strokeWidth={2} name="Window Cover" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-secondary/30 p-3 rounded border border-border/50">
                    <div className="text-xs text-muted-foreground">All Sky Cover</div>
                    <div className="text-xl font-semibold text-foreground">{latestData.allSkyCover.toFixed(1)}%</div>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded border border-border/50">
                    <div className="text-xs text-muted-foreground">Window Cover</div>
                    <div className="text-xl font-semibold text-foreground">{latestData.windowCover.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFullscreenItem("image")}
                      className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <div className="aspect-square max-w-2xl mx-auto bg-gradient-to-br from-blue-900 via-purple-900 to-black rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)]"></div>
                      <div className="relative text-center">
                        <div className="w-6 h-6 bg-white rounded-full mx-auto mb-3 animate-pulse"></div>
                        <p className="text-sm text-muted-foreground">All-Sky Camera Feed</p>
                        <p className="text-xs text-muted-foreground mt-2">Cloud Coverage: {latestData.allSkyCover.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFullscreenItem("chart")}
                      className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <div className="text-sm text-muted-foreground mb-2">Cloud Cover (%)</div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={ascData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                        <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                        <Legend />
                        <Line type="monotone" dataKey="allSkyCover" stroke="#3b82f6" strokeWidth={2} name="All Sky Cover" dot={false} />
                        <Line type="monotone" dataKey="windowCover" stroke="#8b5cf6" strokeWidth={2} name="Window Cover" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          All Sky Camera (ASC)
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(true)}
          className="h-8 w-8 p-0"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">All Sky Cover</div>
          <div className="text-xl font-semibold text-foreground">{latestData.allSkyCover.toFixed(1)}%</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Window Cover</div>
          <div className="text-xl font-semibold text-foreground">{latestData.windowCover.toFixed(1)}%</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative group">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsFullscreen(true);
              setFullscreenItem("image");
            }}
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-blue-900 via-purple-900 to-black rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)]"></div>
            <div className="relative text-center">
              <div className="w-4 h-4 bg-white rounded-full mx-auto mb-2 animate-pulse"></div>
              <p className="text-xs text-muted-foreground">All-Sky Camera Feed</p>
              <p className="text-[10px] text-muted-foreground mt-1">Cloud: {latestData.allSkyCover.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsFullscreen(true);
              setFullscreenItem("chart");
            }}
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground mb-2">Cloud Cover (%)</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ascData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="allSkyCover" stroke="#3b82f6" strokeWidth={2} name="All Sky Cover" dot={false} />
              <Line type="monotone" dataKey="windowCover" stroke="#8b5cf6" strokeWidth={2} name="Window Cover" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
