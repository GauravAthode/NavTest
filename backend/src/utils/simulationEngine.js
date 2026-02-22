import { buildCumulativeKm, nearestRouteIndex } from "./routeProgress.js";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function simulateTripPlan({
  coordinatesLngLat,
  distanceKm,
  durationSec,
  stations,
  vehicle,
  electricityRatePerKwh,
  safetyFactor,
  targetSocDefault,
  chargingPowerFallback
}) {
  const {
    batteryCapacityKwh,
    efficiencyKmPerKwh,
    usableBatteryPercent,
    minimumReserveSocPercent
  } = vehicle;

  const { coords, cumulative } = buildCumulativeKm(coordinatesLngLat);

  const drivingTimeHours = durationSec / 3600;
  const totalEnergyKwh = distanceKm / efficiencyKmPerKwh;

  const reserveSoc = clamp(minimumReserveSocPercent, 0, usableBatteryPercent);
  const maxUsableSoc = clamp(usableBatteryPercent, 1, 100);
  const targetSoc = clamp(targetSocDefault, reserveSoc + 1, maxUsableSoc);

  let currentSoc = maxUsableSoc;
  let currentIdx = 0;

  const stops = [];
  const socSeries = [];

  const totalRouteKm = cumulative[cumulative.length - 1];

  const kmFromSoc = (soc) => {
    const usableEnergyKwh = (batteryCapacityKwh * (soc - reserveSoc)) / 100;
    const rawKm = usableEnergyKwh * efficiencyKmPerKwh;
    return rawKm * safetyFactor;
  };

  const socDropForKm = (km) => {
    const energyUsed = km / efficiencyKmPerKwh;
    const socDrop = (energyUsed / batteryCapacityKwh) * 100;
    return socDrop;
  };

  while (true) {
    const remainingKm = totalRouteKm - cumulative[currentIdx];
    const reachableKm = kmFromSoc(currentSoc);

    if (reachableKm >= remainingKm) {
      const finalSoc = clamp(currentSoc - socDropForKm(remainingKm), 0, 100);
      socSeries.push(finalSoc);
      break;
    }

    const maxAdvanceKm = reachableKm;
    const maxReachKmOnRoute = cumulative[currentIdx] + maxAdvanceKm;

    const candidateStations = stations
      .map((s) => {
        const sPoint = { lat: s.location.lat, lng: s.location.lng };
        const sIdx = nearestRouteIndex(coords, sPoint);
        const sKm = cumulative[sIdx];
        return { ...s, routeIdx: sIdx, routeKm: sKm };
      })
      .filter((s) => s.routeKm > cumulative[currentIdx] + 1e-6 && s.routeKm <= maxReachKmOnRoute + 1e-6)
      .sort((a, b) => a.routeKm - b.routeKm);

    if (!candidateStations.length) {
      return {
        ok: false,
        error:
          "No charging station found within safe range. Add more stations (seed data) for this route corridor.",
        distanceKm,
        durationSec
      };
    }

    const chosen = candidateStations[0];
    const legKm = chosen.routeKm - cumulative[currentIdx];

    const arrivalSoc = clamp(currentSoc - socDropForKm(legKm), 0, 100);

    const effectiveTargetSoc = clamp(targetSoc, arrivalSoc + 1, maxUsableSoc);
    const energyAddedKwh =
      (batteryCapacityKwh * (effectiveTargetSoc - arrivalSoc)) / 100;

    const powerKw = chosen.powerKw || chargingPowerFallback;
    const chargingTimeHours = energyAddedKwh / powerKw;
    const chargingTimeMin = chargingTimeHours * 60;

    const cost = energyAddedKwh * electricityRatePerKwh;

    stops.push({
      stationId: chosen._id,
      name: chosen.name,
      powerKw: powerKw,
      location: { lat: chosen.location.lat, lng: chosen.location.lng },
      arrivalSoc: Number(arrivalSoc.toFixed(2)),
      targetSoc: Number(effectiveTargetSoc.toFixed(2)),
      energyAddedKwh: Number(energyAddedKwh.toFixed(3)),
      chargingTimeMin: Number(chargingTimeMin.toFixed(1)),
      cost: Number(cost.toFixed(2))
    });

    socSeries.push(Number(arrivalSoc.toFixed(2)));

    currentIdx = chosen.routeIdx;
    currentSoc = effectiveTargetSoc;

    if (stops.length > 20) {
      return { ok: false, error: "Too many stops (route/stations mismatch).", distanceKm, durationSec };
    }
  }

  const totalChargingTimeHours =
    stops.reduce((sum, s) => sum + s.chargingTimeMin, 0) / 60;

  const tripCost = (totalEnergyKwh * electricityRatePerKwh).toFixed(2);

  return {
    ok: true,
    route: {
      distanceKm: Number(distanceKm.toFixed(2)),
      durationSec: Math.round(durationSec),
      geometry: { type: "LineString", coordinates: coordinatesLngLat }
    },
    simulation: {
      totalEnergyKwh: Number(totalEnergyKwh.toFixed(3)),
      drivingTimeHours: Number(drivingTimeHours.toFixed(2)),
      chargingTimeHours: Number(totalChargingTimeHours.toFixed(2)),
      tripCost: Number(tripCost),
      socSeries,
      stops
    }
  };
}