import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {Singleton}  from '../Model/Singleton'; //import singleton 
import {Grafo}  from '../Model/Grafo'; //import singleton 
import {Nodi}  from '../Model/Nodi'; //import singleton 


const sequelize: Sequelize = Singleton.getConnection();

export const Archi = sequelize.define('Archi', {
    id_archi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_grafo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Grafo,
          key: 'id_grafo',
        },
      },
      id_nodo_partenza: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Nodi,
          key: 'id_nodi',
        },
      },
      id_nodo_arrivo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Nodi,
          key: 'id_nodi',
        },
      },
      peso: {
        type: DataTypes.FLOAT,
        allowNull: false,
      }
  
},
{ 
    timestamps: false,
    freezeTableName: true
}); 

/*
// N archi fanno riferimneto ad un solo Grafo
Archi.belongsTo(Grafo,{
    foreignKey : 'id_grafo',
    as : 'Archi'    // Archi.get(Grafo)
    
});

// Un solo arco è riferito ad un solo nodo di partenza
Archi.belongsTo(Nodi,{
    foreignKey : 'id_nodo_partenza',
    as : 'nodo_partenza'
    
});
// Un solo arco è riferito ad un solo nodo di arrivo
Archi.belongsTo(Nodi,{
    foreignKey : 'id_nodo_arrivo',
    as : 'nodo_arrivo'    
});

*/



module.exports = { Archi: Archi };