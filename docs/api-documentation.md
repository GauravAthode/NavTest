# VoltPath API Documentation

## Base URL

http://localhost:4500/api

---

## 1. Plan Trip

### Endpoint

POST /trips/plan

---

### Description

Generates an optimized EV trip plan including:

- Route distance
- Driving time
- Charging stops
- Charging time
- Energy consumption
- Trip cost
- SoC curve

---

### Request Body

```json
{
  "start": "Bhopal",
  "destination": "Indore",
  "vehicle": {
    "batteryCapacityKwh": 40,
    "efficiencyKmPerKwh": 6.5,
    "usableBatteryPercent": 90,
    "minimumReserveSocPercent": 15
  },
  "pricing": {
    "electricityRatePerKwh": 10
  }
}
```

---

### Request Parameters

| Field | Type | Description |
|------|------|------------|
| start | string | Starting location |
| destination | string | Ending location |
| batteryCapacityKwh | number | Total battery capacity |
| efficiencyKmPerKwh | number | Vehicle efficiency |
| usableBatteryPercent | number | Usable battery percentage |
| minimumReserveSocPercent | number | Minimum reserve battery |
| electricityRatePerKwh | number | Electricity cost per kWh |

---

### Response

```json
{
  "ok": true,
  "route": {
    "distanceKm": 190,
    "durationSec": 10800,
    "geometry": {
      "type": "LineString",
      "coordinates": []
    }
  },
  "simulation": {
    "totalEnergyKwh": 29.23,
    "drivingTimeHours": 3,
    "chargingTimeHours": 0.5,
    "tripCost": 292.3,
    "socSeries": [90, 70, 50, 80],
    "stops": [
      {
        "name": "VoltPath Station Ashta",
        "arrivalSoc": 50,
        "targetSoc": 80,
        "energyAddedKwh": 12,
        "chargingTimeMin": 15,
        "cost": 120
      }
    ]
  }
}
```

---

## 2. Save Trip

### Endpoint

POST /trips

---

### Description

Stores planned trip in MongoDB.

---

### Request Body

```json
{
  "start": "Bhopal",
  "destination": "Indore",
  "route": {},
  "simulation": {}
}
```

---

### Response

```json
{
  "ok": true,
  "tripId": "65ffac..."
}
```

---

## 3. Get All Trips

### Endpoint

GET /trips

---

### Description

Returns latest trip plans.

---

### Response

```json
{
  "ok": true,
  "trips": []
}
```

---

## 4. Get Trip by ID

### Endpoint

GET /trips/:id

---

### Description

Fetches stored trip details.

---

### Response

```json
{
  "ok": true,
  "trip": {}
}
```

---

## External APIs Used

| API | Purpose |
|-----|--------|
| Nominatim | Address to Coordinates |
| OSRM | Route Distance & Geometry |

---

## Simulation Logic

### Energy Calculation

Energy Required (kWh) = Distance ÷ Efficiency

---

### Charging Time

Charging Time (hours) = Energy Added ÷ Charger Power

---

### Trip Cost

Trip Cost = Total Energy × Electricity Rate

---

## Output Provided

VoltPath returns:

- Route distance
- Driving time
- Charging stops
- Charging time
- Energy usage
- Trip cost
- Battery SoC curve