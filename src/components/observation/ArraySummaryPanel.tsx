import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Maximize2, ExternalLink } from "lucide-react";

const generateTelescopeData = (baseValue: number, timeOffset: number) => {
  return Array.from({ length: 10 }, (_, i) => ({
    time: i,
    value: baseValue + Math.sin((timeOffset + i) * 0.3) * 30 + Math.random() * 20,
  }));
};

export const ArraySummaryPanel = () => {
  const [telescopeData, setTelescopeData] = useState(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      data: generateTelescopeData(950 + i * 10, 0),
      events: 1000 + i * 100,
    }))
  );
  const [timeOffset, setTimeOffset] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOffset(prev => prev + 1);
      setTelescopeData(prev =>
        prev.map((tel, i) => ({
          ...tel,
          data: generateTelescopeData(950 + i * 10, timeOffset),
          events: 1000 + i * 100 + Math.floor(Math.random() * 50),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [timeOffset]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDetached = () => {
    const newWindow = window.open('', 'Array Summary', 'width=1200,height=800');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Array Summary</title>
            <style>
              body { margin: 0; padding: 20px; background: #0a0a0a; color: #fff; font-family: system-ui; }
              .content { max-width: 1400px; margin: 0 auto; }
              h2 { color: #8b5cf6; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="content">
              <h2>Array Summary</h2>
              <p>Real-time telescope array status displayed in detached window.</p>
              <p>Showing data for all 9 telescopes in the array.</p>
            </div>
          </body>
        </html>
      `);
    }
  };

  return (
    <Card className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Array Summary</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            className="gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Fullscreen
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDetached}
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Detached
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {telescopeData.map((tel) => (
          <div key={tel.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">A{tel.id + 1}</span>
              <Badge className="bg-telescope-ready text-xs">Ready</Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Events: {tel.events}</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={tel.data}>
                <XAxis dataKey="time" hide />
                <YAxis domain={[900, 1100]} width={30} tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs text-center text-muted-foreground mt-1">Data Rate (MB/s)</div>
          </div>
        ))}
      </div>
    </Card>
  );
};
