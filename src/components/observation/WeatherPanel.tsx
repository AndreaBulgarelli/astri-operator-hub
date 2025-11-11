import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Maximize2, ExternalLink } from "lucide-react";

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

export const WeatherPanel = ({ showControls = true }: { showControls?: boolean }) => {
  const [weatherData, setWeatherData] = useState(generateWeatherData());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(prev => {
        const lastPoint = prev[prev.length - 1];
        const baseValues = [lastPoint.temperature, lastPoint.humidity, lastPoint.windSpeed, lastPoint.pressure];
        return generateWeatherData(20, baseValues);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
    const newWindow = window.open('', 'Weather Panel', 'width=1000,height=800');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Weather Panel</title>
            <style>
              body { margin: 0; padding: 20px; background: #0a0a0a; color: #fff; font-family: system-ui; }
              .content { max-width: 1200px; margin: 0 auto; }
              h2 { color: #8b5cf6; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="content">
              <h2>Weather Monitoring</h2>
              <p>Real-time weather data displayed in detached window.</p>
              <p>Temperature: ${weatherData[weatherData.length - 1].temperature.toFixed(1)}°C</p>
              <p>Humidity: ${weatherData[weatherData.length - 1].humidity.toFixed(1)}%</p>
              <p>Wind Speed: ${weatherData[weatherData.length - 1].windSpeed.toFixed(1)} km/h</p>
              <p>Pressure: ${weatherData[weatherData.length - 1].pressure.toFixed(1)} hPa</p>
            </div>
          </body>
        </html>
      `);
    }
  };

  return (
    <Card className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Weather Monitoring</h3>
        {showControls && (
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
        )}
      </div>

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
    </Card>
  );
};