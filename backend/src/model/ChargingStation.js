import mongoose from "mongoose";

const chargingStationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    powerKw: { type: Number, required: true, min: 1 },
    provider: { type: String, default: "Public" },
  },
  { timestamps: true },
);

chargingStationSchema.index({ location: "2dsphere" });

export const ChargingStation = mongoose.model(
  "ChargingStation",
  chargingStationSchema,
);
