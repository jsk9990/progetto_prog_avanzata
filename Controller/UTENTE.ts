// Inserire questa funzione in un controller, ad esempio `Controller/DB.ts`

import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { Singleton } from '../Model/Singleton';
import { Utente } from '../Model/Utente';



async function generateToken(userData: any) {
    const jwt = require('jsonwebtoken');
    try {
        // Chiave segreta per firmare il token
        const secretKey = 'il_tuo_segreto';

        // Opzioni del token JWT
        const options = {
            expiresIn: '1h' // Tempo di scadenza del token (1 ora)
        };

        // Creazione del token JWT in modo asincrono
        return new Promise((resolve, reject) => {
            jwt.sign({id : userData.idUtente}, secretKey, options, (err: any, token: any) => {
                if (err) {
                    reject(err); // Se si verifica un errore, viene restituito un errore
                } else {
                    resolve(token); // Se il token viene generato con successo, viene restituito il token
                }
            });
        });
    } catch (error) {
        throw new Error('Errore durante la generazione del token: ' + error);
    }
}



export async function getUtenti( req: any, res: any) {
    try{
        const utenti = await Utente.findAll();
        res.send(utenti);
    }
    catch (error){
        res.send('Errore:  '+ error);
    }    
}


export async function creaUtente(req: Request, res: Response) {
try {
    const {  email, password, credito, privilegi}  = req.body;
    const utente = await Utente.create({ email, password, credito, privilegi});


    //const userId = parseInt(utente.);
    const token = await generateToken(utente);

    // Invia la risposta al client includendo il token
    res.json({ message: 'I dati sono stati inseriti con successo', utente, token });
}
catch (error) {
    res.send('Errore:  '+ error);
}

}


export async function deleteUtente(req: Request, res: Response) {
try {
    const { idUtente }  = req.body;
    const utente = await Utente.destroy({ where: { idUtente } });        
    res.send('L utente: '+ idUtente +' è stato eliminato');
}
catch (error) {
    res.send('Errore:  '+ error);
}

}

export async function updateUtente(req: Request, res: Response) {
try {
    const id = req.body.idUtente;
    const newData = req.body;
    console.log('id: ' + id);
    console.log (newData);
    const index : any = await Utente.findByPk(id);

    index.set({ ...newData }); 
    await index.save();
    res.send('I dati sono stati aggiornati con successo: \n'+ index); 
}
catch (error) {
    res.status(500).send('Errore:  '+ error);
}

}
