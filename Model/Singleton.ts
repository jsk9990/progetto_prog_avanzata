import { Sequelize } from "sequelize";


export class Singleton {
    private static instance: Singleton;
    private connection: Sequelize;
    private constructor() {
<<<<<<< HEAD
        this.connection = new Sequelize('mydb','jsk','jsk',{
=======
        this.connection = new Sequelize('Blog','jsk','jsk',{
>>>>>>> d05959c72f989ed5a3ab47038078705a145fda92
            host : 'localhost',
            dialect : 'mysql'
        }); 
    }; 


    public static getConnection(): Sequelize {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        
        return Singleton.instance.connection;   
            
        };    

}