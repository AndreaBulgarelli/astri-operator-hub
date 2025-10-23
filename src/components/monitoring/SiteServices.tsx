import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Network, 
  Clock, 
  Database, 
  HardDrive, 
  Container, 
  Zap,
  Wifi,
  Eye,
  Cloud
} from "lucide-react";

interface SiteServicesProps {
  onSelectService: (service: string) => void;
  selectedService: string | null;
}

const services = [
  { id: "WS1", name: "Weather Station 1", icon: Cloud, status: "online" },
  { id: "WS2", name: "Weather Station 2", icon: Cloud, status: "online" },
  { id: "PMS", name: "Power Management System", icon: Zap, status: "online" },
  { id: "NET", name: "Network System", icon: Network, status: "online" },
  { id: "TIM", name: "Timing System", icon: Clock, status: "online" },
  { id: "SRV", name: "Servers", icon: Server, status: "online" },
  { id: "VM", name: "Virtual Machines", icon: Database, status: "online" },
  { id: "CNT", name: "Containers", icon: Container, status: "online" },
  { id: "SCADA", name: "SCADA", icon: HardDrive, status: "online" },
  { id: "STARTUP", name: "Startup System", icon: Zap, status: "online" },
  { id: "TSC", name: "Telescope Service Cabinets", icon: HardDrive, status: "online" },
  { id: "OFFSITE", name: "Off-site Connection", icon: Wifi, status: "online" },
  { id: "LIDAR", name: "LIDAR", icon: Eye, status: "online" },
  { id: "SQM", name: "SQMs", icon: Eye, status: "online" },
  { id: "UVSIPM", name: "UVSiPM", icon: Eye, status: "online" },
];

export const SiteServices = ({ onSelectService, selectedService }: SiteServicesProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {services.map((service) => {
        const Icon = service.icon;
        return (
          <button
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className={cn(
              "p-3 rounded-lg border transition-all duration-200",
              "flex flex-col items-center gap-2 hover:scale-105",
              selectedService === service.id
                ? "bg-primary/20 border-primary ring-2 ring-primary"
                : "bg-secondary/50 border-border hover:bg-secondary"
            )}
          >
            <Icon className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium text-center">{service.name}</span>
            <Badge 
              className={cn(
                "text-[10px] px-2 py-0",
                service.status === "online" ? "bg-status-online" : "bg-status-offline"
              )}
            >
              {service.status}
            </Badge>
          </button>
        );
      })}
    </div>
  );
};
