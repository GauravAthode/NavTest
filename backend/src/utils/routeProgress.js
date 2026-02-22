import { haversineKm } from "./haversine.js";

export function buildCumulativeKm(coordinatesLngLat) {
  const coords = coordinatesLngLat.map(([lng, lat]) => ({ lat, lng }));
  const cumulative = [0];

  for (let i = 1; i < coords.length; i++) {
    cumulative[i] = cumulative[i - 1] + haversineKm(coords[i - 1], coords[i]);
  }
  return { coords, cumulative };
}

export function nearestRouteIndex(coords, point) {
  let bestIdx = 0;
  let bestDist = Infinity;

  for (let i = 0; i < coords.length; i++) {
    const d = haversineKm(coords[i], point);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}