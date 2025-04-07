const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  const kisi = db.fetch(`afkid_${message.author.id}_${message.guild.id}`);
  if (kisi) return;

  const sebep = args.join(" ") || "Sebep Girilmemiş"; // Sebep girilmediyse varsayılan olarak ayarla
  const kullanıcı = message.member;
  const eskiTakmaAd = kullanıcı.displayName;

  // Sebep uzunluğu kontrolü
  if (sebep.length > 100) {
    return message.channel.send("Sebep 100 karakterden uzun olamaz. Lütfen daha kısa bir sebep girin.");
  }

  // Veritabanına kayıt
  await db.set(`afkSebep_${kullanıcı.id}_${message.guild.id}`, sebep);
  await db.set(`afkid_${kullanıcı.id}_${message.guild.id}`, kullanıcı.id);
  await db.set(`afkAd_${kullanıcı.id}_${message.guild.id}`, eskiTakmaAd);

  // Bilgilendirme
  message.channel.send(
    `<:klan:1342237452990939166> Sunucuda Başarıyla [AFK] Oldunuz. Girilen Sebep: ${sebep}`
  );

  // Sunucu sahibi değilse veya botun rolü yetiyorsa takma adını değiştir
  if (kullanıcı.id !== message.guild.ownerId) {
    try {
      await kullanıcı.setNickname(`[AFK] ${eskiTakmaAd}`);
    } catch (error) {
      console.error("Takma ad değiştirilirken bir hata oluştu:", error);
      message.channel.send("Takma adınızı değiştirme yetkim yok veya bir hata oluştu.");
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "afk",
  description: "AFK olmanızı sağlar.",
  usage: "afk [sebep]"
};
