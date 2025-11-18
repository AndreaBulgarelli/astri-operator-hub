import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Waves, Maximize2, Minimize2, Download } from "lucide-react";

type TimeRange = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

const getPointsForRange = (range: TimeRange): number => {
  switch (range) {
    case '1m': return 20;
    case '5m': return 100;
    case '15m': return 300;
    case '1h': return 120;
    case '4h': return 480;
    case '1d': return 288;
  }
};

const generateLIDARData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    atmExtinction: 0.1 + Math.sin(i * 0.15) * 0.05 + Math.random() * 0.02,
    atmTransmission: 0.85 + Math.sin(i * 0.1) * 0.05 + Math.random() * 0.03,
    dustPresence: 0.3 + Math.sin(i * 0.2) * 0.2 + Math.random() * 0.1,
  }));
};

export const LIDARPanel = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [lidarData, setLidarData] = useState(() => generateLIDARData(getPointsForRange('1m')));
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const points = getPointsForRange(timeRange);
    setLidarData(generateLIDARData(points));
    
    const interval = setInterval(() => {
      setLidarData(generateLIDARData(points));
    }, 2000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const latestData = lidarData[lidarData.length - 1];

  const handleDownloadChart = (chartId: string) => {
    const svgElement = document.querySelector(`#${chartId} .recharts-wrapper svg`);
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${chartId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const timeRanges: TimeRange[] = ['1m', '5m', '15m', '1h', '4h', '1d'];

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(false)}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
        
        <div className="pt-12">
          <Card className="control-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Waves className="h-5 w-5 text-primary" />
                LIDAR Atmospheric Monitoring
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">Extinction</div>
                <div className="text-xl font-semibold text-foreground">{latestData.atmExtinction.toFixed(3)}</div>
              </div>
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">Transmission</div>
                <div className="text-xl font-semibold text-foreground">{(latestData.atmTransmission * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">Dust Presence</div>
                <div className="text-xl font-semibold text-foreground">{(latestData.dustPresence * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Atmospheric Extinction & Transmission</div>
                  <div className="flex gap-2">
                    <div className="flex gap-1">
                      {timeRanges.map((range) => (
                        <Button
                          key={range}
                          variant={timeRange === range ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTimeRange(range)}
                          className="h-6 px-2 text-xs"
                        >
                          {range}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadChart('lidar-chart-1')}
                      className="h-6 w-6 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div id="lidar-chart-1" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lidarData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="atmExtinction" stroke="#ef4444" strokeWidth={2} name="Extinction" dot={false} />
                      <Line type="monotone" dataKey="atmTransmission" stroke="#10b981" strokeWidth={2} name="Transmission" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Dust Presence</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadChart('lidar-chart-2')}
                    className="h-6 w-6 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
                <div id="lidar-chart-2" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lidarData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="dustPresence" stroke="#f59e0b" strokeWidth={2} name="Dust Presence" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Waves className="h-5 w-5 text-primary" />
          LIDAR Atmospheric Monitoring
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

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Extinction</div>
          <div className="text-xl font-semibold text-foreground">{latestData.atmExtinction.toFixed(3)}</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Transmission</div>
          <div className="text-xl font-semibold text-foreground">{(latestData.atmTransmission * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Dust Presence</div>
          <div className="text-xl font-semibold text-foreground">{(latestData.dustPresence * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Atmospheric Extinction & Transmission</div>
            <div className="flex gap-2">
              <div className="flex gap-1">
                {timeRanges.map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className="h-6 px-2 text-xs"
                  >
                    {range}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadChart('lidar-chart-3')}
                className="h-6 w-6 p-0"
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="h-6 w-6 p-0"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div id="lidar-chart-3" className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lidarData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="atmExtinction" stroke="#ef4444" strokeWidth={2} name="Extinction" dot={false} />
                <Line type="monotone" dataKey="atmTransmission" stroke="#10b981" strokeWidth={2} name="Transmission" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Dust Presence</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadChart('lidar-chart-4')}
              className="h-6 w-6 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
          <div id="lidar-chart-4" className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lidarData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="dustPresence" stroke="#f59e0b" strokeWidth={2} name="Dust Presence" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};
