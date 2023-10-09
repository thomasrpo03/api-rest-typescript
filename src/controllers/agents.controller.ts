import {Request, Response} from "express";
import {RowDataPacket} from "mysql2";
import {connect} from "../database";
import {agentSchema} from "../schemas";
import {Agent} from "../interfaces/agent.interface";

//List All Agents
export async function getAgents(
    req: Request,
    res: Response
): Promise<Response> {
    try {
        const conn = await connect();
        const [rows] = await conn.query<RowDataPacket[]>(
            "SELECT id, name, phone, email, created_at FROM agents WHERE active = TRUE;"
        );

        if (rows.length === 0) {
            return res.status(404).json({message: "No agents found"});
        }

        return res.json(rows);
    } catch (error) {
        console.error("Error fetching agents:", error);
        return res.status(500).json({message: "Error fetching agents"});
    }
}

//List Agent by ID
export async function getAgentById(req: Request, res: Response) {
    const agentId = req.params.id;
    try {
        const conn = await connect();
        const [rows] = await conn.query<RowDataPacket[]>(
            "SELECT id, name, phone, email, created_at from agents WHERE id = ? AND active = TRUE",
            [agentId]
        );

        if (rows.length === 0) {
            return res.status(404).json({message: "Agent not found"});
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching agent:", error);
        return res.status(500).json({message: "Error fetching agent"});
    }
}

//Create Agent
export async function createAgent(req: Request, res: Response) {
    const newAgent: Agent = req.body;

    const {error} = agentSchema.validate(newAgent);

    if (error) {
        return res.status(400).json({message: error.details[0].message});
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
        return res.status(500).json({message: "Error creating agent"});
    }
}

//Update Agent
export async function updateAgent(req: Request, res: Response) {
    const agentId = req.params.id;
    const updatedAgentData: Agent = req.body;

    const {error} = agentSchema.validate(updatedAgentData);

    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

    try {
        const conn = await connect();

        const [existingAgent] = await conn.query<RowDataPacket[]>(
            "SELECT * FROM AGENTS WHERE id = ?",
            [agentId]
        );

        if (existingAgent.length === 0) {
            return res.status(404).json({message: "Agent not found"});
        }

        await conn.query("UPDATE AGENTS SET ? WHERE id = ?", [
            updatedAgentData,
            agentId,
        ]);

        return res.json({message: "Agent updated", agentId: updatedAgentData});
    } catch (error) {
        console.error("Error updating agent:", error);
        return res.status(500).json({message: "Error updating agent"});
    }
}

//Delete Agent
export async function deactivateAgent(req: Request, res: Response) {
    const agentId = req.params.id;

    try {
        const conn = await connect();
        const [existingAgent] = await conn.query<RowDataPacket[]>(
            "SELECT * FROM AGENTS WHERE id = ?",
            [agentId]
        );

        if (existingAgent.length === 0) {
            return res.status(404).json({message: "Agent not found"});
        }

        await conn.query("UPDATE AGENTS SET active = FALSE WHERE id = ?", [
            agentId,
        ]);

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({message: "Error deactivating agent"});
    }
}
