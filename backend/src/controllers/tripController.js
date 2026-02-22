import { z } from "zod";
import { Trip } from "../model/Trip.js";
import { ChargingStation } from "../model/ChargingStation.js";
import { geocodeAddress, fetchRoute } from "../utils/geoService.js";
import { simulateTripPlan } from "../utils/simulationEngine.js";

const planSchema = z.object({
  start: z.string().min(3),
  destination: z.string().min(3),
  vehicle: z.object({
    batteryCapacityKwh: z.number().positive(),
    efficiencyKmPerKwh: z.number().positive(),
    usableBatteryPercent: z.number().min(1).max(100),
    minimumReserveSocPercent: z.number().min(0).max(100)
  }),
  pricing: z.object({
    electricityRatePerKwh: z.number().positive()
  }).optional()
});

export async function planTrip(req, res) {
  try {
    const parsed = planSchema.parse(req.body);

    const electricityRatePerKwh =
      parsed.pricing?.electricityRatePerKwh ??
      Number(process.env.DEFAULT_ELECTRICITY_RATE || 10);

    const startCoord = await geocodeAddress(parsed.start);
    const endCoord = await geocodeAddress(parsed.destination);

    const route = await fetchRoute(startCoord, endCoord);

    const stationsRaw = await ChargingStation.find().lean();
    const stations = stationsRaw.map((s) => ({
      ...s,
      location: {
        lat: s.location.coordinates[1],
        lng: s.location.coordinates[0]
      }
    }));

    const result = simulateTripPlan({
      coordinatesLngLat: route.coordinatesLngLat,
      distanceKm: route.distanceKm,
      durationSec: route.durationSec,
      stations,
      vehicle: parsed.vehicle,
      electricityRatePerKwh,
      safetyFactor: Number(process.env.DEFAULT_SAFETY_FACTOR || 0.85),
      targetSocDefault: Number(process.env.DEFAULT_TARGET_SOC || 80),
      chargingPowerFallback: Number(process.env.DEFAULT_CHARGING_POWER_KW || 60)
    });

    if (!result.ok) {
      return res.status(422).json({ ok: false, error: result.error });
    }

    return res.json({
      ok: true,
      input: {
        start: parsed.start,
        destination: parsed.destination,
        vehicle: parsed.vehicle,
        pricing: { electricityRatePerKwh }
      },
      route: result.route,
      simulation: result.simulation
    });
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ ok: false, error: err.errors });
    }
    return res.status(500).json({ ok: false, error: err.message });
  }
}

export async function saveTrip(req, res) {
  try {
    const payload = req.body;
    const doc = await Trip.create(payload);
    res.status(201).json({ ok: true, tripId: doc._id });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
}

export async function listTrips(req, res) {
  const trips = await Trip.find().sort({ createdAt: -1 }).limit(20).lean();
  res.json({ ok: true, trips });
}

export async function getTrip(req, res) {
  const trip = await Trip.findById(req.params.id).lean();
  if (!trip) return res.status(404).json({ ok: false, error: "Trip not found" });
  res.json({ ok: true, trip });
}