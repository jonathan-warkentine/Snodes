const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Codesnip extends Model {

}

Codesnip.init ({

    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,

    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    favorited: {
      type: DataTypes.INTEGER,
      defaultVALUE: "0",
      allowNull: false,
    },
    user_id: {
        type:DataTypes.INTEGER,
        allowNull:false,
        references: {
            model:"user",
            key:"id"
        }

    },},
    {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'codesnip',
   });

   module.exports =Codesnip


