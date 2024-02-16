import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {singleton}  from './singleton'; //import singleton 


const sequelize: Sequelize = singleton.getConnection();

export const Utente = sequelize.define('Utente', {
    id_utente: {
        type:DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    password: {
        type:DataTypes.STRING(45),
        allowNull: false
    },
    credito :{
        type:DataTypes.FLOAT(),
        allowNull: false
    },
    privilegi: {
        type:DataTypes.BOOLEAN(),
        allowNull: false
    },
    create_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
  
},

{ 
    timestamps: false,
    freezeTableName: true
}); 

module.exports = { Utente: Utente };
