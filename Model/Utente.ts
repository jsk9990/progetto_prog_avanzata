import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {Singleton}  from './Singleton'; //import singleton 


const sequelize: Sequelize = Singleton.getConnection();

export const Utente = sequelize.define('Utente', {
    idUtente: {
        type:DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type:DataTypes.STRING(10),
        allowNull: false
    },

    password: {
        type:DataTypes.STRING(10),
        allowNull: false
    },
    credito: {
        type:DataTypes.INTEGER(),
        allowNull: false
    },
    privilegi: {
        type:DataTypes.BOOLEAN(),
        allowNull: false
    },
    create_time: {
        type:DataTypes.TIME(),
        allowNull: false
    },
  
},

{ 
    timestamps: false,
    freezeTableName: true
}); 

module.exports = { Utente: Utente };