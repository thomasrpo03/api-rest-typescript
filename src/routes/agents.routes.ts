import { Router } from "express";
import { createAgent, getAgents } from "../controllers/agents.controller";
const router = Router();

router.route("/agents")
    .get(getAgents)
    .post(createAgent)

export default router