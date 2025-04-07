const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const fs = require('fs'); // JSON dosyasını okuyup yazmak için gerekli.

let kayıtlar = require('../veriler/kayıtlar.json'); // kayıt sayısı dosyası

module.exports.run = async (bot, message, args, member, client, level) => {

  const klog = message.guild.channels.cache.get("1266868746421534751");
  const sohbetKanal = message.guild.channels.cache.get("1266868746740568176"); // Sohbet kanalını al

  if(!message.member.roles.cache.has("1338531067233046681")) 
    return message.channel.send(new Discord.MessageEmbed()
    .setDescription("Komutu kullanmak için <@&1338531067233046681> yetkiye sahip olman gerek")
    .setColor("RED"));

  const isim = args[1];
  if(!isim)
    return message.channel.send(new Discord.MessageEmbed()
    .setDescription(`Bir İsim Gir Örnek: \`${ayarlar.prefix}erkek <@KİŞİ> <isim> <isim2> <yaş>\``)
    .setColor("RED"));

  const isim2 = args[2];  // Yeni parametre 'isim2' burada alınıyor.
  if(!isim2)
    return message.channel.send(new Discord.MessageEmbed()
    .setDescription(`Bir İsim2 Gir Örnek: \`${ayarlar.prefix}erkek <@KİŞİ> <isim> <isim2> <yaş>\``)
    .setColor("RED"));

  const yaş = args[3];  // Yaş artık args[3] olacak
  if(!yaş)
    return message.channel.send(new Discord.MessageEmbed()
    .setDescription(`Bir Yaş Gir Örnek: \`${ayarlar.prefix}erkek <@KİŞİ> <isim> <isim2> <yaş>\``)
    .setColor("RED"));

  let user = message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(message.mentions.users.first().id);
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

  const embed01 = new Discord.MessageEmbed()
    .setDescription(`
\`✨ Kayıt Eden Yetkili:\` \n${message.author}
\`👥 Kayıt edilen Kullanıcı:\` \n${user}
\`🎭 Kayıt işleminde verilen rol:\` 
<@&1266868745859502111>  
\`📤 Kayıt işleminde alınan rol:\` 
<@&1266868745696055311>
\`📊 Kayıt Sayın:\` **[${kayıtlar[id]}]**
`)
    .setColor("RED")
    .setThumbnail(user.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/1266868746740568183/1346179573980856360/woe.png?ex=67c73eed&is=67c5ed6d&hm=ca3e796e27fe808283f676ebc9785a59dd9f506dd762c48d279e46d74cb8323b&'); // Resim URL'sini 
  
// Embed mesajı kanala gönder
klog.send(embed01);
sohbetKanal.send(embed01);
  
  await user.roles.add('1266868745859502111');
  await user.roles.remove('1266868745696055311');
  await user.setNickname(`〔 🤝 〕・ ${isim} | ${isim2} [${yaş}]`);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["dost"],
  permLevel: 0
};

exports.help = {
  name: 'dost',
  description: 'Kayıt',
  usage: 'erkek <@Kişi> <İsim> <İsim2> <Yaş>'
};
