import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-primary tracking-wider">ASTRI</div>
        <Badge variant="outline" className="text-xs">v1.3.0</Badge>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-mono">
            {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
          </span>
        </div>
        <Badge className="bg-status-online">CCS CONNECTED</Badge>
      </div>
    </header>
  );
};
