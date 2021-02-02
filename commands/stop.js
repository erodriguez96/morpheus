const { VoiceChannel } = require("discord.js")
const { execute } = require("./play")

module.exports = {
    name: 'stop', 
    description: 'Makes the bot leave the Voice Channel its supposed to be in stopping the music',
    async execute(client, message, args, Discord) {
        const vc = message.member.voice.channel;
        if(!vc)  return message.channel.send("Deberías estar en un canal para parar la música crack");
        await message.channel.send('Chos, yo me rajo de aquí');
        await vc.leave();
    }
}