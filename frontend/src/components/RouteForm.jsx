import React, { useState } from "react";
import { motion } from "framer-motion";
import { apiClient } from "../config/ApiClient.js";
import { useTrip } from "../context/TripContext.jsx";

const defaultState = {
  start: "Bhopal, Madhya Pradesh",
  destination: "Indore, Madhya Pradesh",
  batteryCapacityKwh: 40,
  efficiencyKmPerKwh: 6.5,
  usableBatteryPercent: 90,
  minimumReserveSocPercent: 15,
  electricityRatePerKwh: 10
};

export default function RouteForm() {
  const [form, setForm] = useState(defaultState);
  const { setPlanResult, isPlanning, setIsPlanning, error, setError } = useTrip();

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setIsPlanning(true);
    setPlanResult(null);

    try {
      const payload = {
        start: String(form.start),
        destination: String(form.destination),
        vehicle: {
          batteryCapacityKwh: Number(form.batteryCapacityKwh),
          efficiencyKmPerKwh: Number(form.efficiencyKmPerKwh),
          usableBatteryPercent: Number(form.usableBatteryPercent),
          minimumReserveSocPercent: Number(form.minimumReserveSocPercent)
        },
        pricing: { electricityRatePerKwh: Number(form.electricityRatePerKwh) }
      };

      const { data } = await apiClient.post("/trips/plan", payload);
      if (!data.ok) throw new Error("Planning failed");
      setPlanResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setIsPlanning(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Start Location" name="start" value={form.start} onChange={onChange} />
        <Input label="Destination" name="destination" value={form.destination} onChange={onChange} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Input label="Battery (kWh)" name="batteryCapacityKwh" value={form.batteryCapacityKwh} onChange={onChange} type="number" />
        <Input label="Efficiency (km/kWh)" name="efficiencyKmPerKwh" value={form.efficiencyKmPerKwh} onChange={onChange} type="number" step="0.1" />
        <Input label="Usable %" name="usableBatteryPercent" value={form.usableBatteryPercent} onChange={onChange} type="number" />
        <Input label="Reserve SoC %" name="minimumReserveSocPercent" value={form.minimumReserveSocPercent} onChange={onChange} type="number" />
        <Input label="Rate (₹/kWh)" name="electricityRatePerKwh" value={form.electricityRatePerKwh} onChange={onChange} type="number" />
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {String(error)}
        </div>
      ) : null}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        disabled={isPlanning}
        className="w-full rounded-2xl py-3 font-semibold bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-400 text-slate-950 shadow-glow disabled:opacity-60"
      >
        {isPlanning ? "Planning…" : "Generate Optimized Route"}
      </motion.button>

      <div className="text-xs text-slate-400">
        Uses deterministic simulation (Part 1): Route → Segment → Simulate → Charge → Recalculate → Optimize → Visualize.
      </div>
    </form>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-400">{label}</div>
      <input
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm outline-none focus:border-fuchsia-400/50"
      />
    </div>
  );
}