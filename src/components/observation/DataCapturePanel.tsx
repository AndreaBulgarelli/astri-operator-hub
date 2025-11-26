import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

// Mock data for temporal charts
const generateMockData = (points: number = 20, baseValues?: number[]) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    A1: (baseValues?.[0] || 1000) + Math.sin(i * 0.1) * 50 + Math.random() * 30,
    A2: (baseValues?.[1] || 950) + Math.sin(i * 0.15) * 50 + Math.random() * 30,
    A3: (baseValues?.[2] || 1050) + Math.sin(i * 0.12) * 50 + Math.random() * 30,
    A4: (baseValues?.[3] || 980) + Math.sin(i * 0.18) * 50 + Math.random() * 30,
    A5: (baseValues?.[4] || 1020) + Math.sin(i * 0.14) * 50 + Math.random() * 30,
    A6: (baseValues?.[5] || 990) + Math.sin(i * 0.16) * 50 + Math.random() * 30,
    A7: (baseValues?.[6] || 1030) + Math.sin(i * 0.11) * 50 + Math.random() * 30,
    A8: (baseValues?.[7] || 1010) + Math.sin(i * 0.13) * 50 + Math.random() * 30,
    A9: (baseValues?.[8] || 960) + Math.sin(i * 0.17) * 50 + Math.random() * 30,
  }));
};


export const DataCapturePanel = () => {
  const [eventRateData, setEventRateData] = useState(generateMockData());
  const [dataRateData, setDataRateData] = useState(generateMockData());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEventRateData(prev => {
        const lastPoint = prev[prev.length - 1];
        const baseValues = [1000, 950, 1050, 980, 1020, 990, 1030, 1010, 960];
        return generateMockData(20, baseValues);
      });
      setDataRateData(prev => {
        const baseValues = [1000, 950, 1050, 980, 1020, 990, 1030, 1010, 960];
        return generateMockData(20, baseValues);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleFullscreen = () => {
    const element = document.getElementById('monitoring-panel');
    if (element) {
      if (!document.fullscreenElement) {
        element.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <Card id="monitoring-panel" className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Monitoring - Temporal Charts</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFullscreen}
          className="gap-2"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>
      
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="bg-secondary mb-4">
          <TabsTrigger value="events">Event Rate</TabsTrigger>
          <TabsTrigger value="datarate">Data Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Event rate per telescope (events/s)</div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={eventRateData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="A1" stroke="#8884d8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A2" stroke="#82ca9d" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A3" stroke="#ffc658" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A4" stroke="#ff7c7c" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A5" stroke="#a78bfa" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A6" stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A7" stroke="#fb923c" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A8" stroke="#f472b6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A9" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="datarate">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Data rate per telescope (MB/s)</div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dataRateData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="A1" stroke="#8884d8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A2" stroke="#82ca9d" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A3" stroke="#ffc658" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A4" stroke="#ff7c7c" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A5" stroke="#a78bfa" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A6" stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A7" stroke="#fb923c" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A8" stroke="#f472b6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="A9" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
