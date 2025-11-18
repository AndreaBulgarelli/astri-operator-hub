import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Zap, Maximize2, Minimize2, Download } from "lucide-react";

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

const generateUVSiPMData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    nsbCounts: 150 + Math.sin(i * 0.1) * 20 + Math.random() * 10,
    diffuseNsbFlux: 2.5e11 + Math.sin(i * 0.15) * 5e10 + Math.random() * 1e10,
  }));
};

export const UVSiPMPanel = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [uvsipmData, setUvsipmData] = useState(() => generateUVSiPMData(getPointsForRange('1m')));
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const points = getPointsForRange(timeRange);
    setUvsipmData(generateUVSiPMData(points));
    
    const interval = setInterval(() => {
      setUvsipmData(generateUVSiPMData(points));
    }, 2000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const latestData = uvsipmData[uvsipmData.length - 1];

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
                <Zap className="h-5 w-5 text-primary" />
                UVSiPM Night Sky Background (NSB)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">NSB Counts</div>
                <div className="text-xl font-semibold text-foreground">{latestData.nsbCounts.toFixed(1)} counts/s</div>
              </div>
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">Diffuse NSB Flux</div>
                <div className="text-xl font-semibold text-foreground">{(latestData.diffuseNsbFlux / 1e11).toFixed(2)}e11 ph/m²/ns/sr</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">NSB Counts (counts/s)</div>
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
                      onClick={() => handleDownloadChart('uvsipm-chart-1')}
                      className="h-6 w-6 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div id="uvsipm-chart-1" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={uvsipmData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="nsbCounts" stroke="#8b5cf6" strokeWidth={2} name="NSB Counts" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Diffuse NSB Flux (×10¹¹ ph/m²/ns/sr)</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadChart('uvsipm-chart-2')}
                    className="h-6 w-6 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
                <div id="uvsipm-chart-2" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={uvsipmData.map(d => ({ ...d, diffuseNsbFlux: d.diffuseNsbFlux / 1e11 }))}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="diffuseNsbFlux" stroke="#06b6d4" strokeWidth={2} name="Diffuse NSB Flux" dot={false} />
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
          <Zap className="h-5 w-5 text-primary" />
          UVSiPM Night Sky Background (NSB)
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
          <div className="text-xs text-muted-foreground">NSB Counts</div>
          <div className="text-xl font-semibold text-foreground">{latestData.nsbCounts.toFixed(1)} counts/s</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Diffuse NSB Flux</div>
          <div className="text-xl font-semibold text-foreground">{(latestData.diffuseNsbFlux / 1e11).toFixed(2)}e11 ph/m²/ns/sr</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">NSB Counts (counts/s)</div>
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
                onClick={() => handleDownloadChart('uvsipm-chart-3')}
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
          <div id="uvsipm-chart-3" className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uvsipmData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="nsbCounts" stroke="#8b5cf6" strokeWidth={2} name="NSB Counts" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Diffuse NSB Flux (×10¹¹ ph/m²/ns/sr)</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadChart('uvsipm-chart-4')}
              className="h-6 w-6 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
          <div id="uvsipm-chart-4" className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uvsipmData.map(d => ({ ...d, diffuseNsbFlux: d.diffuseNsbFlux / 1e11 }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="diffuseNsbFlux" stroke="#06b6d4" strokeWidth={2} name="Diffuse NSB Flux" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};
