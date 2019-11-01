registerPlugin({
    name: 'Verificator',
    version: '1.0',
    description: 'Ein Verifaction System für Teamspeak Users über Minecraft',
    author: 'KevTVKevin <KevTV@GigaClub.net>',
    requiredModules: ["db"],
    engines: '>= 1.0.0',
    vars: [{
        name: "databaseDriver",
        title: "Database Driver",
        placeholder: "driver",
        type: "string"
    }, {
        name: "databaseHost",
        title: "Database Host",
        placeholder: "hostname",
        type: "string"
    }, {
        name: "databaseUsername",
        title: "Database Username",
        placeholder: "username",
        type: "string"
    }, {
        name: "databasePassword",
        title: "Database Passwort",
        placeholder: "Passwort",
        type: "password"
    }, {
        name: "databaseName",
        title: "Database Name",
        placeholder: "Database Name",
        type: "string"
    }, {
        name: "databasePrefix",
        title: "Database Prefix",
        placeholder: "Prefix(prefix_)",
        type: "string"
    }, {
        name: "removeIds",
        title: "Gruppen von User zu entfernen",
        type: "strings"
    }, {
        name: "addIds",
        title: "Gruppen welche hinzugefügt werdem",
        type: "strings"
    }]
}, function(_, config, meta) {
    var db = require('db');
    var engine = require('engine');
    var helpers = require('helpers');
    var backend = require('backend');

    var dbc = db.connect({  driver: config.databaseDriver,
                            host: config.databaseHost,
                            username: config.databaseUsername,
                            password: config.databasePassword,
                            database: config.databaseName
                        },
        function (err) {
            if(err) {
                engine.log(err);
            }
    });
    // Baue Tabellen auf, falls sie nicht existieren
    if (dbc) dbc.exec("CREATE TABLE IF NOT EXISTS " + config.databasePrefix + "verify ( id int(11) NOT NULL AUTO_INCREMENT, minecraft_uuid varchar(255) NOT NULL, ts_uuid varchar(255) NOT NULL, verification_code varchar(255) NOT NULL, verified int(11) NOT NULL, primary key (id))");

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getSpecificValue(selectedColumn, column, columnValue) {
        if(dbc) {
            dbc.exec("SELECT " + selectedColumn + " FROM " + config.databasePrefix + "verify WHERE " + column + " = '" + columnValue + "'", function (err, res) {
                if(!err) {
                    return res;
                } else {
                    return [];
                }
            });
        } else {
            return [];
        }
    }

    function processValues(item, index) {

        var user = getClientByUniqueID(item);

        user.chat("Hi!");

    }

    async function doStuff() {
        while (true) {
            var toCheck = getSpecificValue("ts_uuid", "verified" , "0");

            toCheck.forEach(processValues);

            await sleep(3000);
        }
    }

    doStuff();

});