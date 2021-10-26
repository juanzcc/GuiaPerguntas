const Sequelise = require('sequelize');

const connection = new Sequelise('guiaperguntas', 'root', '007532Mcc*', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;