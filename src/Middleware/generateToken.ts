
import jwt from 'jsonwebtoken';
import { NextFunction } from "express";

//INSERIRE VARIABILI D'AMBIENTE PER IL TOKEN  

export async function generateToken(req: any, res: any, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;

    try{
        const payload = { email,password };    
        const token = jwt.sign(payload, 'il_tuo_segreto'); // Genera il token di autenticazione
        req.body.token = token;
        next();    
    }
    catch (error) {
        res.send('Errore:  '+ error);
    }
}; 
