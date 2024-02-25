
//---------------IMPORT-LIBRERIE-----------------------------------------------//
import express, { Request, Response } from 'express'; //import express
import { JSON, QueryTypes,Sequelize, json } from 'sequelize'; //importo sequelize
//---------------IMPORT MODELLI------------------------------------------------//
import {Utente} from './Model/Utente'; //importo model utente
import {Grafo} from './Model/Grafo'; //importo model grafo
import {Nodi} from './Model/Nodi'; //importo model nodi
import {Archi} from './Model/Archi'; //importo model archi
import {Richieste} from './Model/Richieste'; //importo model richieste
import {Simulazione} from './Model/Simulazione';
import {Singleton}  from './Model/Singleton'; //import singleton
//---------------IMPORT CONTROLLERS------------------------------------------//
import {testDbConnection} from './Controller/DB'; //importo controller utente
import { creaUtente, getUtenti, updateCredito} from './Controller/controllerUtente';
//import { creaGrafo,AggiornaGrafo } from './Controller/controllerGrafo';
import { calcolaPercorsoMinimo } from './Controller/controllerGrafo1';
import { getSimulazione } from './Controller/controllerGrafo2';
import { creaGrafo } from './Controller/controllerGrafo';
import { updateGrafo, updateArcoAfterRequest, getRichieste, approvaRichiesta } from './Controller/controllerGrafo3';


//----------------CONFIGURAZIONI INIZIALI----------------------------------------//
const app = express();
const port = 3001;
app.use (express.json());

//-----------------CREAZIONE ROUTES----------------------------------------------//



//-------------------MIDDLEWARE-------------------------------------------------//
import { generateToken } from './Middleware/generateToken';
import {checkToken} from './Middleware/checkToken';
import {checkUtente, checkCredenziali, checkEmailFormat} from './Middleware/checkUtente';
import { checkGrafoEsecuzione } from './Middleware/checkGrafoEsecuzione';
import { decodeToken } from './Middleware/decodeToken';
import { verificaStrutturaGrafo , verificaGrafoConnesso } from './Middleware/checkGrafo';
import { checkAdmin } from './Middleware/checkAdmin';





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


app.post ('/utenti/aggiornaGrafo',checkToken,decodeToken,(req: any, res: any) => {
  updateGrafo(req, res); 
})


app.post('/utenti/simulazione', (req: Request, res: Response) => { 
  getSimulazione(req, res);
 });



app.get('/utenti/richieste',checkToken,decodeToken, (req: any, res: any) => {
  getRichieste(req, res);
})

app.post ('/utenti/richieste/approvaRichiesta',checkToken,decodeToken, (req: any, res: any) => {
approvaRichiesta(req, res);
})

app.post('/utenti/richieste/aggiornaGrafo',checkToken,decodeToken, (req: any, res: any) => {
  updateArcoAfterRequest(req, res);
})

//----------------------------------------------------------------------//


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});