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

	event.on("chat", function(ev) {
			
		var user = ev.client.uid();
		
		engine.log(user);
		
		if (dbc) dbc.query("SELECT ts_uuid FROM " + config.databasePrefix + "verify WHERE verified=1", function (err, res) {
			if (!err) {
				var ts_uuid = [];
				
				res.forEach(function(row) {
					var charArray = row.ts_uuid;
					var string = "";
					for(let i = 0; i < charArray.length; i++) {
						string += String.fromCharCode(charArray[i]);
					}
					ts_uuid.push(string);
				});
				
				if(ts_uuid.includes(user)) {
					engine.log(user);
					dbc.query("SELECT verification_code FROM " + config.databasePrefix + "verify WHERE ts_uuid='" + user + "'", function (err, res) {
						if(!err) {
							var verification_code = "";
					
							res.forEach(function(row) {
								var charArray = row.verification_code;
								var string = "";
								for(let i = 0; i < charArray.length; i++) {
									string += String.fromCharCode(charArray[i]);
								}
								verification_code = string;
							});
							
							engine.log(verification_code);
							
							var client = backend.getClientByUID(user);
							
							if(ev.text === verification_code) {
								client.chat("Du wurdest verifiziert!");
								if (dbc) dbc.exec("UPDATE " + config.databasePrefix + "verify SET verified=2 WHERE ts_uuid='" + user + "'");
								setToGroups(client);
							} else {
								client.chat("Der Code war nicht richtig!");
							}
						}
					});
				}	
				
			}
			
		});
	
	});	
	
	function setToGroups(user) {
		for(let i = 0; i < config.removeIds.length; i++) {
			
			user.removeFromServerGroup(config.removeIds[i]);
			
		}
		
		for(let i = 0; i < config.addIds.length; i++) {
				
			user.addToServerGroup(config.addIds[i]);	
				
		}	
		
	}	

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

        var client = backend.getClientByUID(item);

        engine.log(index + " : " + item);

        engine.log(client);

        if (dbc) dbc.exec("UPDATE " + config.databasePrefix + "verify SET verified=1 WHERE ts_uuid='" + item + "'"); 
		
		client.chat("Bitte geb deinen Verifaction Code ein, welcher dir im Minecraft Chat gesendet wurde!");

    }
	
	function getValuesToDelete(selectedColumn, column, columnValue) {
		
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

                    resultUnder.forEach(processValuesToDelete);

                }
            });
        } else {
            engine.log("error2");
        }
		
	}

	function processValuesToDelete(item, index) {

        var client = backend.getClientByUID(item);

        engine.log(index + " : " + item);

        engine.log(client);

        for(let i = 0; i < config.removeIds.length; i++) {
			
			client.addToServerGroup(config.removeIds[i]);
			
		}
		
		for(let i = 0; i < config.addIds.length; i++) {
				
			client.removeFromServerGroup(config.addIds[i]);	
				
		}
		
		client.chat("Deine Verbindung wurde aufgehoben!");
		
		if (dbc) dbc.exec("DELETE FROM " + config.databasePrefix + "verify WHERE ts_uuid='" + item + "'"); 

    }

    async function doStuff() {
        while (true) {

            engine.log("work");

            getSpecificValue("*", "verified" , 0);
			
			getValuesToDelete("*", "verified", 3);

            await sleep(2000);
        }
    }

    doStuff();

});