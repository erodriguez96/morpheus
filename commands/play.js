const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'play',
    description: 'Joins the channel and plays a video from youtube',
    async execute(client, message, args, Discord) {
        const vc = message.member.voice.channel;
        //check si el usuario está en un canal
        if (!vc) return message.channel.send('Métete en algún canal primero, pollaboba');
        
        //check si hay permiso para acceder al canal y reproducir
        const permissions = vc.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('No tengo permisos para acceder a ese canal, colgao');
        if (!permissions.has('SPEAK')) return message.channel.send('No tengo permisos para hablar en ese canal, colgao');
        if (!args.length) return message.channel.send('Necesito que me digas qué poner (un video o algo pibe)');
        
        if(urlCheck(args[0])){
            const conn = await vc.join();
            const stream = ytdl(args[0], {filter: 'audioonly'});
            conn.play(stream, {seek: 0, volume: 1}).on('finish', () => {
                vc.leave();
            })
            await message.reply(`Pues yo soy mas de José Velez, pero allá va`);
            //sin este return crashea el codigo porque sigue con lo de abajo, reestructurar para solucionarlo.
            return
        }

        const connection = await vc.join();
        const videoFinder = async(query) => {
            //esto devuelve una lista de videos --> filtrarla o devolver solo el primero.
            const actualVideo = await ytSearch(query);
            return (actualVideo.videos.length > 1) ? actualVideo.videos[0] : null;
        }

        const video = await videoFinder(args.join(' '));

        if(video){
            const stream = ytdl(video.url, {filter: 'audioonly'});
            //se puede cambiar el seek y el volume a gusto, pero probando pues 0 y 1 encajan mas o menos
            connection.play(stream, {seek: 0, volume: 1}).on('finish', () => {
                vc.leave();
            })
            await message.reply(`Sonando ahora en radio Faycan ***${video.title}***`);
        } else{
            return message.channel.send('No existe esa vaina primo');
        }
    }
}

const urlCheck = (str) => {
    var regex =  /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return (!regex.test(str)) ? false : true;
}