const Sequelize = require("sequelize");
const connection = require("./database");

const Resposta = connection.define('respostas', {
    corpo: {
        type: Sequelize.TEXT,
        allowNul: false
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        allowNul: false
    }
});

Resposta.sync({ force: false });

module.exports = Resposta;