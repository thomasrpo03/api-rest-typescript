import { Request, Response } from "express";
import { connect } from "../database";
import { Agent } from "../interfaces/Agent.interface";
import { agentSchema } from "../schemas";
import { RowDataPacket } from "mysql2";

export async function getAgents(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const conn = await connect();
    const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM AGENTS");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No agents found" });
    }

    return res.json(rows);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return res.status(500).json({ message: "Error fetching agents" });
  }
}

export async function createAgent(req: Request, res: Response) {
  const newAgent: Agent = req.body;

  const { error } = agentSchema.validate(newAgent);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const conn = await connect();

  try {
    await conn.query("INSERT INTO AGENTS SET ?", [newAgent]);
    return res.json({
      message: "Agent created",
      agent: newAgent,
    });
  } catch (error) {
    console.error("Error creating agent:", error);
    return res.status(500).json({ message: "Error creating agent" });
  }
}
