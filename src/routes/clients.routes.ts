import {Router} from "express";
import {
    createClient, deactivateClient,
    getClientById,
    getClients,
    updateClient,
} from "../controllers/clients.controller";
import {validateToken} from "../middlewares/validate.token";

const router = Router();

router.get("/clients", validateToken, getClients);
router.get("/clients/:id", validateToken, getClientById);
router.post("/clients", validateToken, createClient);
router.put("/clients/:id", validateToken, updateClient);
router.delete("/clients/:id", validateToken, deactivateClient);

export default router;
