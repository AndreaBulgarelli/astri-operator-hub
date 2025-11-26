import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Star, Maximize2, Minimize2 } from "lucide-react";

const generateSQMData = (points: number = 20, offset: number = 0) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    skyBrightness: 21.5 + offset + Math.sin(i * 0.1) * 0.5 + Math.random() * 0.2,
    skyBrightnessRaw: 21.8 + offset + Math.sin(i * 0.1) * 0.5 + Math.random() * 0.2,
  }));
};

export const SQMPanel = () => {
  const [sqmData1, setSqmData1] = useState(generateSQMData(20, 0));
  const [sqmData2, setSqmData2] = useState(generateSQMData(20, 0.3));
  const [sqmData3, setSqmData3] = useState(generateSQMData(20, -0.2));
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSqmData1(generateSQMData(20, 0));
      setSqmData2(generateSQMData(20, 0.3));
      setSqmData3(generateSQMData(20, -0.2));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData1 = sqmData1[sqmData1.length - 1];
  const latestData2 = sqmData2[sqmData2.length - 1];
  const latestData3 = sqmData3[sqmData3.length - 1];

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
        
        <div className="pt-12 h-full">
          <Card className="control-panel p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Sky Quality Meter (SQM)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* SQM 1 */}
              <div>
                <h4 className="text-md font-semibold text-foreground mb-3">SQM 1</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-secondary/30 p-3 rounded border border-border/50">
                    <div className="text-xs text-muted-foreground">Sky Brightness</div>
                    <div className="text-lg font-semibold text-foreground">{latestData1.skyBrightness.toFixed(2)} mag/arcsec²</div>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded border border-border/50">
                    <div className="text-xs text-muted-foreground">Raw Brightness</div>
                    <div className="text-lg font-semibold text-foreground">{latestData1.skyBrightnessRaw.toFixed(2)} mag/arcsec²</div>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sqmData1}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[20, 23]} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="skyBrightness" stroke="#fbbf24" strokeWidth={2} name="Sky Brightness" dot={false} />
                      <Line type="monotone" dataKey="skyBrightnessRaw" stroke="#f59e0b" strokeWidth={2} name="Raw Brightness" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SQM 2 */}
              <div>
                <h4 className="text-md font-semibold text-foreground mb-3">SQM 2</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-secondary/30 p-3 rounded border border-border/50">
                    <div className="text-xs text-muted-foreground">Sky Brightness</div>
                    <div className="text-lg font-semibold text-foreground">{latestData2.skyBrightness.toFixed(2)} mag/arcsec²</div>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded border border-border/50">
                    <div className="text-xs text-muted-foreground">Raw Brightness</div>
                    <div className="text-lg font-semibold text-foreground">{latestData2.skyBrightnessRaw.toFixed(2)} mag/arcsec²</div>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sqmData2}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[20, 23]} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="skyBrightness" stroke="#fbbf24" strokeWidth={2} name="Sky Brightness" dot={false} />
                      <Line type="monotone" dataKey="skyBrightnessRaw" stroke="#f59e0b" strokeWidth={2} name="Raw Brightness" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SQM 3 */}
              <div>
                <h4 className="text-md font-semibold text-foreground mb-3">SQM 3</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-secondary/30 p-3 rounded border border-border/50">
                    <div className="text-xs text-muted-foreground">Sky Brightness</div>
                    <div className="text-lg font-semibold text-foreground">{latestData3.skyBrightness.toFixed(2)} mag/arcsec²</div>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded border border-border/50">
                    <div className="text-xs text-muted-foreground">Raw Brightness</div>
                    <div className="text-lg font-semibold text-foreground">{latestData3.skyBrightnessRaw.toFixed(2)} mag/arcsec²</div>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sqmData3}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[20, 23]} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="skyBrightness" stroke="#fbbf24" strokeWidth={2} name="Sky Brightness" dot={false} />
                      <Line type="monotone" dataKey="skyBrightnessRaw" stroke="#f59e0b" strokeWidth={2} name="Raw Brightness" dot={false} />
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
          <Star className="h-5 w-5 text-primary" />
          Sky Quality Meter (SQM)
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

      <div className="grid grid-cols-1 gap-6">
        {/* SQM 1 */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-3">SQM 1</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-secondary/30 p-3 rounded border border-border/50">
              <div className="text-xs text-muted-foreground">Sky Brightness</div>
              <div className="text-lg font-semibold text-foreground">{latestData1.skyBrightness.toFixed(2)} mag/arcsec²</div>
            </div>
            <div className="bg-secondary/30 p-3 rounded border border-border/50">
              <div className="text-xs text-muted-foreground">Raw Brightness</div>
              <div className="text-lg font-semibold text-foreground">{latestData1.skyBrightnessRaw.toFixed(2)} mag/arcsec²</div>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sqmData1}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[20, 23]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="skyBrightness" stroke="#fbbf24" strokeWidth={2} name="Sky Brightness" dot={false} />
                <Line type="monotone" dataKey="skyBrightnessRaw" stroke="#f59e0b" strokeWidth={2} name="Raw Brightness" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SQM 2 */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-3">SQM 2</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-secondary/30 p-3 rounded border border-border/50">
              <div className="text-xs text-muted-foreground">Sky Brightness</div>
              <div className="text-lg font-semibold text-foreground">{latestData2.skyBrightness.toFixed(2)} mag/arcsec²</div>
            </div>
            <div className="bg-secondary/30 p-3 rounded border border-border/50">
              <div className="text-xs text-muted-foreground">Raw Brightness</div>
              <div className="text-lg font-semibold text-foreground">{latestData2.skyBrightnessRaw.toFixed(2)} mag/arcsec²</div>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sqmData2}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[20, 23]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="skyBrightness" stroke="#fbbf24" strokeWidth={2} name="Sky Brightness" dot={false} />
                <Line type="monotone" dataKey="skyBrightnessRaw" stroke="#f59e0b" strokeWidth={2} name="Raw Brightness" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SQM 3 */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-3">SQM 3</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-secondary/30 p-3 rounded border border-border/50">
              <div className="text-xs text-muted-foreground">Sky Brightness</div>
              <div className="text-lg font-semibold text-foreground">{latestData3.skyBrightness.toFixed(2)} mag/arcsec²</div>
            </div>
            <div className="bg-secondary/30 p-3 rounded border border-border/50">
              <div className="text-xs text-muted-foreground">Raw Brightness</div>
              <div className="text-lg font-semibold text-foreground">{latestData3.skyBrightnessRaw.toFixed(2)} mag/arcsec²</div>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sqmData3}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[20, 23]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="skyBrightness" stroke="#fbbf24" strokeWidth={2} name="Sky Brightness" dot={false} />
                <Line type="monotone" dataKey="skyBrightnessRaw" stroke="#f59e0b" strokeWidth={2} name="Raw Brightness" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};
