module.exports = {
	name: 'nowplaying',
	description: 'Get the song that is playing.',
	execute(message, args, cmd, client, Discord) {
        const serverQueue = message.client.queue.get(message.guild.get);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
	},
};