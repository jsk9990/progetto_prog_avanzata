
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
import { creaUtente, getUtenti } from './Controller/controllerUtente';
import { creaGrafo,AggiornaGrafo } from './Controller/controllerGrafo';
import { calcolaPercorsoMinimo } from './Controller/controllerGrafo1';



//----------------CONFIGURAZIONI INIZIALI----------------------------------------//
const app = express();
const port = 3000;
app.use (express.json());

//-----------------CREAZIONE ROUTES----------------------------------------------//



//-------------------MIDDLEWARE-------------------------------------------------//
import { generateToken } from './Middleware/generateToken';
import {checkToken} from './Middleware/checkToken';
import {checkUtente} from './Middleware/checkUtente';
// import { checkAdmin } from './Middleware/checkAdmin';
import { decodeToken } from './Middleware/decodeToken';
import { checkAdmin } from './Middleware/checkAdmin';



//-------------------ROUTES-------------------------------------------------//
 
app.get('/home', (req: any, res: any) => {
    testDbConnection(req, res);
});

app.post('/login',generateToken, (req: any, res: any) => { 
    res.json({
      message: 'Login effettuato con successo',
      message2:'Ecco il tuo token:',
      token: req.body.token  
    },); 
  });

app.post('/sign_in',checkUtente,generateToken, (req: any, res: any) => {
    creaUtente(req, res);
});

app.get('/utenti', checkToken, (req: any, res: any) => {
    getUtenti(req, res);  
})

app.get('/login/admin',decodeToken,checkAdmin, (req: any, res: any) => {
  res.send('Admin accesso consentito'+ req.body);
})

app.post('/utenti/crea_grafo',checkToken,decodeToken, (req: any, res: any) => {
  creaGrafo(req, res);
})


app.post ('/utente/aggiorna',checkToken,(req: any, res: any) => {
  AggiornaGrafo(req, res);
})


app.get('/esecuzione_modello', (req: Request, res: Response) => { 

 });

app.post('/utente/esecuzione_modello',checkToken,decodeToken, (req: Request, res: Response) => {
  calcolaPercorsoMinimo(req, res);
 });

//----------------------------------------------------------------------//


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});