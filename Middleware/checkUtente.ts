import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";
import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {Singleton}  from '../Model/Singleton'; //import singleton 
import {Utente}  from '../Model/Utente'; //import singleton 
import jwt from 'jsonwebtoken';



export async function generateToken(req: any, res: any) {
    try{
        const utente= req.body;
        const token = jwt.sign({userdata: utente.idUtente}, 'il_tuo_segreto', { expiresIn: '600s' }); // Genera il token di autenticazione
        res.json('Ecco a te il tuo token, valido per 10 minuti: \n     ' + token);
    }
    catch (error) {
        res.send('Errore:  '+ error);
    }
}; 

export async function checkToken(req: any, res: any, next: Next) {
    const token = req.body.token
    if(token === null){
        return res.status(401).json({ error: 'Token non fornito' });
    }

    try{
        jwt.verify( token, 'il_tuo_segreto', (err: any, decoded: any) => {
            if (err) {
                // Se c'è un errore nella verifica del token, restituisci un errore
                return res.status(401).json({ error: 'Token non valido' });
            };
            next();
        })   
    }

    catch (error) {
        res.send('Errore:  '+ error);   
    }   
}








/*



// Middleware per verificare l'autenticazione dell'utente
export async function checkUtente(req: any, res: any, next: Next) {
    try {
        const utente = req.body;
        const token = jwt.sign({userdata: utente.idUtente}, 'il_tuo_segreto', { expiresIn: '1h' }); // Genera il token di autenticazione
        console.log(token);
        if (!token) {
            // Se il token non è presente, restituisci un errore
            return res.status(401).json({ error: 'Token non fornito' });
        }
        
        // Verifica il token
        jwt.verify( req.headers.authorization, 'il_tuo_segreto', (err: any, decoded: any) => {
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