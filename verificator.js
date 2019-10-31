registerPlugin({
    name: 'Verificator',
    version: '1.0',
    description: 'Ein Verifaction System für Teamspeak Users über Minecraft',
    author: 'KevTVKevin <KevTV@GigaClub.net>',
    requiredModules: ["db"],
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
    if (dbc) dbc.exec("CREATE TABLE IF NOT EXISTS '' + config.databasePrefix + 'verify' ( 'id' int(11) NOT NULL AUTO_INCREMENT, 'minecraft_uuid' varchar(100) NOT NULL, 'ts_uuid' varchar(100) NOT NULL, 'verification_code' varchar(100) NOT NULL, 'verified' int(11) NOT NULL");
    if (dbc) dbc.exec("CREATE TABLE IF NOT EXISTS '' + config.databasePrefix + 'check' ( 'id' int(11) NOT NULL AUTO_INCREMENT, 'checked' int(11) NOT NULL");

    while (true) {
        //Hole Anzahl der Datenbankeinträge in verify
        if (dbc) dbc.query("SELECT COUNT(*) FROM '' + config.databasePrefix + 'verify'", function (err, res) {
            if(!err) {
                //Speichere Anzahl der Datenbankeinträge in check in der Variable count
                var count = (dbc) ? dbc.query("SELECT COUNT(*) FROM '' + config.databasePrefix + 'check'", function (err, res){
                    if (!err) {
                        return res;
                    }
                    return -1;
                }) : -1;
                //Prüfe ob es mehr Einträge in verify als in check gibt
                if(res > count) {
                    for(let i = count+1; i < res; i++) {
                        //Setze die neuen Einträge in der Datenbank auf 0
                        if (dbc) dbc.exec("INSERT INTO '' + config.databasePrefix + 'check' (checked) VALUES (0)");
                    }
                }
            }
        });
        //Hole alle checked Werte aus der check Tabelle
        var checkArray = (dbc) ? dbc.query("SELECT checked FROM '' + config.databasePrefix + 'check'", function (err, res) {
            if(!err) {
                return res;
            }
            return [];
        }) : [];
        for(let i = 0; i < checkArray.length; i++) {
            if(checkArray[i] === 0) {
                var worker = new Worker("checkUser.js");
                worker.addEventListener("message", function (event) {

                });
            }
        }
     }
});