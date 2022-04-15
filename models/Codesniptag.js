const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Codesniptag extends Model {

}

Codesniptag.init ({

    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    codesnip_id: {
        type:DataTypes.INTEGER,
        allowNull:false,
        references: {
            model:"codesnip",
            key:"id"
        }
    },

    tag_id: {
        type:DataTypes.INTEGER,
        allowNull:false,
        references: {
            model:"tag",
            key:"id"
        }
    },
},
    {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'codesniptag',
   });

   module.exports =Codesniptag
