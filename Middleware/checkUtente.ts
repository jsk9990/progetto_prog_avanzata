import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";
import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {Singleton}  from '../Model/Singleton'; //import singleton 

/*
// Middleware per verificare l'autenticazione dell'utente
export async function checkUtente(req: any, res: any, next: Next) {
    try {
        const { DATA: nome, password } = req.body;
        const token = await generateToken(req.body.DATA); // Attendi il completamento della generazione del token
        const jwt = require('jsonwebtoken');

        if (!token) {
            // Se il token non è presente, restituisci un errore
            return res.status(401).json({ error: 'Token non fornito' });
        }

        // Verifica il token
        jwt.verify(token, 'il_tuo_segreto', (err: any, decoded: any) => {
            if (err) {
                // Se c'è un errore nella verifica del token, restituisci un errore
                return res.status(401).json({ error: 'Token non valido' });
            }

            // Se il token è valido, passa alla prossima funzione di middleware
            next();
        });
    } catch (error) {
        return res.status(500).json({ error: 'Errore durante la verifica del token: ' + error });
    }
}
*/
  
  //module.exports = { checkUtente: checkUtente};