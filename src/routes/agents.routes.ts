import { Router } from "express";
import {
  createAgent,
  deactivateAgent,
  getAgentById,
  getAgents,
  updateAgent,
} from "../controllers/agents.controller";
const router = Router();

router.get("/agents", getAgents);
router.get("/agents/:id", getAgentById);
router.post("/agents", createAgent);
router.put("/agents/:id", updateAgent);
router.delete("/agents/:id", deactivateAgent);

export default router;
