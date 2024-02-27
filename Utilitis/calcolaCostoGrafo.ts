import { Request, Response } from 'express';
import { Grafo } from '../Model/Grafo';
import { Utente } from '../Model/Utente';

export async function calcolaCostoGrafo(req: Request, res: Response, jwtDecode: any, struttura: any) {
    
    

    const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
    const id_utente = utente?.getDataValue('id_utente');
    if (!id_utente) {
    return res.status(400).json({ message: 'Utente non trovato' });
    }

    //verifico il credito >0 
    if (utente?.dataValues.credito < 0) {
    return res.status(400).json({ message: 'Credito esaurito: Contattare admin per la ricarica' });
    }
    // calcolo costo grafo 
    if (utente?.dataValues.credito >= 0) {
    const costoPerNodo = 0.10;
    const costoPerArco = 0.02;
    //Map dei nodi della struttura
    const nodiUnici = new Set();
    struttura.forEach((arco: any) => {
        nodiUnici.add(arco.nodo_partenza);
        nodiUnici.add(arco.nodo_arrivo);
    });
    const numeroNodi = nodiUnici.size;
    //Map degli archi
    const numeroArchi = struttura.length;
    //calcolo costo totale
    const costoTotale = (numeroArchi * costoPerArco) + (numeroNodi * costoPerNodo);
    //aggiornamento credito utente 
    if (utente?.dataValues.credito < costoTotale) {
        console.log ('Credito vecchio: ' + utente?.dataValues.credito);
        return res.status(400).json({ message: 'Credito insufficente per generare il grafo. Il credito disponibile è' + utente?.dataValues.credito });
    } else if (utente) {
        utente.dataValues.credito = utente.dataValues.credito - costoTotale;
        await utente.setDataValue('credito', utente.dataValues.credito);
        await utente.save();
    }
    return costoTotale
    }

    
}