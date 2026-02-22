import React from "react";
import GlassCard from "./GlassCard.jsx";

export default function SummaryCards({ planResult }) {
  const { route, simulation } = planResult;

  const distance = route.distanceKm;
  const driveH = simulation.drivingTimeHours;
  const chargeH = simulation.chargingTimeHours;
  const totalEnergy = simulation.totalEnergyKwh;
  const cost = simulation.tripCost;

  const cards = [
    { title: "Distance", value: `${distance.toFixed(1)} km`, hint: "Total route length" },
    { title: "Driving Time", value: `${driveH.toFixed(2)} h`, hint: "Base driving duration" },
    { title: "Charging Time", value: `${chargeH.toFixed(2)} h`, hint: "Total charging duration" },
    { title: "Energy Required", value: `${totalEnergy.toFixed(2)} kWh`, hint: "Distance ÷ Efficiency" },
    { title: "Trip Cost", value: `₹${Number(cost).toFixed(2)}`, hint: "Energy × Rate" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <GlassCard key={c.title} className="p-4">
          <div className="text-xs text-slate-400">{c.title}</div>
          <div className="mt-1 text-xl font-semibold">{c.value}</div>
          <div className="mt-1 text-xs text-slate-500">{c.hint}</div>
        </GlassCard>
      ))}
    </div>
  );
}