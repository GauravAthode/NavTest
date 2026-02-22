export async function geocodeAddress(address) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(address);

  const resp = await fetch(url, {
    headers: {
      "User-Agent": "VoltPathHackathon/1.0"
    }
  });

  if (!resp.ok) throw new Error("Geocoding failed");

  const data = await resp.json();
  if (!data?.length) throw new Error("Address not found: " + address);

  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

export async function fetchRoute(start, end) {
  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    `${start.lng},${start.lat};${end.lng},${end.lat}` +
    "?overview=full&geometries=geojson";

  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Routing failed");

  const json = await resp.json();
  const route = json?.routes?.[0];
  if (!route) throw new Error("No route found");

  return {
    distanceKm: route.distance / 1000,
    durationSec: route.duration,
    coordinatesLngLat: route.geometry.coordinates 
  };
}