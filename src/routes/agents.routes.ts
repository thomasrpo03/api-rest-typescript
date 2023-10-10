import {Router} from "express";
import {
    createAgent,
    deactivateAgent,
    getAgentById,
    getAgents,
    updateAgent,
} from "../controllers/agents.controller";
import {validateToken} from "../middlewares/validate.token";

const router = Router();

router.get("/agents", validateToken, getAgents);
router.get("/agents/:id", validateToken, getAgentById);
router.post("/agents", validateToken, createAgent);
router.put("/agents/:id", validateToken, updateAgent);
router.delete("/agents/:id", validateToken, deactivateAgent);

export default router;
