module.exports = (Discord, client, message) => {
    const prefix = process.env.PREFIX;

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    try{
        command.execute(message, args, cmd, client, Discord);
    } catch(e){
        message.reply("Hubo un error ejecutando el comando.")
        console.log(e);
    }

    //if(command) command.execute(client, message, cmd, args, Discord);
}