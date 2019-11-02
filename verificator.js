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
    var event = require('event');
    var engine = require('engine');
    var backend = require('backend');
    var helpers = require('helpers');
    var db = require('db');

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
            dbc.query("SELECT " + selectedColumn + " FROM " + config.databasePrefix + "verify WHERE " + column + " = '" + columnValue + "'", function (err, res) {
                if (!err) {
                    let resultUnder = [];

                    res.forEach(function(row) {
                        var charArray = row.ts_uuid;
                        var string = "";
                        for(let i = 0; i < charArray.length; i++) {
                            string += String.fromCharCode(charArray[i]);
                        }
                        engine.log(string);
                        resultUnder.push(string);
                    });

                    engine.log(resultUnder);

                    resultUnder.forEach(processValues);

                }
            });
        } else {
            engine.log("error2");
        }

    }

    function processValues(item, index) {

        //Problems with getting user by UID
        var client = backend.getClientByUID(item);

        engine.log(index + " : " + item);

        engine.log(client);

        client.chat("Hi!");

    }

    async function doStuff() {
        while (true) {

            engine.log("work");

            getSpecificValue("*", "verified" , 0);

            await sleep(10000000);
        }
    }

    doStuff();

});