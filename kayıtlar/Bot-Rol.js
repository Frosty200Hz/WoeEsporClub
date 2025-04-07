const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const fs = require('fs');

let kayıtlar = require("../veriler/kayıtlar.json");

module.exports.run = async (bot, message, args) => {
  const klog = message.guild.channels.cache.get("1266868746421534751");
  const sohbetKanal = message.guild.channels.cache.get("1266868746740568176");

  if (!message.member.roles.cache.has("1338531067233046681")) 
    return message.channel.send(new Discord.MessageEmbed()
      .setDescription("Komutu kullanmak için <@&1338531067233046681> yetkiye sahip olman gerek")
      .setColor("RED"));

  const isim = args[1];
  const isim2 = args[2];
  if (!isim || !isim2)
    return message.channel.send(new Discord.MessageEmbed()
      .setDescription(`Bir İsim Gir Örnek: \`${ayarlar.prefix}bot @Kullanıcı <isim> <isim2>\``)
      .setColor("RED"));

  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!user)
    return message.channel.send(new Discord.MessageEmbed()
      .setDescription("Etiket atmayı unuttun.")
      .setColor("RED"));
  
// ========================================================== KAYIT SAYISI TUTMA =========================================================== \\
    let id = message.author.id;
    if (!kayıtlar[id]) kayıtlar[id] = 0;
    kayıtlar[id]++;
    fs.writeFileSync('./veriler/kayıtlar.json', JSON.stringify(kayıtlar, null, 2));
 // ========================================================== KAYIT SAYISI TUTMA =========================================================== \\


  
  const embed = new Discord.MessageEmbed()
    .setDescription(`
\`✨ Kayıt Eden Yetkili:\` \n${message.author}
\`🤖 Kayıt edilen Bot:\` \n${user}
\`🎭 Verilen Rol:\` <@&1266868745696055313> <@&1266868745696055312>  
\`📤 Alınan Rol:\` <@&1266868745696055311>
\`📊 Kayıt Sayın:\` **[${kayıtlar[id]}]**
`)
    .setColor("RED")
    .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
    .setImage('https://cdn.discordapp.com/attachments/1341134245816438864/1349907269994676264/woe.png');

  klog.send(embed);
  sohbetKanal.send(embed);
  

  await user.roles.add('1266868745696055312');
  await user.roles.add('1266868745696055313');
  await user.roles.remove('1266868745696055311');
  await user.setNickname(`🌟 ${isim} | ${isim2} [вσт]`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["bot"],
  permLevel: 0
};

exports.help = {
  name: 'bot',
  description: 'Bot kaydı yapar ve istatistikleri gösterir.',
  usage: 'bot @kullanıcı isim isim2'
};
