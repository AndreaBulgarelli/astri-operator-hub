import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

// Mock pointing data generator for each telescope
const generatePointingData = (telescopeId: number) => {
  return Array.from({ length: 20 }, (_, i) => {
    const baseOffset = telescopeId * 0.001;
    return {
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString(),
      raPlanned: 83.63 + Math.sin(i * 0.3) * 0.01,
      raActual: 83.63 + Math.sin(i * 0.3) * 0.01 + (Math.random() - 0.5) * 0.002 + baseOffset,
      decPlanned: 22.01 + Math.cos(i * 0.3) * 0.01,
      decActual: 22.01 + Math.cos(i * 0.3) * 0.01 + (Math.random() - 0.5) * 0.002 + baseOffset,
    };
  });
};

export const PointingPanel = () => {
  const [selectedTelescope, setSelectedTelescope] = useState("1");
  
  const telescopes = Array.from({ length: 9 }, (_, i) => ({
    id: String(i + 1),
    name: `A${i + 1}`,
  }));

  const pointingData = generatePointingData(parseInt(selectedTelescope));

  // Calculate errors
  const pointingErrorData = pointingData.map(d => ({
    time: d.time,
    raError: ((d.raActual - d.raPlanned) * 3600).toFixed(2), // arcsec
    decError: ((d.decActual - d.decPlanned) * 3600).toFixed(2), // arcsec
  }));

  return (
    <Card className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Pointing Analysis</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Telescope:</label>
          <Select value={selectedTelescope} onValueChange={setSelectedTelescope}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {telescopes.map(tel => (
                <SelectItem key={tel.id} value={tel.id}>{tel.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-muted-foreground mb-2">RA - Planned vs Actual (deg)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={pointingData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="raPlanned" stroke="#8b5cf6" strokeWidth={2} name="RA Planned" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="raActual" stroke="#ec4899" strokeWidth={2} name="RA Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">Dec - Planned vs Actual (deg)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={pointingData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="decPlanned" stroke="#8b5cf6" strokeWidth={2} name="Dec Planned" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="decActual" stroke="#ec4899" strokeWidth={2} name="Dec Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">Pointing Error (arcsec)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={pointingErrorData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="raError" stroke="#ef4444" strokeWidth={2} name="RA Error (arcsec)" />
              <Line type="monotone" dataKey="decError" stroke="#f59e0b" strokeWidth={2} name="Dec Error (arcsec)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
