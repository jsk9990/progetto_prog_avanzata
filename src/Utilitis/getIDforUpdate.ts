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



export async function getIDforUpdate (jwtDecode: any, id_grafo: any) {
    const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });
    const id_utente_request = utente?.getDataValue('id_utente');
    const grafo = await Grafo.findOne({ where: { id_grafo: id_grafo } });
    const id_utente_response = grafo?.getDataValue('id_utente');
    let  id = []; 
    return  id = [id_utente_request, id_utente_response];    
}