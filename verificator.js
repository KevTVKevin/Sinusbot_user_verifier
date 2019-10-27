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

    if (dbc) dbc.exec("CREATE TABLE IF NOT EXISTS '' + config.databasePrefix + 'verify' ( 'id' int(11) NOT NULL AUTO_INCREMENT, 'minecraft_uuid' varchar(100) NOT NULL, 'ts_uuid' varchar(100) NOT NULL, 'verification_code' varchar(100) NOT NULL, 'verified' int(11) NOT NULL");
    if (dbc) dbc.exec("CREATE TABLE IF NOT EXISTS '' + config.databasePrefix + 'check' ( 'id' int(11) NOT NULL AUTO_INCREMENT, 'checked' int(11) NOT NULL");

    while (true) {
        if (dbc) dbc.query("SELECT COUNT(*) FROM '' + config.databasePrefix + 'verify'", function (err, res) {
            if(!err) {
                var count = (dbc) ? dbc.query("SELECT COUNT(*) FROM '' + config.databasePrefix + 'check'", function (err, res){
                    if (!err) {
                        return res;
                    }
                    return -1;
                }) : -1;
                if(res > count) {
                    for(let i = count+1; i > res; i++) {
                        if (dbc) dbc.exec("INSERT INTO '' + config.databasePrefix + 'check' (0)");
                    }
                }
            }
        });

    }
});