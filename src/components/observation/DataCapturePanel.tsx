import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

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

const generateWeatherData = (points: number = 20, baseValues?: number[]) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    temperature: (baseValues?.[0] || 15) + Math.sin(i * 0.2) * 2 + Math.random() * 1,
    humidity: (baseValues?.[1] || 50) + Math.sin(i * 0.15) * 5 + Math.random() * 3,
    windSpeed: (baseValues?.[2] || 17) + Math.sin(i * 0.25) * 3 + Math.random() * 2,
    pressure: (baseValues?.[3] || 1015) + Math.sin(i * 0.1) * 3 + Math.random() * 1,
  }));
};

export const DataCapturePanel = () => {
  const [eventRateData, setEventRateData] = useState(generateMockData());
  const [dataRateData, setDataRateData] = useState(generateMockData());
  const [weatherData, setWeatherData] = useState(generateWeatherData());

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
      setWeatherData(prev => {
        const lastPoint = prev[prev.length - 1];
        const baseValues = [lastPoint.temperature, lastPoint.humidity, lastPoint.windSpeed, lastPoint.pressure];
        return generateWeatherData(20, baseValues);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="control-panel p-6">
      <h3 className="text-lg font-semibold mb-4 text-primary">Data Capture - Temporal Charts</h3>
      
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="bg-secondary mb-4">
          <TabsTrigger value="events">Event Rate</TabsTrigger>
          <TabsTrigger value="datarate">Data Rate</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
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
      </Tabs>
    </Card>
  );
};
