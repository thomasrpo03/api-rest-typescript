import {Router} from "express";
import {
    createClient, deactivateClient,
    getClientById,
    getClients,
    updateClient,
} from "../controllers/clients.controller";

const router = Router();

router.get("/clients", getClients);
router.get("/clients/:id", getClientById);
router.post("/clients", createClient);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deactivateClient);

export default router;
