
import { Request, Response } from 'express';
import { Utente } from '../Model/Utente';

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
    const {  email, password, credito, privilegi, token }  = req.body; 
    const utente = await Utente.create({ email, password, credito, privilegi});
    
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
