const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Spacecraft = sequelize.define('spacecraft',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3,200]
        }
    },
    speed:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1000
        }
    },
    mass: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 200
        }
    } });


    module.exports=Spacecraft;