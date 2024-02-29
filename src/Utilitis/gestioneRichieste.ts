import { Request, Response } from 'express';
import { Grafo} from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';
import { Archi } from '../Model/Archi';
import { Utente } from '../Model/Utente';
import { Richieste } from '../Model/Richieste';
import { Op } from 'sequelize';
import { writeCSV } from '../Utilitis/formatConverter';
import { generatePDF } from '../Utilitis/formatConverter';
import { convertToXML } from '../Utilitis/formatConverter';



export async function gestioneRichiesta(jwtDecode: any, id_grafo: any, id_richieste: any) {
    const richieste = await Richieste.findOne({ 
        where: { 
           id_richieste: id_richieste,
        },
        attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta']
     });
    if (richieste?.getDataValue('stato_richiesta') === 'accettata') {
        return richieste?.getDataValue('stato_richiesta')
    } else if(richieste?.getDataValue('stato_richiesta') === 'rifiutata') {
        return richieste?.getDataValue('stato_richiesta')
    }else {
        return richieste?.getDataValue('stato_richiesta')
    }
}