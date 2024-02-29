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
            res.status(401).json({ error: 'Utente già esistente'});
        }
    } catch (error) {
        res.status(500).send('Errore del server: ' + error);
    }
}

export async function checkCredenziali(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        
        // Cerca l'utente nel database tramite l'email e la password fornita
        const utente = await Utente.findOne({ where: { email, password } });
        
        // Se le credenziali sono corrette, passa al prossimo middleware
        if (utente) {
            next();
        } else {
            // Se le credenziali non sono corrette, restituisci un errore
            res.status(401).json({ error: 'Credenziali non valide' });
        }
    } catch (error) {
        // Gestisci eventuali errori di connessione al database o altri errori del server
        res.status(500).send('Errore del server: ' + error);
    }
}


export function checkEmailFormat(req: Request, res: Response, next: NextFunction) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex per validare il formato email
    const { email } = req.body;

    if (email && emailRegex.test(email)) {
        next(); // Se l'email è valida, passa al prossimo middleware
    } else {
        res.status(400).json({ error: 'Formato email non valido' }); // Altrimenti, restituisci un errore
    }
}

