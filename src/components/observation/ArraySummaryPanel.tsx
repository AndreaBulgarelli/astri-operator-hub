import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

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

  return (
    <Card className="control-panel p-6">
      <h3 className="text-lg font-semibold mb-4 text-primary">Array Summary</h3>
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
