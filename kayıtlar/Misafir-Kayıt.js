const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const fs = require('fs');
let kayıtlar = require('../veriler/kayıtlar.json'); // kayıt sayısı dosyası

module.exports.run = async (bot, message, args) => {
  const klog = message.guild.channels.cache.get("1266868746421534751");
  const sohbetKanal = message.guild.channels.cache.get("1266868746740568176");

  if (!message.member.roles.cache.has("1338531067233046681")) 
    return message.channel.send(new Discord.MessageEmbed()
      .setDescription("Komutu kullanmak için <@&1338531067233046681> yetkiye sahip olman gerek")
      .setColor("RED"));

  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!user) 
    return message.channel.send(new Discord.MessageEmbed()
      .setDescription(`Bir Nick Gir Örnek: \`${ayarlar.prefix}misafir @Kullanıcı <nick> <isim> <yaş>\``)
      .setColor("RED"));

  const isim = args[1] || "Bilinmiyor";
  const isim2 = args[2] || "Bilinmiyor";
  const yaş = args[3] || "??";

  if (!klog) return console.log("Kayıt log kanalı bulunamadı!");
  if (!sohbetKanal) return console.log("Sohbet kanalı bulunamadı!");

  try {
    await user.roles.add('1266868745859502115');
    await user.roles.remove('1266868745696055311');

    // === KAYIT SAYISI TUTMA ===
    let id = message.author.id;
    if (!kayıtlar[id]) kayıtlar[id] = 0;
    kayıtlar[id]++;
    fs.writeFileSync('./veriler/kayıtlar.json', JSON.stringify(kayıtlar, null, 2));

    // === EMBED ===
    const embed01 = new Discord.MessageEmbed()
    
      .setDescription(`
\`👤 Kayıt Eden Yetkili:\` \n${message.author}
\`👥 Kayıt Edilen Kullanıcı:\` \n${user}
\`🎭 Verilen Rol:\` <@&1266868745859502115>  
\`📤 Alınan Rol:\` <@&1266868745696055311>
\`📊 Kayıt Sayın:\` **[${kayıtlar[id]}]**
`)
      .setColor("RED")
      .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
      .setImage('https://cdn.discordapp.com/attachments/1341134245816438864/1349907269994676264/woe.png?ex=67d4ce9d&is=67d37d1d&hm=1ae9f489296b7338018efb2897f77fd2f35f79797826903385dbb1300c92645a&');

    klog.send(embed01);
    sohbetKanal.send(embed01);
    

    if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) 
      return message.channel.send(new Discord.MessageEmbed()
        .setDescription("Botun **Üyeleri Yönet** yetkisi yok! Nick değiştiremem.")
        .setColor("RED"));

    await user.setNickname(`〔⭐〕・ ${isim} | ${isim2} [${yaş}]`);

  } catch (err) {
    console.error("Hata oluştu:", err);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["misafir"],
  permLevel: 0
};

exports.help = {
  name: 'misafir',
  description: 'Kayıt',
  usage: 'w!misafir <@Kişi> <İsim> <İsim2> <Yaş>'
};
