import {Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {connect} from "../database";
import {userSchema} from "../schemas";
import {RowDataPacket} from "mysql2";

export async function signUp(req: Request, res: Response): Promise<Response> {
    const newUser = req.body;

    const {error} = userSchema.validate(newUser)

    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }

    const hashedPassword = bcrypt.hashSync(newUser.password, 10);

    const conn = await connect();

    try {
        await conn.query('INSERT INTO users SET ?', {username: newUser.username, password: hashedPassword});
        return res.json({message: "User created"});
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({message: "Error creating user"});
    }
}

export async function signIn(req: Request, res: Response): Promise<Response> {
    const {username, password} = req.body;

    const {error} = userSchema.validate({username, password});

    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

    try {
        const conn = await connect();

        const [existingUser] = await conn.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length === 0) {
            return res.status(401).json({message: 'Invalid username or password'});
        }

        const user = existingUser[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({message: 'Invalid username or password'});
        }

        const token = jwt.sign({
            userId: user.id,
            username: user.username
        }, 'ultra-secret-thomas-key', {expiresIn: '1h'});

        return res.json({token});
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({message: 'Error during login'});
    }
}