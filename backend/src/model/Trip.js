import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    start: { type: String, required: true },
    destination: { type: String, required: true },

    vehicle: {
      batteryCapacityKwh: { type: Number, required: true },
      efficiencyKmPerKwh: { type: Number, required: true },
      usableBatteryPercent: { type: Number, required: true },
      minimumReserveSocPercent: { type: Number, required: true }
    },

    pricing: {
      electricityRatePerKwh: { type: Number, required: true }
    },

    route: {
      distanceKm: Number,
      durationSec: Number,
      geometry: {
        type: { type: String, enum: ["LineString"], default: "LineString" },
        coordinates: { type: [[Number]], default: [] } 
      }
    },

    simulation: {
      totalEnergyKwh: Number,
      drivingTimeHours: Number,
      chargingTimeHours: Number,
      tripCost: Number,
      socSeries: { type: [Number], default: [] }, 
      stops: {
        type: [
          {
            stationId: { type: mongoose.Schema.Types.ObjectId, ref: "ChargingStation" },
            name: String,
            powerKw: Number,
            location: { lat: Number, lng: Number },
            arrivalSoc: Number,
            targetSoc: Number,
            energyAddedKwh: Number,
            chargingTimeMin: Number,
            cost: Number
          }
        ],
        default: []
      }
    }
  },
  { timestamps: true }
);

export const Trip = mongoose.model("Trip", tripSchema);