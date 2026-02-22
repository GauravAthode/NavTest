import React, { createContext, useContext, useMemo, useState } from "react";

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [planResult, setPlanResult] = useState(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [error, setError] = useState("");

  const value = useMemo(
    () => ({ planResult, setPlanResult, isPlanning, setIsPlanning, error, setError }),
    [planResult, isPlanning, error]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}