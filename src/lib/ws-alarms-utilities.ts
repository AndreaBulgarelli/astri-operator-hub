import { toast } from "@/hooks/use-toast";

const WS_URL = (import.meta as any).env?.VITE_WEBHOOK_WS_URL || "ws://localhost:8089/ws";
let ws: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout;

export type AlarmEvent = {
    sourceTimestamp?: number;
    alarmId?: string;
    faultFamily?: string;
    faultMember?: string;
    faultCode?: number;
    acsAlarmState?: string;
    alarmSystemState?: string;
    alarmPriority?: string;
    problemDescription?: string;
    cause?: string | null;
    consequence?: string | null;
    actionRequired?: string | null;
    helpUrl?: string | null;
    sourceName?: string;
    systemName?: string | null;
    _topic?: string;
    [key: string]: any;
};

export function setWS(onMessage?: (alarmMessages: AlarmEvent[]) => void, 
                        onConnected?: (state: boolean) => void,
                        onError?: (err) => void, 
                        onClose?: () => void,) {
    try {
        console.log("Connecting to WebSocket:", WS_URL);
        ws = new WebSocket(WS_URL);
        
        ws.onopen = () => {
            console.log("WebSocket connected");
            onConnected && onConnected(true);
            onError && onError(null);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const messages = Array.isArray(data) ? data : [data];
                
                // Filter only alarm messages (from alarm-channel topic)
                const alarmMessages = messages.filter((msg: AlarmEvent) => 
                    msg._topic === "alarm-channel" || 
                    (msg.alarmId && msg.faultCode !== undefined)
                );
            
                if (alarmMessages.length > 0 && onMessage) {
                    onMessage && onMessage(alarmMessages);
                    toast({
                        title: `Alarm${alarmMessages.length !== 1 ? "s" : ""} received`,
                        description: `Alarm received: ${alarmMessages.length} new alarm(s)`,
                    });
                }
            } catch (e) {
                console.error("Error parsing WebSocket message:", e);
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            onError && onError(err);
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
            onClose && onClose();
            // Reconnect after 3 seconds
            reconnectTimeout = setTimeout(() => setWS(onMessage, onConnected, onError, onClose), 3000);
        };

        return ws;
    } catch (err) {
        console.error("Failed to connect to WebSocket:", err);
        onError && onError(err);
        onConnected && onConnected(false);
        reconnectTimeout = setTimeout(() => setWS(onMessage, onConnected, onError, onClose), 3000);
    }
};
