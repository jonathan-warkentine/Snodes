const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Favorite extends Model {

}

Favorite.init ({

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

    user_id: {
        type:DataTypes.INTEGER,
        allowNull:false,
        references: {
            model:"user",
            key:"id"
        }
    },
},
    {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'favorite',
   });

   module.exports = Favorite
