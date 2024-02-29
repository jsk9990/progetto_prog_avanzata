
//---------------IMPORT-LIBRERIE-----------------------------------------------//
import express, { Request, Response } from 'express'; //import express
import { JSON, QueryTypes,Sequelize, json } from 'sequelize'; //importo sequelize
import 'dotenv/config';
//---------------IMPORT MODELLI------------------------------------------------//
import {Utente} from './src/Model/Utente'; //importo model utente
import {Grafo} from './src/Model/Grafo'; //importo model grafo
import {Nodi} from './src/Model/Nodi'; //importo model nodi
import {Archi} from './src/Model/Archi'; //importo model archi
import {Richieste} from './src/Model/Richieste'; //importo model richieste
import {Simulazione} from './src/Model/Simulazione';
import {Singleton}  from './src/Model/Singleton'; //import singleton
//---------------IMPORT CONTROLLERS------------------------------------------//
import {testDbConnection} from './src/Controller/DB'; //importo controller utente
import { creaUtente, getUtenti, updateCredito} from './src/Controller/controllerUtente';
import { creaGrafo, calcolaPercorsoMinimo, getSimulazione, updateGrafo, updateArcoAfterRequest, getRichieste, getRichiestePerModello, getRichiestePerUtente, approvaRichiesta, viewRichiestePerData, exportRichieste} from './src/Controller/controllerGrafo';


//import { updateGrafo, updateArcoAfterRequest, getRichieste, approvaRichiesta, viewRichiestePerData, getRichiestePerModello, getRichiestePerUtente, exportRichieste} from './Controller/controllerGrafo3';


//----------------CONFIGURAZIONI INIZIALI----------------------------------------//
const app = express();
const port = process.env.EXPRESS_PORT;
app.use (express.json());



//-----------------CREAZIONE ROUTES----------------------------------------------//



//-------------------MIDDLEWARE-------------------------------------------------//
import { generateToken } from './src/Middleware/generateToken';
import {checkToken} from './src/Middleware/checkToken';
import {checkUtente, checkCredenziali, checkEmailFormat} from './src/Middleware/checkUtente';
import { checkGrafoEsecuzione } from './src/Middleware/checkGrafoEsecuzione';
import { decodeToken } from './src/Middleware/decodeToken';
import { verificaStrutturaGrafo , verificaGrafoConnesso } from './src/Middleware/checkGrafo';
import { checkAdmin } from './src/Middleware/checkAdmin';
import { checkGrafoSimulazione, checkVerificaRequisiti} from './src/Middleware/checkGrafoSimulazione';
import { validateGrafoUpdate } from './src/Middleware/checkGrafoUpdate';
import { checkRichiestaFormat } from './src/Middleware/checkApprovaRichiesta';
import { checkDataUpdateAfterRequest, checkFormatUpdateAfterRequest } from './src/Middleware/checkGrafoAfterRequest';
import { checkExport } from './src/Middleware/checkExport';




//-------------------ROUTES-------------------------------------------------//
 
app.get('/home', (req: any, res: any) => {
    testDbConnection(req, res);
});

app.post('/login',checkEmailFormat,checkCredenziali,generateToken, (req: any, res: any) => { 
    res.json({
      message: 'Login effettuato con successo',
      message2:'Ecco il tuo token:',
      token: req.body.token  
    },); 
  });

app.post('/sign_in',checkEmailFormat,checkUtente,generateToken, (req: any, res: any) => {
    creaUtente(req, res);
});

app.get('/utenti', checkToken, (req: any, res: any) => {
    getUtenti(req, res);  
})

app.get('/utenti/admin',checkToken,decodeToken,checkAdmin, (req: any, res: any) => { 
  getUtenti(req, res);
})

app.post('/utenti/admin/ricaricaCredito',checkToken,decodeToken,checkAdmin, (req: any, res: any) => {
  updateCredito(req, res);
}) ; 

app.post('/utenti/crea_grafo',checkToken,decodeToken,verificaStrutturaGrafo,verificaGrafoConnesso, (req: any, res: any) => {
  creaGrafo(req, res);
}) ; 

app.post('/utenti/esecuzione_modello',checkToken,decodeToken,checkGrafoEsecuzione, (req: Request, res: Response) => {
  calcolaPercorsoMinimo(req, res);
 });

app.post('/utenti/simulazione',checkToken,checkGrafoSimulazione,checkVerificaRequisiti, (req: Request, res: Response) => { 
  getSimulazione(req, res);
 });


app.post ('/utenti/aggiornaGrafo',checkToken,decodeToken,validateGrafoUpdate,(req: any, res: any) => {
  updateGrafo(req, res); 
})

//prendo tutte le richieste 
app.get('/utenti/richieste',checkToken,decodeToken, (req: any, res: any) => {
  getRichieste(req, res);
})

//prendo le richieste accettate e rifiutate in base alla data

app.get('/utenti/view_aggiornamenti',checkToken,decodeToken, (req: any, res: any) => {
  viewRichiestePerData(req, res);
})

app.get('/utenti/richieste_per_singolo_modello',checkToken,decodeToken, (req: any, res: any) => {
  getRichiestePerModello(req, res);
})

app.get ('/utenti/richieste_per_singolo_utente',checkToken,decodeToken, (req: any, res: any) => {
  getRichiestePerUtente(req, res);
})


app.post ('/utenti/richieste/approvaRichiesta',checkToken,decodeToken,checkRichiestaFormat, (req: any, res: any) => {
approvaRichiesta(req, res);
})

app.post('/utenti/richieste/aggiornaGrafo',checkToken,decodeToken,checkFormatUpdateAfterRequest, checkDataUpdateAfterRequest, (req: any, res: any) => {
  updateArcoAfterRequest(req, res);
})

app.use('/utenti/export',checkToken,decodeToken,checkExport, (req: any, res: any) => {
  exportRichieste(req, res);
})

//----------------------------------------------------------------------//


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});