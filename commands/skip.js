module.exports = {
    name: 'skip',
    aliases: ['sk', 'next'],
    description: 'Skips the track that is actually playing',
    async execute(message, args, cmd, client, Discord) {
        
        const vc = message.member.voice.channel;
        if (!vc) return message.channel.send('Métete en algún canal primero, pollaboba');

        if(!)

    }
}