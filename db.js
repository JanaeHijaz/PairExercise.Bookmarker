//const pg = require('pg');
const Sequelize = require("sequelize"); // has to be capitalized
const sequelize = new Sequelize('postgres://localhost/bookmarks_db');

const Bookmarks = sequelize.define('Bookmarks', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        } 
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});


module.exports = {
    sequelize,
    Bookmarks
}

/*
what goes in the db file:
Require Sequelize
Create new instance of Sequelize
Create (define) the table (after creating and connecting to the database)
Then export (module.exports) the client and the table name into the server.js file
*/