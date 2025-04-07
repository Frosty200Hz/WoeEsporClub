const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const fs = require('fs');

let kayıtlar = require('../veriler/kayıtlar.json'); // kayıt sayısı dosyası

module.exports.run = async (bot, message, args) => {
  // Gerekli kanal ve rol ID'leri
  const logChannelID = "1266868746421534751"; // Log kanalı
  const sohbetChannelID = "1266868746740568176"; // Sohbet kanalı

  const yetkiliRolID = "1338531067233046681"; // Komutu kullanabilen yetkili rolü
  const verilenRolID = "1340393858319519906"; // Kullanıcıya verilecek rol
  const alinanRolID = "1266868745696055311"; // Kullanıcıdan alınacak rol

  // Kanalları bul
  const logChannel = message.guild.channels.cache.get(logChannelID);
  const sohbetChannel = message.guild.channels.cache.get(sohbetChannelID);

  // **Kanalların bulunup bulunmadığını kontrol et**
  console.log("Log Kanalı:", logChannel ? logChannel.name : "Bulunamadı");
  console.log("Sohbet Kanalı:", sohbetChannel ? sohbetChannel.name : "Bulunamadı");

  // Yetki kontrolü
  if (!message.member.roles.cache.has(yetkiliRolID)) {
    return message.channel.send(new Discord.MessageEmbed()
      .setDescription("Komutu kullanmak için <@&1338531067233046681> yetkiye sahip olman gerek")
      .setColor("RED"));
  }

  // Kullanıcıyı al
  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  const isim = args[1];
  const isim2 = args[2];
  const yas = args[3];

  if (!user) {
    return message.channel.send(new Discord.MessageEmbed()
      .setDescription("Lütfen bir kullanıcı etiketleyin.")
      .setColor("RED"));
  }

  if (!isim || !isim2 || !yas) {
    return message.channel.send(new Discord.MessageEmbed()
      .setDescription("Eksik bilgi girdiniz! Örnek: `w!pubg @Kullanıcı <nick> <isim> <yaş>`")
      .setColor("RED"));
  }

  // Rolleri al
  const verilenRol = message.guild.roles.cache.get(verilenRolID);
  const alinanRol = message.guild.roles.cache.get(alinanRolID);

  // **Rollerin bulunup bulunmadığını kontrol et**
  console.log("Verilecek Rol:", verilenRol ? verilenRol.name : "Bulunamadı");
  console.log("Alınacak Rol:", alinanRol ? alinanRol.name : "Bulunamadı");

  try {
    // Rolleri ver/kaldır
    await user.roles.add(verilenRol);
    await user.roles.remove(alinanRol);

    // Kullanıcı adını değiştir
    await user.setNickname(`〔🎮〕・ ${isim} | ${isim2} [${yas}]`);

  // ========================================================== KAYIT SAYISI TUTMA =========================================================== \\
    let id = message.author.id;
    if (!kayıtlar[id]) kayıtlar[id] = 0;
    kayıtlar[id]++;
    fs.writeFileSync('./veriler/kayıtlar.json', JSON.stringify(kayıtlar, null, 2));
 // ========================================================== KAYIT SAYISI TUTMA =========================================================== \\
    
    // Log mesajı oluştur
    const embed = new Discord.MessageEmbed()
      .setTitle("✅ Kullanıcı Kayıt Edildi!")
      .setDescription(`
       \`✨ Kayıt Eden Yetkili:\` \n${message.author}
        \`👤 Kayıt edilen Kullanıcı:\` \n${user.user}
        \`🎭 Kayıt işleminde verilen rol:\` 
        <@&${verilenRolID}>
        \`📤 Kayıt işleminde alınan rol:\` 
        <@&${alinanRolID}>
        \`📊 Kayıt Sayın:\` **[${kayıtlar}]**`)
    
      .setColor("GREEN")
      .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
  

    // **Log ve sohbet kanallarına mesaj gönder**
    if (logChannel) await logChannel.send(embed);
    if (sohbetChannel) await sohbetChannel.send(embed);
    

    message.channel.send(new Discord.MessageEmbed()
      .setDescription(`${user} başarıyla kayıt edildi!`)
      .setColor("GREEN"));
  } catch (err) {
    console.error("Hata oluştu:", err);
    message.channel.send(new Discord.MessageEmbed()
      .setDescription("Bir hata oluştu, botun yetkilerini kontrol edin.")
      .setColor("RED"));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["pubg"],
  permLevel: 0
};

exports.help = {
  name: 'pubg',
  description: 'Kullanıcıyı kaydeder ve rollerini değiştirir.',
  usage: 'pubg <@Kişi> <İsim> <İsim2> <Yaş>'
};
