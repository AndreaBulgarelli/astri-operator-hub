import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data for temporal charts
const generateMockData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    A1: 1000 + Math.random() * 200,
    A2: 950 + Math.random() * 200,
    A3: 1050 + Math.random() * 200,
    A4: 980 + Math.random() * 200,
    A5: 1020 + Math.random() * 200,
    A6: 990 + Math.random() * 200,
    A7: 1030 + Math.random() * 200,
    A8: 1010 + Math.random() * 200,
    A9: 960 + Math.random() * 200,
  }));
};

const weatherData = Array.from({ length: 20 }, (_, i) => ({
  time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString(),
  temperature: 15 + Math.random() * 5,
  humidity: 40 + Math.random() * 20,
  windSpeed: 10 + Math.random() * 15,
  pressure: 1010 + Math.random() * 10,
}));

const pointingData = Array.from({ length: 20 }, (_, i) => ({
  time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString(),
  raPlanned: 83.63 + Math.sin(i * 0.3) * 0.01,
  raActual: 83.63 + Math.sin(i * 0.3) * 0.01 + (Math.random() - 0.5) * 0.002,
  decPlanned: 22.01 + Math.cos(i * 0.3) * 0.01,
  decActual: 22.01 + Math.cos(i * 0.3) * 0.01 + (Math.random() - 0.5) * 0.002,
}));

export const DataCapturePanel = () => {
  const eventRateData = generateMockData();
  const dataRateData = generateMockData();

  // Calculate errors for pointing
  const pointingErrorData = pointingData.map(d => ({
    time: d.time,
    raError: ((d.raActual - d.raPlanned) * 3600).toFixed(2), // arcsec
    decError: ((d.decActual - d.decPlanned) * 3600).toFixed(2), // arcsec
  }));

  return (
    <Card className="control-panel p-6">
      <h3 className="text-lg font-semibold mb-4 text-primary">Data Capture - Temporal Charts</h3>
      
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="bg-secondary mb-4">
          <TabsTrigger value="events">Event Rate</TabsTrigger>
          <TabsTrigger value="datarate">Data Rate</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="pointing">Pointing</TabsTrigger>
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

        <TabsContent value="weather">
          <div className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Temperature (°C) & Humidity (%)</div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
                  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} name="Humidity (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Wind Speed (km/h) & Pressure (hPa)</div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" dataKey="windSpeed" stroke="#10b981" strokeWidth={2} name="Wind Speed (km/h)" />
                  <Line type="monotone" dataKey="pressure" stroke="#f59e0b" strokeWidth={2} name="Pressure (hPa)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pointing">
          <div className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">RA - Planned vs Actual (deg)</div>
              <ResponsiveContainer width="100%" height={250}>
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
              <ResponsiveContainer width="100%" height={250}>
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
              <ResponsiveContainer width="100%" height={250}>
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
        </TabsContent>
      </Tabs>
    </Card>
  );
};
