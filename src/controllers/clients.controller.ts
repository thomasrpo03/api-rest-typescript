import {Request, Response} from "express";
import {RowDataPacket} from "mysql2";
import {connect} from "../database";
import {clientSchema} from "../schemas";
import {Client} from "../interfaces/client.interface";

//List All Clients
export async function getClients(
    req: Request,
    res: Response
): Promise<Response> {
    try {
        const conn = await connect();
        const [rows] = await conn.query<RowDataPacket[]>(
            "SELECT id, name, phone, email, created_at FROM clients WHERE active = TRUE;"
        );

        if (rows.length === 0) {
            return res.status(404).json({message: "No clients found"});
        }

        return res.json(rows);
    } catch (error) {
        console.error("Error fetching clients:", error);
        return res.status(500).json({message: "Error fetching clients"});
    }
}

//List Client by ID
export async function getClientById(req: Request, res: Response) {
    const clientId = req.params.id;
    try {
        const conn = await connect();
        const [rows] = await conn.query<RowDataPacket[]>(
            "SELECT id, name, phone, email, created_at FROM clients WHERE id = ? AND active = TRUE",
            clientId
        );

        if (rows.length === 0) {
            return res.status(404).json({message: "Client not found"});
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching client", error);
        return res.status(500).json({message: "Error fetching client"});
    }
}

//Create Client
export async function createClient(req: Request, res: Response) {
    const newClient = req.body;

    const {error} = clientSchema.validate(newClient);

    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

    const conn = await connect();

    try {
        await conn.query("INSERT INTO CLIENTS SET ?", [newClient]);
        return res.json({
            message: "Client created",
            client: newClient,
        });
    } catch (error) {
        console.error("Error creating client:", error);
        return res.status(500).json({message: "Error creating client"});
    }
}

//Update Client
export async function updateClient(req: Request, res: Response) {
    const clientId = req.params.id;
    const updatedClientData: Client = req.body;

    const {error} = clientSchema.validate(updatedClientData);

    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

    try {
        const conn = await connect();
        const [existingClient] = await conn.query<RowDataPacket[]>(
            "SELECT * FROM CLIENTS WHERE id = ?",
            [clientId]
        );

        if (existingClient.length === 0) {
            return res.status(404).json({message: "Client not found"});
        }

        await conn.query("UPDATE CLIENTS SET ? WHERE id = ?", [
            updatedClientData,
            clientId,
        ]);

        return res.json({message: "Client updated", client: updatedClientData});
    } catch (error) {
        console.error("Error updating client:", error);
        return res.status(500).json({message: "Error updating client"});
    }
}

//Delete Client
export async function deactivateClient(req: Request, res: Response) {
    const clientId = req.params.id;
    try {
        const conn = await connect();
        const [existingClient] = await conn.query<RowDataPacket[]>(
            "SELECT * FROM CLIENTS WHERE id = ?",
            [clientId]
        )

        if (existingClient.length === 0) {
            return res.status(404).json({message: "Client not found"});
        }

        await conn.query("UPDATE CLIENTS SET active = FALSE WHERE id = ?", [clientId]);

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json({message: "Error deactivating client"});
    }
}
