import {Request, Response} from "express";

export async function signUp(req: Request, res: Response) {
    res.send("Sign up")
}

export async function signIn(req: Request, res: Response) {
    res.send("Sign in")
}
