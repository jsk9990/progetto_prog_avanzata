// Inserire questa funzione in un controller, ad esempio `Controller/DB.ts`

import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { Singleton } from '../Model/Singleton';

export const testDbConnection = async (req: Request, res: Response) => {
  const sequelizeInstance: Sequelize = Singleton.getConnection();
  try {
    await sequelizeInstance.authenticate();
    console.log('Connection to the database has been established successfully.');
    res.status(200).send('Database connection test successful.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    res.status(500).send('Database connection test failed.');
  }
};

