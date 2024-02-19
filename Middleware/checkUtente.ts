import { Request, Response, NextFunction } from 'express';
import { Utente } from '../Model/Utente';

export async function checkUtente(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        
        // Cerca l'utente nel database tramite l'email
        const utente = await Utente.findOne({ where: { email,password } });
        
        // Se l'utente esiste, passa al prossimo middleware
        if (!utente) {
            next();
        } else {
            res.status(401).json('Utente esistente');
        }
    } catch (error) {
        res.status(500).send('Errore del server: ' + error);
    }
}

