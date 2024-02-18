
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
import { creaUtente, getUtenti } from './Controller/UTENTE';



//----------------CONFIGURAZIONI INIZIALI----------------------------------------//
const app = express();
const port = 3000;
app.use (express.json());

//-----------------CREAZIONE ROUTES----------------------------------------------//



//-------------------MIDDLEWARE-------------------------------------------------//




//-------------------ROUTES-------------------------------------------------//
 
app.get('/home', (req: any, res: any) => {
    testDbConnection(req, res);
});

app.get('/login', (req: any, res: any) => { 
    ;
  });

app.post('/sign_in', (req: any, res: any) => {
    creaUtente(req, res);
});

app.get('/utenti', (req: any, res: any) => {
    getUtenti(req, res);  
})


//----------------------------------------------------------------------//


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});