const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

//usamos un mapa para la cola de canciones, ojo este mapa es global para todos los servers
//creamos otro mas abajo para el server especifico en el que estamos.
const queue = new Map();

module.exports = {
    name: 'play',
    aliases: ['pl', 'pley', 'PLAY', 'p'],
    description: 'Joins the channel and plays a video from youtube',
    async execute(message, args, cmd, client, Discord) {
        
        //check voice channel
        const vc = message.member.voice.channel;
        if (!vc) return message.channel.send('Métete en algún canal primero, pollaboba');

        //check permisos
        const permissions = vc.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('No tengo permisos para acceder a ese canal, colgao');
        if (!permissions.has('SPEAK')) return message.channel.send('No tengo permisos para hablar en ese canal, colgao');
        if (!args.length) return message.channel.send('Necesito que me digas qué poner (un video o algo pibe)');

        //creamos el mapa local
        const serverQ = queue.get(message.guild.id);
        //usamos un objeto 'song' para cargar luego las canciones al mapa general.
        let song = {};

        if(urlCheck(args[0])){

            const songInfo = await ytdl.getInfo(args[0]);
            song = {title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url}
        
        } else{

            const videoFinder = async(query) => {
                //esto devuelve una lista de videos --> filtrarla o devolver solo el primero.
                const actualVideo = await ytSearch(query);
                return (actualVideo.videos.length > 1) ? actualVideo.videos[0] : null;
            }

            const video = await videoFinder(args.join(' '));

            if(video) song = {title: video.title, url: video.url};

        }

        if(!serverQ){
            const qConstructor ={
                voiceChannel: vc,
                textChannel: message.channel,
                connection: null,
                songs: []
            }

            queue.set(message.guild.id, qConstructor);
            qConstructor.songs.push(song);

            /** El objetivo es que tengamos una cola por servidor
             * cada cola se identifica por un ID de server (message.guild.id)
             * para eso usamos este constructor, si la cola no existe la creamos
             * y si falla la conexion porque ya existe pues la eliminamos y damos el error
             */

            try{
                const connection = await vc.join();
                qConstructor.connection = connection;
                musicPlayer(message.guild, qConstructor.songs[0]);
            } catch(e){
                queue.delete(message.guild.id);
                message.channel.send('Error en la conexión mi niño.');
                throw e;
            }
        } else{
            serverQ.songs.push(song);
            //return message.channel.send(` ${'```'} **${song.title} añadida a la cola campeón, ponte a bailarlo si quieres ${'```'} `)
            return message.channel.send(` **${song.title} añadida a la cola campeón, ponte a bailarlo si quieres `)
        }
    }
}

const urlCheck = (str) => {
    var regex =  /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return (!regex.test(str)) ? false : true;
}

//esta funcion se va a encargar de reproducir la música en sí
const musicPlayer = async(guild, song ) => {

    const songQ = queue.get(guild.id);
    
    if(!song){
        songQ.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, {filter: 'audioonly'});
    songQ.connection.play(stream, {seek: 0, volume: 0.5}).on('finish', () => {
        songQ.songs.shift();
        musicPlayer(guild, songQ.songs[0]);
    });

    await songQ.textChannel.send(` Sonando ahora en radio Faycan ***${song.title}*** `);

}