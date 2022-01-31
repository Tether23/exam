const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Astronaut = sequelize.define('astronaut',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5,200]
        }
    },
    role: {
        type: DataTypes.ENUM,
        allowNull:false,
        values: ['COMMANDER','PILOT','ENGINEER'],
        validate:{
            isIn: [['COMMANDER','PILOT','ENGINEER']]
        }
    }
});

module.exports=Astronaut;