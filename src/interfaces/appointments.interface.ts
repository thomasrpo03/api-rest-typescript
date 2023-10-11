export interface Appointment {
    id: string;
    client_id: string;
    agent_id: string;
    date: Date;
    time: string;
    location: string;
    created_at: Date;
    updated_at: Date;
}