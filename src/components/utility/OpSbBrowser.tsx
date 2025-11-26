import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCw } from "lucide-react";

type OP = {
  observing_plan_id: string;
  name?: string | null;
  validity_start?: string | null;
  validity_end?: string | null;
  sb_ids?: string[] | null;
};

type SB = {
  sb_id: string;
  name?: string | null;
  content?: any;
};

const BASE = (import.meta as any).env?.VITE_OPAPI_BASE_URL || "http://localhost:8090";

export const OpSbBrowser = () => {
  const [ops, setOps] = useState<OP[] | null>(null);
  const [sbs, setSbs] = useState<SB[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOP, setSelectedOP] = useState<OP | null>(null);
  const [selectedSB, setSelectedSB] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filteredOps = useMemo(() => (ops || []).filter(o => {
    const txt = (o.name || o.observing_plan_id || "").toLowerCase();
    return !q || txt.includes(q.toLowerCase());
  }), [ops, q]);
  
  // Filter SBs: if an OP is selected, show only its associated SBs; otherwise show none
  const filteredSbs = useMemo(() => {
    // If no OP is selected, don't show any SBs
    if (!selectedOP) {
      return [];
    }
    
    // If no SBs are loaded yet, return empty array
    if (!sbs || sbs.length === 0) {
      return [];
    }
    
    // Filter by the selected OP's sb_ids
    // Match only by sb_id (not by name)
    if (selectedOP.sb_ids && selectedOP.sb_ids.length > 0) {
      // Create a Set of matching SB identifiers for faster lookup
      const matchingIds = new Set(selectedOP.sb_ids);
      
      // Filter SBs that match any of the OP's sb_ids (by sb_id only)
      const filtered = sbs.filter(s => {
        // Check if this SB's sb_id matches any of the OP's sb_ids
        return matchingIds.has(s.sb_id);
      });
      
      // Apply search filter if query is present
      if (q) {
        const query = q.toLowerCase();
        return filtered.filter(s => {
          const txt = (s.name || s.sb_id || "").toLowerCase();
          return txt.includes(query);
        });
      }
      
      return filtered;
    } else {
      // If OP has no sb_ids, show empty list
      return [];
    }
  }, [sbs, selectedOP, q]);

  async function fetchAll() {
    setLoading(true); setError(null);
    try {
      const [opsRes, sbsRes] = await Promise.all([
        fetch(`${BASE}/api/op`),
        fetch(`${BASE}/api/sb`),
      ]);
      if (!opsRes.ok) throw new Error(`OP ${opsRes.status}`);
      if (!sbsRes.ok) throw new Error(`SB ${sbsRes.status}`);
      setOps(await opsRes.json());
      setSbs(await sbsRes.json());
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  async function showOP(id: string) {
    setSelectedSB(null); // Reset SB selection when OP changes
    
    try {
      const res = await fetch(`${BASE}/api/op/${id}`);
      if (res.ok) {
        const data = await res.json();
        const key = `op#${id}`;
        sessionStorage.setItem(key, JSON.stringify(data));
        
        // Update selectedOP with full data from API (includes sb_ids)
        setSelectedOP(data);
        
        // Automatically load and show the first SB if available
        if (data.sb_ids && data.sb_ids.length > 0 && sbs) {
          const firstSBId = data.sb_ids[0];
          // Find the SB by matching sb_id only
          const matchingSB = sbs.find(s => s.sb_id === firstSBId);
          if (matchingSB) {
            await showSB(matchingSB.sb_id);
          }
        }
      }
    } catch {}
  }
  
  async function showSB(id: string) {
    setSelectedSB(id);
    try {
      const res = await fetch(`${BASE}/api/sb/${id}`);
      if (res.ok) {
        const data = await res.json();
        const key = `sb#${id}`;
        sessionStorage.setItem(key, JSON.stringify(data));
      }
    } catch {}
  }

  function renderOPDetails() {
    if (!selectedOP) {
      return null;
    }
    const key = `op#${selectedOP.observing_plan_id}`;
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return <div className="text-muted-foreground text-sm p-2">Loading OP details…</div>;
    }
    try {
      const obj = JSON.parse(raw);
      return (
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs font-semibold mb-2 text-muted-foreground">OP Details</div>
          <pre className="text-xs leading-4 overflow-auto max-h-[40vh] bg-muted p-2 rounded">
            {JSON.stringify(obj, null, 2)}
          </pre>
        </div>
      );
    } catch {
      return <div className="text-sm text-destructive p-2">Error parsing OP details.</div>;
    }
  }

  function renderSBDetail() {
    if (!selectedSB) {
      return <div className="text-muted-foreground">Select a Scheduling Block to view details…</div>;
    }
    const key = `sb#${selectedSB}`;
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return <div className="text-muted-foreground">Loading SB details…</div>;
    }
    try {
      const obj = JSON.parse(raw);
      return <pre className="text-xs leading-5 overflow-auto max-h-[60vh]">{JSON.stringify(obj, null, 2)}</pre>;
    } catch {
      return <div>Error parsing SB details.</div>;
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-12 flex items-center gap-2">
        <Input placeholder="Search OP/SB…" value={q} onChange={e => setQ(e.target.value)} />
        <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading} title="Refresh">
          <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        </Button>
        <div className="text-xs text-muted-foreground ml-auto">
          Observing Plan API: <code>{BASE}</code>
        </div>
      </div>

      <Card className="col-span-4 p-3 flex flex-col min-h-[60vh]">
        <div className="font-semibold mb-2">Observing Plans</div>
        <ScrollArea className="flex-1">
          {!ops && !error && <div className="p-3 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>}
          {error && <div className="p-3 text-sm text-destructive">Error: {error}</div>}
          {filteredOps.map(op => (
            <button key={op.observing_plan_id}
              onClick={() => showOP(op.observing_plan_id)}
              className={"w-full text-left px-2 py-2 rounded hover:bg-muted " + (selectedOP?.observing_plan_id === op.observing_plan_id ? "bg-muted" : "")}>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">OP</Badge>
                <div className="flex-1">
                  <div className="text-sm font-medium">{op.name || op.observing_plan_id}</div>
                  <div className="text-[10px] text-muted-foreground">{op.observing_plan_id}</div>
                  {op.sb_ids && op.sb_ids.length > 0 && (
                    <div className="text-[10px] text-muted-foreground mt-1">{op.sb_ids.length} SB</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </ScrollArea>
        {renderOPDetails()}
      </Card>

      <Card className="col-span-4 p-3 flex flex-col min-h-[60vh]">
        <div className="font-semibold mb-2">
          Scheduling Blocks
          {selectedOP && (
            <span className="text-xs text-muted-foreground ml-2">
              ({filteredSbs.length} of {selectedOP.sb_ids?.length || 0})
            </span>
          )}
        </div>
        <ScrollArea className="flex-1">
          {!sbs && !error && <div className="p-3 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>}
          {error && <div className="p-3 text-sm text-destructive">Error: {error}</div>}
          {selectedOP && filteredSbs.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              No Scheduling Blocks associated with this OP
            </div>
          )}
          {!selectedOP && (
            <div className="p-3 text-sm text-muted-foreground">
              Select an Observing Plan to see its Scheduling Blocks
            </div>
          )}
          {filteredSbs.map((sb, index) => (
            <button key={`${sb.sb_id}-${index}`}
              onClick={() => showSB(sb.sb_id)}
              className={"w-full text-left px-2 py-2 rounded hover:bg-muted " + (selectedSB === sb.sb_id ? "bg-muted" : "")}>
              <div className="flex items-center gap-2">
                <Badge>SB</Badge>
                <div className="flex-1">
                  <div className="text-sm font-medium">{sb.name || sb.sb_id}</div>
                  <div className="text-[10px] text-muted-foreground">{sb.sb_id}</div>
                </div>
              </div>
            </button>
          ))}
        </ScrollArea>
      </Card>

      <Card className="col-span-4 p-3">
        <div className="font-semibold mb-2">Details</div>
        <Separator className="mb-2" />
        <div className="min-h-[60vh]">{renderSBDetail()}</div>
      </Card>
    </div>
  );
};
