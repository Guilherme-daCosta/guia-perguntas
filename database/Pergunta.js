const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');
const connection = require('./database');

const Pergunta = connection.define('pergunta', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descrição: {
        type: sequelize.TEXT,
        allowNull: false
    }
});


Pergunta.sync({force: false}).then(() => {
    console.log("Tabela criada!");
});