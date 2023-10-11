import {Request, Response} from "express";
import {RowDataPacket} from "mysql2";
import {connect} from "../database";
import {appointmentSchema} from "../schemas";

export async function getAppointments(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM appointments WHERE active = TRUE");

        if (rows.length === 0) {
            return res.status(404).json({message: "No appointments found"});
        }

        return res.json(rows);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({message: "Error fetching appointments"});
    }
}

export async function getAppointmentById(req: Request, res: Response): Promise<Response> {
    const appointmentId = req.params.id;
    try {
        const conn = await connect();
        const [rows] = await conn.query<RowDataPacket[]>(
            "SELECT * from appointments WHERE id = ? AND active = TRUE",
            [appointmentId]
        );

        if (rows.length === 0) {
            return res.status(404).json({message: "Appointment not found"});
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching appointment:", error);
        return res.status(500).json({message: "Error fetching appointment"});
    }
}

export async function createAppointment(req: Request, res: Response): Promise<Response> {
    const newAppointment = req.body;

    const {error} = appointmentSchema.validate(newAppointment);

    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

    const conn = await connect();

    try {
        await conn.query("INSERT INTO appointments SET ?", [newAppointment]);
        return res.json({
            message: "Appointment created",
        })
    } catch (error) {
        console.error("Error creating appointment:", error);
        return res.status(500).json({message: "Error creating appointment"});
    }
}

export async function updateAppointment(req: Request, res: Response): Promise<Response> {
    const appointmentId = req.params.id;
    const updatedAppointmentData = req.body;

    const {error} = appointmentSchema.validate(updatedAppointmentData);

    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

    try {
        const conn = await connect();

        const [existingAppointment] = await conn.query<RowDataPacket[]>(
            "SELECT * FROM appointments WHERE id = ?",
            [appointmentId]
        )

        if (existingAppointment.length === 0) {
            return res.status(404).json({message: "Appointment not found"});
        }

        await conn.query("UPDATE appointments SET ? WHERE id = ?", [updatedAppointmentData, appointmentId]);

        return res.json({message: "Appointment updated", appointmentId: updatedAppointmentData});
    } catch (error) {
        console.error("Error updating appointment:", error);
        return res.status(500).json({message: "Error updating appointment"});
    }

}

export async function deactivateAppointment(req: Request, res: Response): Promise<Response> {
    const appointmentId = req.params.id;

    try {
        const conn = await connect();
        const [existingAppointment] = await conn.query<RowDataPacket[]>(
            "SELECT * FROM appointments WHERE id = ?",
            [appointmentId]
        )

        if (existingAppointment.length === 0) {
            return res.status(404).json({message: "Appointment not found"});
        }

        await conn.query<RowDataPacket[]>("UPDATE appointments SET active = FALSE WHERE id = ?", [appointmentId]);

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json({message: "Error deactivating appointment"});
    }
}