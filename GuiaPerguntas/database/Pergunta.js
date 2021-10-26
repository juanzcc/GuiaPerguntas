const Sequelize = require("sequelize");
const connection = require("./database");

//Model definido \/
const Pergunta = connection.define("perguntas", {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Passa o Model para o BD \/
Pergunta.sync({force: false}).then(() => {})

module.exports = Pergunta;