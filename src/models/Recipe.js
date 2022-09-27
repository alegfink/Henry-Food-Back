const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id :{
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    summary:{
      type: DataTypes.TEXT,
      allowNull: false
    },
    healthScore:{
      type: DataTypes.FLOAT,
      allowNull: false
    },
    steps:{
      type: DataTypes.TEXT
    },
    image:{
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  }
  );
};
