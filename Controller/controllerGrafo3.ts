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


async function updateArco (id_grafo: any, id_archi: any, peso: any){
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
  const { nome_grafo, jwtDecode, id_archi, descrizione, peso } =
    req.body;

  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
  const id_grafo = grafo?.dataValues.id_grafo;
  const verifica = await verifiedPropriety(jwtDecode, id_grafo);


  if (verifica === true) {
    const update = await updateArco(id_grafo, id_archi, peso);
    const data = await getIDforUpdate(jwtDecode, id_grafo);
    const richiesta = await Richieste.create({
      id_utente_request: data[0],
      id_utente_response: data[1],
      id_grafo: id_grafo,
      descrizione: descrizione,
      modifiche: {
        "ID arco modificato " : id_archi ,
        "peso nuovo " : peso,
        "nome_grafo" : nome_grafo
      },
      stato_richiesta: 'accettata'
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
      modifiche:{
        "ID arco modificato " : id_archi ,
        "peso nuovo " : peso,
        "nome_grafo" : nome_grafo
      },
    });

    res.json(richiesta);
  }
  
}   


export async function updateArcoAfterRequest (req: Request, res: Response) { 
    const { jwtDecode, nome_grafo,id_richieste } = req.body;

    
    const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
    const id_grafo = grafo?.dataValues.id_grafo;
    
    const risultatoRichiesta = await gestioneRichiesta(jwtDecode, id_grafo, id_richieste);

    const richieste = await Richieste.findOne({ 
        where: { 
           id_richieste: id_richieste,
        },
        attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta']
     });
     const modifiche = richieste?.getDataValue('modifiche');
     const id_archi = modifiche['ID arco modificato '];
     const peso = modifiche['peso nuovo '];
     const nome_grafo_modifiche = modifiche['nome_grafo'];
    //console.log(JSON.stringify(risultatoRichiesta));

    try{
        if (nome_grafo === nome_grafo_modifiche){ 
            if (risultatoRichiesta === 'accettata') {
                const update = await updateArco(id_grafo, id_archi, peso);
                res.status(200).json( {risultatoRichiesta : risultatoRichiesta , update : update});
            } else if (risultatoRichiesta === 'rifiutata') {
                res.json('Richiesta rifiutata');
            } else {
                res.json('Richiesta in attesa');
            }
        } else {
            return res.status(404).json({ error: 'Nome del grafo non corrispondente' });
            }
        } catch (err) {
            return res.status(500).json ({ error: err });   
        }
    }
 

export async function getRichieste(req: Request, res: Response) {
    const { jwtDecode, nome_grafo } = req.body;
    const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });
    const id_utente = utente?.dataValues.id_utente;

    const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo, id_utente: id_utente } });
    
    try{
        if (!grafo){
        return res.json('Grafo non trovato');
        } 
        
    const id_grafo = grafo?.dataValues.id_grafo;

        const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, id_utente_request: id_utente } , attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
        res.status(200).json({richieste : richieste});
    } 
    catch (err) {
        res.json({error : err , message : 'Grafo non trovato'});
    }
    
    
}


export async function approvaRichiesta(req: Request, res: Response) {
    const { jwtDecode, id_richieste,stato_richiesta } = req.body;
    const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });
    const id_utente = utente?.dataValues.id_utente;
    if (stato_richiesta === 'accettata') {
        const update = await Richieste.findOne({ where: { id_richieste: id_richieste, id_utente_response: id_utente }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta']});
        if (update){
            update.setDataValue('stato_richiesta', 'accettata');
            await update?.save();     
        }
        res.status(200).json({update : update});
    } else if (stato_richiesta === 'rifiutata') {
        const update = await Richieste.findOne({ where: { id_richieste: id_richieste, id_utente_response: id_utente }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta']});
        if (update){
            update?.setDataValue('stato_richiesta', 'rifiutata');  
            await update?.save();
        }
        res.status(200).json({update : update});
    }  
} 


export async function viewRichiestePerData(req:Request, res:Response) {

    const { jwtDecode, nome_grafo, from, to, stato } = req.body;

    const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });
    const id_utente = utente?.dataValues.id_utente;

    const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo, id_utente: id_utente } });
    const id_grafo = grafo?.dataValues.id_grafo;

    try{

        if ( stato === 'accettata'){

            const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, update_date: { [Op.gte]: from, [Op.lte]: to }, stato_richiesta: 'accettata' },attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
            console.log(richieste);
            if (!richieste){
                return res.status(404).json({ error: 'Grafo non ha richieste accettate' });
            }
            res.status(200).json({richieste : richieste});
        } 

        if ( stato === 'rifiutata'){
            const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, update_date : { [Op.gte]: from, [Op.lte]: to } , stato_richiesta: 'rifiutata' }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
            if (!richieste){
                return res.status(404).json({ error: 'Grafo non ha richieste rifiutate' });
            }
            res.status(200).json({richieste : richieste});
        }
    } catch (err) {
    res.status(404).json({error : err });
    }
}

export async function getRichiestePerModello(req:Request, res:Response) {
    const { nome_grafo, jwtDecode } = req.body;
    const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
    if (!grafo) {
        return res.status(404).json({ message: 'Grafo con il nome fornito non trovato/ non presente sul database' });
    }
    const id_grafo = grafo?.dataValues.id_grafo;
    const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });
    const id_utente = utente?.dataValues.id_utente;
    const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, stato_richiesta : 'pending'}, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
    res.status(200).json({message : "Richieste in pending per il modello selezionato" ,richieste : richieste});
}

export async function getRichiestePerUtente(req:Request, res:Response){
    const {jwtDecode} = req.body;

    const utente= await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });
    const id_utente = utente?.dataValues.id_utente;
    const richieste= await Richieste.findAll({ where: { id_utente_response: id_utente , stato_richiesta : 'pending' }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });

    res.status(200).json({message : "Richieste in pending per l'utente selezionato" ,richieste : richieste});


}

export async function exportRichieste(req: Request, res: Response) {
    const { jwtDecode, nome_grafo, from, to, format } = req.body;

    try{

        const utente = await Utente.findOne({ where: { email : jwtDecode.email, password: jwtDecode.password } });
        const id_utente = utente?.dataValues.id_utente;

        const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo, id_utente: id_utente } });
        const id_grafo = grafo?.dataValues.id_grafo;

        const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, update_date: { [Op.gte]: from, [Op.lte]: to }, stato_richiesta: 'accettata' },attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
        //res.status(200).json({richieste : richieste});



        const dataValuesOnly = richieste.map((item) => item.dataValues); 

        switch (format) {
            case 'csv':
                const csv = writeCSV(dataValuesOnly);
                res.setHeader('Content-Type', 'text/csv');
                res.send(csv);
                break;
            case 'pdf':
                generatePDF(dataValuesOnly).then((pdf) => {
                    res.setHeader('Content-Type', 'application/pdf');    
                    res.send(pdf);
                })
                .catch((err) => {
                    res.status(500).json({error : err });
                });
                
                break;
            case 'xml':
                const xml = convertToXML(dataValuesOnly);
                res.setHeader('Content-Type', 'application/xml');
                res.send(xml);
                break;
            case 'json':
            default:
                res.json(richieste);
                break;
        }
    }
    catch (err) {
        res.json({error : err , message : 'Errore interno'});
    }
    
}