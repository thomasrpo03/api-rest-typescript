import { Request, Response } from "express";
import { connect } from "../database";
import { Agent } from "../interfaces/Agent.interface";

export async function getAgents(
  req: Request,
  res: Response
): Promise<Response> {
  const conn = await connect();
  const agents = await conn.query("SELECT * FROM AGENTS");
  return res.json(agents[0]);
}

export async function createAgent(req: Request, res: Response) {
  const newAgent: Agent = req.body;
  const conn = await connect();
  await conn.query("INSERT INTO AGENTS SET ?", [newAgent]);
  return res.json({
    message: "Agent created",
    agent: newAgent,
  });
}
