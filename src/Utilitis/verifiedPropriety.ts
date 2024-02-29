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



export async function verifiedPropriety (jwtDecode: any, id_grafo: any) {
    const grafo = await Grafo.findOne({ where: { id_grafo: id_grafo } });
    const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });

    if (grafo?.dataValues.id_utente === utente?.dataValues.id_utente) {
        return true
    } else {
        return false
    }
}