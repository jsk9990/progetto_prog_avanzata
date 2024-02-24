import { Request, Response } from 'express';
import { Grafo} from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';
import { Archi } from '../Model/Archi';
import { Utente } from '../Model/Utente';
import { Richieste } from '../Model/Richieste';
import exp from 'constants';

async function updateArco (id_grafo: any, id_archi: any, peso: any){
    const alpha = 0.8;
    const archi = await Archi.findAll({ where: { id_grafo: id_grafo } });
        const arco = await Archi.findByPk(id_archi);

        const calcolo = alpha * arco?.dataValues.peso + (1 - alpha) * peso;
        arco?.update({ peso: calcolo});
        await arco?.save();

        const risultato = JSON.parse(JSON.stringify(archi));

        return risultato
}

async function verifiedPropriety (jwtDecode: any, id_grafo: any) {
    const grafo = await Grafo.findOne({ where: { id_grafo: id_grafo } });
    const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });

    if (grafo?.dataValues.id_utente === utente?.dataValues.id_utente) {
        return true
    } else {
        return false
    }
}

async function gestioneRichiesta(jwtDecode: any, id_grafo: any, id_richieste: any) {
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


async function getIDforUpdate (jwtDecode: any, id_grafo: any) {
    const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });
    const id_utente_request = utente?.getDataValue('id_utente');
    const grafo = await Grafo.findOne({ where: { id_grafo: id_grafo } });
    const id_utente_response = grafo?.getDataValue('id_utente');
    let  id = []; 
    return  id = [id_utente_request, id_utente_response];    
}


export async function updateGrafo(req: Request, res: Response) {
  const { id_grafo, jwtDecode, id_archi, descrizione, peso } =
    req.body;

  const verifica = await verifiedPropriety(jwtDecode, id_grafo);


  if (verifica === true) {
    const update = await updateArco(id_grafo, id_archi, peso);
    const data = await getIDforUpdate(jwtDecode, id_grafo);
    const richiesta = await Richieste.create({
      id_utente_request: data[0],
      id_utente_response: data[1],
      id_grafo: id_grafo,
      descrizione: descrizione,
      modifiche:
        "Modifiche dell arco " +
        id_archi +
        " " +
        "con un peso nuovo di " +
        peso,
    });

    res.json({
      message : "Grafo aggiornato con successo", update: update, msg :"Richiesta", richiesta: richiesta });
  }

  if (verifica === false) {
    const data = await getIDforUpdate(jwtDecode, id_grafo);
    const richiesta = await Richieste.create({
      id_utente_request: data[0],
      id_utente_response: data[1],
      id_grafo: id_grafo,
      descrizione: descrizione,
      modifiche:
        "Modifiche dell arco " +
        id_archi +
        " " +
        "con un peso nuovo di " +
        peso,
    });

    res.json(richiesta);
  }
  
}   


export async function updateArcoAfterRequest (req: Request, res: Response) { 
    const { jwtDecode, id_grafo,id_richieste, id_archi, peso } = req.body;

    console.log(req.body);
    
    
    const risultatoRichiesta = await gestioneRichiesta(jwtDecode, id_grafo, id_richieste);

    console.log(JSON.stringify(risultatoRichiesta));

    if (risultatoRichiesta === 'accettata') {
        const update = await updateArco(id_grafo, id_archi, peso);
        res.status(200).json( {risultatoRichiesta : risultatoRichiesta , update : update});
    } else if (risultatoRichiesta === 'rifiutata') {
        res.json('Richiesta rifiutata');
    } else {
        res.json('Richiesta in attesa');
    }
}
 

export async function getRichieste(req: Request, res: Response) {
    const { jwtDecode, id_grafo } = req.body;
    const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });
    const id_utente = utente?.dataValues.id_utente;

    const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, id_utente_request: id_utente } , attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
    res.status(200).json({richieste : richieste});
}


export async function approvaRichiesta(req: Request, res: Response) {
    const { jwtDecode, id_richieste,stato_richiesta } = req.body;
    const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });
    const id_utente = utente?.dataValues.id_utente;
    if (stato_richiesta === 'accettata') {
        const update = await Richieste.findOne({ where: { id_richieste: id_richieste, id_utente_request: id_utente }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta']});
        if (update){
            update.setDataValue('stato_richiesta', 'accettata');
            await update?.save();     
        }
        res.status(200).json({update : update});
    } else if (stato_richiesta === 'rifiutata') {
        const update = await Richieste.findOne({ where: { id_richieste: id_richieste, id_utente_request: id_utente }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta']});
        if (update){
            update?.setDataValue('stato_richiesta', 'rifiutata');  
            await update?.save();
        }
        res.status(200).json({update : update});
    }  
} 