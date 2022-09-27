const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    sequelize.define('dishType', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        // primaryKey: true
        unique: true
      },
    },
    {
      timestamps: false
    }
    );
  };