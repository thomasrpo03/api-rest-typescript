import {Router} from "express";
import {validateToken} from "../middlewares/validate.token";
import {
    createAppointment, deactivateAppointment,
    getAppointmentById,
    getAppointments,
    updateAppointment
} from "../controllers/appointments.controller";

const router = Router()

router.get("/appointments", validateToken, getAppointments)
router.get("/appointments/:id", validateToken, getAppointmentById)
router.post("/appointments", validateToken, createAppointment)
router.put("/appointments/:id", validateToken, updateAppointment)
router.delete("/appointments/:id", validateToken, deactivateAppointment)


export default router;