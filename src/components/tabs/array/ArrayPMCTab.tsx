import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Maximize2, Minimize2, Target, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

const generatePMCData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    raError: (Math.random() - 0.5) * 2,
    decError: (Math.random() - 0.5) * 2,
    zenithTrackErr: (Math.random() - 0.5) * 1.5,
    azimuthTrackErr: (Math.random() - 0.5) * 1.5,
  }));
};

export const ArrayPMCTab = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [fullscreenTelescope, setFullscreenTelescope] = useState<number | null>(null);
  const [isTabFullscreen, setIsTabFullscreen] = useState(false);
  const [pmcData, setPmcData] = useState(() => 
    Array.from({ length: 9 }, () => generatePMCData(getPointsForRange('1m')))
  );

  useEffect(() => {
    const points = getPointsForRange(timeRange);
    const interval = setInterval(() => {
      setPmcData(Array.from({ length: 9 }, () => generatePMCData(points)));
    }, 2000);

    return () => clearInterval(interval);
  }, [timeRange]);

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
    const telescopeIndex = fullscreenTelescope - 1;
    const latestData = pmcData[telescopeIndex][pmcData[telescopeIndex].length - 1];

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
    
    return (
      <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFullscreenTelescope(null)}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
        <div className="pt-12">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              ASTRI-{fullscreenTelescope} PMC
            </h3>
            
            <div className="grid grid-cols-[400px_1fr] gap-6 mb-6">
              {/* PMC Image */}
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-3 h-3 bg-white rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-muted-foreground">PMC Image Feed</p>
                </div>
              </div>

              {/* Data boxes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded border border-border/50">
                  <div className="text-sm text-muted-foreground">RA Error</div>
                  <div className="text-2xl font-semibold text-foreground">{latestData.raError.toFixed(2)}°</div>
                </div>
                <div className="bg-secondary/30 p-4 rounded border border-border/50">
                  <div className="text-sm text-muted-foreground">Dec Error</div>
                  <div className="text-2xl font-semibold text-foreground">{latestData.decError.toFixed(2)}°</div>
                </div>
                <div className="bg-secondary/30 p-4 rounded border border-border/50">
                  <div className="text-sm text-muted-foreground">Zenith Track Err</div>
                  <div className="text-2xl font-semibold text-foreground">{latestData.zenithTrackErr.toFixed(2)}°</div>
                </div>
                <div className="bg-secondary/30 p-4 rounded border border-border/50">
                  <div className="text-sm text-muted-foreground">Azimuth Track Err</div>
                  <div className="text-2xl font-semibold text-foreground">{latestData.azimuthTrackErr.toFixed(2)}°</div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">RA & Dec Pointing Errors (°)</div>
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
                      onClick={() => handleDownloadChart('pmc-chart-1')}
                      className="h-6 w-6 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div id="pmc-chart-1">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={pmcData[telescopeIndex]}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="raError" stroke="#3b82f6" strokeWidth={2} name="RA Error" dot={false} />
                      <Line type="monotone" dataKey="decError" stroke="#ef4444" strokeWidth={2} name="Dec Error" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Tracking Errors (°)</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadChart('pmc-chart-2')}
                    className="h-6 w-6 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
                <div id="pmc-chart-2">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={pmcData[telescopeIndex]}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="zenithTrackErr" stroke="#10b981" strokeWidth={2} name="Zenith Track Err" dot={false} />
                      <Line type="monotone" dataKey="azimuthTrackErr" stroke="#f59e0b" strokeWidth={2} name="Azimuth Track Err" dot={false} />
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
        
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 9 }, (_, i) => {
            const latestData = pmcData[i][pmcData[i].length - 1];
            return (
              <Card key={i} className="p-4 bg-background/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    ASTRI-{i + 1} PMC
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFullscreenTelescope(i + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-[300px_1fr] gap-4 mb-4">
                  {/* PMC Image */}
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mb-1"></div>
                      <p className="text-[8px] text-muted-foreground">PMC Feed</p>
                    </div>
                  </div>

                  {/* Data boxes */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary/30 p-3 rounded border border-border/50">
                      <div className="text-xs text-muted-foreground">RA Error</div>
                      <div className="text-xl font-semibold text-foreground">{latestData.raError.toFixed(2)}°</div>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded border border-border/50">
                      <div className="text-xs text-muted-foreground">Dec Error</div>
                      <div className="text-xl font-semibold text-foreground">{latestData.decError.toFixed(2)}°</div>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded border border-border/50">
                      <div className="text-xs text-muted-foreground">Zenith Track Err</div>
                      <div className="text-xl font-semibold text-foreground">{latestData.zenithTrackErr.toFixed(2)}°</div>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded border border-border/50">
                      <div className="text-xs text-muted-foreground">Azimuth Track Err</div>
                      <div className="text-xl font-semibold text-foreground">{latestData.azimuthTrackErr.toFixed(2)}°</div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-muted-foreground">RA & Dec Pointing Errors (°)</div>
                      <div className="flex gap-2">
                        <div className="flex gap-1">
                          {['1m', '5m', '15m', '1h', '4h', '1d'].map((range) => (
                            <Button
                              key={range}
                              variant={timeRange === range ? "default" : "outline"}
                              size="sm"
                              onClick={() => setTimeRange(range as TimeRange)}
                              className="h-5 px-1.5 text-[10px]"
                            >
                              {range}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const svgElement = document.querySelector(`#pmc-chart-${i}-1 .recharts-wrapper svg`);
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
                                downloadLink.download = `pmc-chart-${i}-1.png`;
                                downloadLink.href = pngFile;
                                downloadLink.click();
                              };
                              img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
                            }
                          }}
                          className="h-5 w-5 p-0"
                        >
                          <Download className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                    <div id={`pmc-chart-${i}-1`} className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={pmcData[i]}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="time" className="text-[8px]" stroke="hsl(var(--foreground))" />
                          <YAxis className="text-[8px]" stroke="hsl(var(--foreground))" />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Line type="monotone" dataKey="raError" stroke="#3b82f6" strokeWidth={1.5} name="RA" dot={false} />
                          <Line type="monotone" dataKey="decError" stroke="#ef4444" strokeWidth={1.5} name="Dec" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-muted-foreground">Tracking Errors (°)</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const svgElement = document.querySelector(`#pmc-chart-${i}-2 .recharts-wrapper svg`);
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
                              downloadLink.download = `pmc-chart-${i}-2.png`;
                              downloadLink.href = pngFile;
                              downloadLink.click();
                            };
                            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
                          }
                        }}
                        className="h-5 w-5 p-0"
                      >
                        <Download className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                    <div id={`pmc-chart-${i}-2`} className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={pmcData[i]}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="time" className="text-[8px]" stroke="hsl(var(--foreground))" />
                          <YAxis className="text-[8px]" stroke="hsl(var(--foreground))" />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Line type="monotone" dataKey="zenithTrackErr" stroke="#10b981" strokeWidth={1.5} name="Zenith" dot={false} />
                          <Line type="monotone" dataKey="azimuthTrackErr" stroke="#f59e0b" strokeWidth={1.5} name="Azimuth" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
