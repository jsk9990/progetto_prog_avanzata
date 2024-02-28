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





 export async function updateArco (id_grafo: any, id_archi: any, peso: any){
    const alpha = 0.8;
    const archi = await Archi.findAll({ where: { id_grafo: id_grafo } });
        const arco = await Archi.findByPk(id_archi);

        const calcolo = alpha * arco?.dataValues.peso + (1 - alpha) * peso;
        arco?.update({ peso: calcolo});
        await arco?.save();

        const archi_aggiornati = await Archi.findAll({ where: { id_grafo: id_grafo } });

        const risultato = JSON.parse(JSON.stringify(archi_aggiornati));

        return risultato
}