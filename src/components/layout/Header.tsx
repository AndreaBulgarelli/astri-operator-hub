import { Badge } from "@/components/ui/badge";
import { Clock, Users, Eye, Sun, Moon, AlertTriangle, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";

export const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, setTheme } = useTheme();
  const [operatorMode, setOperatorMode] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUTCTime = (date: Date) => {
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds} UTC`;
  };

  const formatLastUpdate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  return (
    <header className="bg-card border-b border-border">
      {/* Top Bar */}
      <div className="bg-secondary/50 border-b border-border px-6 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">ASTRI Operator HMI</h1>
          <p className="text-xs text-muted-foreground">Mini-Array Telescope Control & Monitoring System</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={operatorMode ? "default" : "outline"}
            size="sm"
            onClick={() => setOperatorMode(true)}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Operator Mode
          </Button>
          
          <Button
            variant={!operatorMode ? "default" : "outline"}
            size="sm"
            onClick={() => setOperatorMode(false)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View Mode
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="gap-2"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="flex items-center gap-2 text-sm font-mono">
            <Clock className="h-4 w-4" />
            <span>{formatUTCTime(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-6 py-2 flex items-center justify-between border-t border-border">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Canary Islands, 20.1 °C</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            <span className="font-medium">Wind velocity, 13.6 Km/h</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Last update: {formatLastUpdate(currentTime)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge className="bg-status-online">CCS CONNECTED</Badge>
          <Badge className="bg-status-online">STARTUP CONNECTED</Badge>
          <Badge className="bg-status-online">OFF-SITE CONNECTED</Badge>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              toast({
                title: "SAFE MODE ACTIVATED",
                description: "All systems transitioning to safe mode...",
                variant: "destructive",
              });
            }}
            className="gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            SAFE MODE
          </Button>
        </div>
      </div>
    </header>
  );
};
