import React from "react";
import GlassCard from "./GlassCard.jsx";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function SocChart({ planResult }) {
  const series = planResult.simulation.socSeries || [];
  const data = series.map((soc, i) => ({ point: i + 1, soc }));

  return (
    <GlassCard>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold">SoC Curve</div>
          <div className="text-xs text-slate-400">Segment-level remaining battery simulation</div>
        </div>
        <div className="text-xs text-slate-500">SoC (%)</div>
      </div>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
            <XAxis dataKey="point" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Line type="monotone" dataKey="soc" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}