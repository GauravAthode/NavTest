import { Router } from "express";
import { planTrip, saveTrip, listTrips, getTrip } from "../controllers/tripController.js";

const router = Router();

router.post("/plan", planTrip);
router.post("/", saveTrip);
router.get("/", listTrips);
router.get("/:id", getTrip);

export default router;