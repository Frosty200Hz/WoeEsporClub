const Discord = require('discord.js');

exports.run = function(client, message, args) {
  

    let sikayetkonu = args.slice(0).join(' ');
    if (sikayetkonu.length < 1) return message.channel.send('Kullanım: w!hile <şikayetiniz>').then(msg => msg.delete({timeout: 5000}));
    const embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setDescription('<:Yetkili:1049777855170621500>   \`・ Şikayetiniz İletildi. Beklemede Kalınız \`   <:Yetkili:1049777855170621500>');
    message.channel.send(embed).then(msg => msg.delete({timeout: 5000}));

    const embed2 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .setImage('https://cdn.discordapp.com/attachments/1341193865461366844/1345741375597187182/woe.png?ex=67c5a6d2&is=67c45552&hm=f91a5864c13897884bca3b684a2bf26637fcfdd9691c823f3c1078e6dee43c48&')
        .setDescription(`
-----------------------------------------------------

<:zula:1215231549642121276>    **𝙷ile: 𝙰çan:**       ${sikayetkonu}

<:Yetkili:1049777855170621500>    **𝙱ildiren**   ${message.author}

-----------------------------------------------------`);

    client.channels.cache.get('1341193865461366844').send(embed2).then(async msj => {
        msj.react('🟢').then(() => msj.react('🔴'));
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['hile'],
    permLevel: 0
};

exports.help = {
    name: 'Komut : [𝚑𝚒𝚕𝚎]',
    description: '',
    usage: ',hile <kullanıcı>'
};
