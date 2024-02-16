
//---------------IMPORT-LIBRERIE-----------------------------------------------//
import express, { Request, Response } from 'express'; //import express
import { JSON, QueryTypes,Sequelize, json } from 'sequelize'; //importo sequelize
//---------------IMPORT MODELLI------------------------------------------------//
import {Utente} from './Model/Utente'; //importo model utente
//---------------IMPORT CONTROLLERS------------------------------------------//




//----------------CONFIGURAZIONI INIZIALI----------------------------------------//
const app = express();
const port = 3001;
app.use (express.json());

//-----------------CREAZIONE ROUTES----------------------------------------------//



//-------------------MIDDLEWARE-------------------------------------------------//




//-------------------ROUTES-------------------------------------------------//

app.get('/home', (req: any, res: any) => {
  
});

app.get('/login', (req: any, res: any) => {
    ;
  });

app.get('/sign_in', (req: any, res: any) => {

});




//----------------------------------------------------------------------//


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});