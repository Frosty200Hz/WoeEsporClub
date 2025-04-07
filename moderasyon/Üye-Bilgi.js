const Discord = require("discord.js");

exports.run = async (client, message, args, prefix, ayar, emoji) => {
  // Mevcut roller
  let Misafir = "1266868745859502115";
  let ekipRolü = "1338531067233046681";
  let kayıtsızRolü = "1266868745696055311";
  let askadroRolü = "1266868745859502116";
  let botRolü = "1266868745696055312";
  let dostKlan = "1266868745859502111";
  let pubgRolü = "1340393858319519906";
  let woeKlan = "1266868745859502113"; // Partner özel
  let kadinRolü = "1266868745859502117"; // Kadın üye
  let uwKlan = "1341705464504782951"; // Erkek üye

  // Aktif üyeleri sayma (çevrimiçi)
  let onlineMembers = message.guild.members.cache.filter(member => member.presence && member.presence.status === 'online').size;

  // Bot sayısını hesaplama
  let botCount = message.guild.members.cache.filter(member => member.user.bot).size;

  // Embed mesajı oluştur
  const embeddd = new Discord.MessageEmbed()
    .setColor("GOLD")
    .setTitle("<:klan:1342237452990939166> [Sunucu] (Üye) Bilgileri")
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setThumbnail(message.guild.iconURL())
    .addFields(
      { name: "<:klan:1342237452990939166> ・[ᴡᴏᴇ : ᴋʟᴀɴ]", value: `[${message.guild.members.cache.filter(member => member.roles.cache.has(woeKlan)).size}]`, inline: true },
      { name: "<:klan:1342237452990939166> ・[ᴜᴡ : ᴋʟᴀɴ]", value: `[${message.guild.members.cache.filter(member => member.roles.cache.has(uwKlan)).size}]`, inline: true },
      { name: "<:klan:1342237452990939166> ・[ᴀs : ᴋᴀᴅʀᴏ]", value: `[${message.guild.members.cache.filter(member => member.roles.cache.has(askadroRolü)).size}]`, inline: true },
      { name: "<:klan:1342237452990939166> ・[ᴅᴏsᴛ : ᴋʟᴀɴ]", value: `[${message.guild.members.cache.filter(member => member.roles.cache.has(dostKlan)).size}]`, inline: true },
      { name: "<:klan:1342237452990939166> ・[ᴋᴜʟʟᴀɴıᴄı]", value: `[${message.guild.memberCount}]`, inline: true },
      { name: "<:klan:1342237452990939166> ・[ʙᴏᴛʟᴀʀ]", value: `[${botCount}]`, inline: true },
      { name: "<:klan:1342237452990939166> ・[ᴋᴀᴅıɴ]", value: `[${message.guild.members.cache.filter(member => member.roles.cache.has(kadinRolü)).size}]`, inline: true },
      { name: "<:klan:1342237452990939166> ・[ᴘᴜʙɢ]", value: `[${message.guild.members.cache.filter(member => member.roles.cache.has(pubgRolü)).size}]`, inline: true },
      { name: "<:klan:1342237452990939166> ・[ᴍɪsᴀғɪʀ]", value: `[${message.guild.members.cache.filter(member => member.roles.cache.has(Misafir)).size}]`, inline: true },
      { name: "<:klan:1342237452990939166> ・[ᴋᴀʏıᴛsıᴢ]", value: `[${message.guild.members.cache.filter(member => member.roles.cache.has(kayıtsızRolü)).size}]`, inline: true },
      { name: "<:klan:1342237452990939166> 🔊 ・[sᴇsʟɪ]", value: `[${message.guild.members.cache.filter(member => member.voice.channel).size}]`, inline: true },
      { name: "💻 ・[Çevrimiçi Üyeler]", value: `[${onlineMembers}]`, inline: true },
    );

  // Log kanalını al
  let logChannel = message.guild.channels.cache.find(ch => ch.name === "【📜】・ᴅᴜʏᴜʀᴜ"); // Burada 'log-channel' kanalını kendi kanalınızın adıyla değiştirin
  if (!logChannel) return message.channel.send("Log kanalı bulunamadı.");

  // Log kanalına embed mesajını gönder
  logChannel.send(embeddd);

  // Kullanıcıya bilgilendirme mesajı gönder
  message.channel.send("Üye sayımı log kanalına başarıyla gönderildi.");

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['üye'],
  permLevel: 0
};

exports.help = {
  name: "üyesay",
  description: "Sunucudaki üyeleri sayar ve belirli bir log kanalına gönderir.",
  usage: "!üyesay",
  kategori: "moderasyon"
};
