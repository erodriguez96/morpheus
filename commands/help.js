//this is the help embed

module.exports = {
    name: 'help',
    description: 'Displays help for morguapo',
    execute(message, args, cmd, client, Discord){
        const embed = new Discord.MessageEmbed()
        .setColor('#4B0082')
        .setTitle('Bienvenidos, Bienvenidos a Jinámar')
        .setURL('https://www.youtube.com/watch?v=-SJRf8Mn-A0')
        .setDescription('Esta es mi presentación, soy un bot del carajo chupádmela insensatos.')
        .addFields(
            {name: 'Yo me entreno con el Kung Fu del caballo', value: 'Desde Junio hasta Mayo'},
            {name: 'Nunca fallo, nunca fallo', value: 'Vamos Neo, eres un caballo?'},
            {name: 'Venga pibe chúpala un poco', value: 'Nuevas funcionalidades incoming'},
        )
        .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYuSo9lWdIRPtTAwA4gxwCMGEE9GBFs4LpiA&usqp=CAU')
        .setFooter('Acuerdate de saludar y deje de darle a la picareta don Jacinto');

        message.channel.send(embed);
    }
}