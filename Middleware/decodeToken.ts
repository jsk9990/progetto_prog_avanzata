
import jwt from 'jsonwebtoken';
import { NextFunction } from "express";
/*
export async function decodeToken(auth: any, req: any, res: any, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token != null){
        try{
            const decode = jwt.verify(token, 'il_tuo_segreto');
            console.log (decode);
            return decode;
        }
        catch(error){
            res.send('Token non valido');
        }
    }
    else{
        res.status(401).send('Token non fornito');
    }
}
*/ 


export function decodeToken(token: string): any {
    try {
        const decoded = jwt.verify(token, 'il_tuo_segreto'); // Utilizza una variabile d'ambiente per il segreto
        return decoded;
    } catch (error) {
        throw new Error('Token non valido');
    }
}
