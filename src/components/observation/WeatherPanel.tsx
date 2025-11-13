import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Maximize2, Minimize2, CloudRain } from "lucide-react";

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

const generateEMSCData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    extTmp: 15 + Math.sin(i * 0.2) * 2 + Math.random() * 1,
    dewPoint: 8 + Math.sin(i * 0.15) * 1.5 + Math.random() * 0.8,
    windSpd: 15 + Math.sin(i * 0.25) * 3 + Math.random() * 2,
    wnd10Avg: 17 + Math.sin(i * 0.2) * 2.5 + Math.random() * 1.5,
    rainRate: Math.max(0, Math.sin(i * 0.3) * 2 + Math.random() * 1),
    rainDaily: 5 + i * 0.1,
    baromtr: 1015 + Math.sin(i * 0.1) * 3 + Math.random() * 1,
    extUmdy: 50 + Math.sin(i * 0.15) * 5 + Math.random() * 3,
    windGust10M: 20 + Math.sin(i * 0.3) * 4 + Math.random() * 2,
  }));
};

export const WeatherPanel = ({ showControls = true }: { showControls?: boolean }) => {
  const [weatherData, setWeatherData] = useState(generateWeatherData());
  const [emscData, setEmscData] = useState(generateEMSCData());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(prev => {
        const lastPoint = prev[prev.length - 1];
        const baseValues = [lastPoint.temperature, lastPoint.humidity, lastPoint.windSpeed, lastPoint.pressure];
        return generateWeatherData(20, baseValues);
      });
      setEmscData(generateEMSCData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleFullscreen = () => {
    const element = document.getElementById('weather-panel');
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

  const latestEmscData = emscData[emscData.length - 1];

  return (
    <Card id="weather-panel" className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CloudRain className="h-5 w-5 text-primary" />
          EMSC Weather Station
        </h3>
        {showControls && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            className="gap-2"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        )}
      </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-secondary/30 p-3 rounded border border-border/50">
            <div className="text-xs text-muted-foreground">Temperature</div>
            <div className="text-xl font-semibold text-foreground">{latestEmscData.extTmp.toFixed(1)}°C</div>
          </div>
          <div className="bg-secondary/30 p-3 rounded border border-border/50">
            <div className="text-xs text-muted-foreground">Humidity</div>
            <div className="text-xl font-semibold text-foreground">{latestEmscData.extUmdy.toFixed(0)}%</div>
          </div>
          <div className="bg-secondary/30 p-3 rounded border border-border/50">
            <div className="text-xs text-muted-foreground">Pressure</div>
            <div className="text-xl font-semibold text-foreground">{latestEmscData.baromtr.toFixed(1)} hPa</div>
          </div>
          <div className="bg-secondary/30 p-3 rounded border border-border/50">
            <div className="text-xs text-muted-foreground">Wind Speed</div>
            <div className="text-xl font-semibold text-foreground">{latestEmscData.windSpd.toFixed(1)} km/h</div>
          </div>
          <div className="bg-secondary/30 p-3 rounded border border-border/50">
            <div className="text-xs text-muted-foreground">Wind Gust (10m)</div>
            <div className="text-xl font-semibold text-foreground">{latestEmscData.windGust10M.toFixed(1)} km/h</div>
          </div>
          <div className="bg-secondary/30 p-3 rounded border border-border/50">
            <div className="text-xs text-muted-foreground">Rain Rate</div>
            <div className="text-xl font-semibold text-foreground">{latestEmscData.rainRate.toFixed(1)} mm/h</div>
          </div>
        </div>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Temperature & Dew Point (°C)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={emscData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="extTmp" stroke="#ef4444" strokeWidth={2} name="Temperature" dot={false} />
              <Line type="monotone" dataKey="dewPoint" stroke="#3b82f6" strokeWidth={2} name="Dew Point" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">Humidity (%)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={emscData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="extUmdy" stroke="#3b82f6" strokeWidth={2} name="Humidity" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">Pressure (hPa)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={emscData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="baromtr" stroke="#f59e0b" strokeWidth={2} name="Pressure" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">Wind Speed & Average (km/h)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={emscData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="windSpd" stroke="#10b981" strokeWidth={2} name="Wind Speed" dot={false} />
              <Line type="monotone" dataKey="wnd10Avg" stroke="#8b5cf6" strokeWidth={2} name="10min Avg" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">Rain Rate & Daily Total (mm)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={emscData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="rainRate" stroke="#06b6d4" strokeWidth={2} name="Rain Rate" dot={false} />
              <Line type="monotone" dataKey="rainDaily" stroke="#f59e0b" strokeWidth={2} name="Daily Total" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};