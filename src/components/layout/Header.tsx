import { Badge } from "@/components/ui/badge";
import { Clock, Users, Eye, Sun, Moon, AlertTriangle, Telescope, Box, CircleCheck } from "lucide-react";
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
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-primary tracking-wider">ASTRI</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Telescope className="h-3 w-3" />
              6 Active
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Box className="h-3 w-3" />
              0 Blocks
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-status-error" />
              2 Alarms
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <CircleCheck className="h-3 w-3 text-status-online" />
              92% Quality
            </Badge>
            <Badge variant="outline" className="text-xs">
              🌡️ 18°C
            </Badge>
            <Badge variant="outline" className="text-xs">
              💧 65%
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge className="bg-status-online">CCS CONNECTED</Badge>
          <Badge className="bg-status-online">STARTUP CONNECTED</Badge>
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
