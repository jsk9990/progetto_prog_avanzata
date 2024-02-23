import { Request, Response } from 'express';
import { Grafo} from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';
import { Archi } from '../Model/Archi';
import { Utente } from '../Model/Utente';
import { Richieste } from '../Model/Richieste';

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

async function gestioneRichiesta(jwtDecode: any, id_grafo: any, id_richiesta: any) {
    const richiesta = await Richieste.findOne({ where: { id_richiesta: id_richiesta } });
    if (richiesta?.dataValues.stato_richiesta === 'accettata') {
        return 'accettata'
    } else if(richiesta?.dataValues.stato_richiesta === 'rifiutata') {
        return 'rifiutata'
    }else {
        return 'pending'
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

    res.json(
      "Grafo aggiornato con successo" +
        JSON.stringify(update) +
        "\n Richiesta \n " +
        JSON.stringify(richiesta)
    );
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
    const { jwtDecode, id_grafo,id_richiesta, id_archi, peso } = req.body;
    
    const risultatoRichiesta = await gestioneRichiesta(jwtDecode, id_grafo, id_richiesta);
    if (risultatoRichiesta === 'accettata') {
        const update = await updateArco(id_grafo, id_archi, peso);
        res.json(update);
    } else if (risultatoRichiesta === 'rifiutata') {
        res.json('Richiesta rifiutata');
    } else {
        res.json('Richiesta in attesa');
    }
}