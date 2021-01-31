/**
 * fichero creado para el manejo de comandos principal, los comandos van 
 * a la carpeta de comandos, cada uno en un fichero blablabla
 */

const fs = require('fs');

module.exports = (client, Discord) => {
    const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

    for(const file of command_files){
        const command = require(`../commands/${file}`);
        //console.log(command.name);
        if(command.name){
            client.commands.set(command.name, command);
        }
        // else{
        //     continue;
        // }
    }
}