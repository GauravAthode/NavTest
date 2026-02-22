import React from "react";
import Navbar from "../components/Navbar.jsx";
import GlassCard from "../components/GlassCard.jsx";
import RouteForm from "../components/RouteForm.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import MapView from "../components/MapView.jsx";
import SocChart from "../components/SocChart.jsx";
import StopsTable from "../components/StopsTable.jsx";
import { useTrip } from "../context/TripContext.jsx";

export default function HomePage() {
  const { planResult } = useTrip();

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <GlassCard className="lg:col-span-2">
            <div className="text-sm font-semibold">Trip Inputs</div>
            <div className="text-xs text-slate-400">
              Enter route + vehicle parameters to generate optimized charging plan.
            </div>
            <div className="mt-5">
              <RouteForm />
            </div>
          </GlassCard>

          <div className="lg:col-span-3 space-y-6">
            {planResult ? (
              <>
                <SummaryCards planResult={planResult} />
                <MapView planResult={planResult} />
              </>
            ) : (
              <GlassCard className="h-[520px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-semibold">
                    Premium EV trip planning dashboard
                  </div>
                  <div className="mt-2 text-sm text-slate-400">
                    Generate a plan to view route map, SoC curve, stops, time and cost.
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </div>

        {planResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SocChart planResult={planResult} />
            <StopsTable planResult={planResult} />
          </div>
        ) : null}

        <div className="text-xs text-slate-500">
          VoltPath Part 1 (Core Engine) — route geometry, segment SoC simulation, charging stop placement, time & cost estimates, and full map visualization.
        </div>
      </div>
    </div>
  );
}