const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const fs = require('fs');
const db = require('quick.db');
const express = require('express');
require('./util/eventLoader.js')(client);
const path = require('path');
const snekfetch = require('snekfetch');
var prefix = ayarlar.prefix;
const log = message => {
console.log(`${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});



//------------------------------ BOT ------------------------------------\\

client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

//------------------------------ BOT ------------------------------------\\
client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

//------------------------------ BOT ------------------------------------\\

fs.readdir('./kayıtlar/', (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./kayıtlar/${f}`);
        log(`Yüklenen kayıt komutu: ${props.help.name}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

//------------------------------ BOT ------------------------------------\\

fs.readdir('./moderasyon/', (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./moderasyon/${f}`);
        log(`Yüklenen moderasyon komutu: ${props.help.name}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});


//------------------------------ BOT ------------------------------------\\
client.elevation = message => {
    if (!message.guild) {
        return;
    }

    let permlvl = 5;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 5;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

//------------------------------ BOT OYNUYOR ------------------------------------\\
    client.on("ready", async () => {
    await client.user.setStatus("idle"); // Botun durumunu çevrim içi ve rahatsız etme modunda ayarlar
    await client.user.setActivity("👑・Woe`e-Sports`Club"); // Botun görünüşünü ayarlar
});

//------------------------------ #BOT [DM] ------------------------------------\\

client.on("message", msg => {
var dm = client.channels.cache.get("1356294549248544999")
if(msg.channel.type === "dm") {
if(msg.author.id === client.user.id) return;
const botdm = new Discord.MessageEmbed()
.setTitle(`${client.user.username} Dm`)
.setTimestamp()
.setColor("RED")
.setThumbnail(`${msg.author.avatarURL()}`)
.addField("Gönderen", msg.author)
.addField("Gönderen ID", msg.author.id)
.addField("Gönderilen Mesaj", msg.content)

dm.send(botdm)

}
if(msg.channel.bot) return;
});

//-------------------------------------LOGLAR-------------------------------------------------\\

  client.on("voiceStateUpdate", async (oldState, newState) => {

    const seslog = client.channels.cache.get("1356999017405616169"); //KANAL ID
    if (oldState.member.user.bot || newState.member.user.bot) return;

    // New channel join
    if (!oldState.channel && newState.channel) {
        seslog.send(`\n<:klan:1342237452990939166>     ${newState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${newState.channel} 【**ᴋᴀɴᴀʟ'ᴀ**】【**gїяїş ~ чаpтї**】 <:klan:1342237452990939166>`);
    }

    // Leaving channel
    if (oldState.channel && !newState.channel) {
        seslog.send(`\n<:klan:1342237452990939166>     ${oldState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${oldState.channel} 【**ᴋᴀɴᴀʟ'ᴅᴀɴ**】【**çıкış ~ чаpтї**】 <:klan:1342237452990939166>`);
    }

    // Moving between channels
    if (oldState.channel && newState.channel && oldState.channel !== newState.channel) {
        seslog.send(`\n<:klan:1342237452990939166>     ${newState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${oldState.channel} < > ${newState.channel} 【**geçti**】 <:klan:1342237452990939166>`);
    }

    // Muted state change
    if (oldState.serverMute === false && newState.serverMute === true) {
        seslog.send(`\n<:klan:1342237452990939166>      ${oldState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${newState.channel}【**susturuldu'nuz**】 <:klan:1342237452990939166>`);
    }

    // Unmuted state change
    if (oldState.serverMute === true && newState.serverMute === false) {
        seslog.send(`\n<:klan:1342237452990939166>      ${oldState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${newState.channel}【**susturlmanız kaldırıldı**】 <:klan:1342237452990939166>`);
    }

    // Deafened state change
    if (oldState.serverDeaf === false && newState.serverDeaf === true) {
        seslog.send(`\n<:klan:1342237452990939166>      ${oldState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${newState.channel}   <:Yetkili:1049777855170621500> 【**sağırlaştırıldınız**】 <:klan:1342237452990939166>`);
    }

    // Undeafened state change
    if (oldState.serverDeaf === true && newState.serverDeaf === false) {
        seslog.send(`\n<:klan:1342237452990939166>      ${oldState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${newState.channel}   <:Yetkili:1049777855170621500>  【**sağırlaşmanız kaldırıldı**】 <:klan:1342237452990939166>`);
    }

    // Video state change
    if (oldState.selfVideo === false && newState.selfVideo === true) {
        seslog.send(`\n<:klan:1342237452990939166>      ${oldState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${newState.channel} 【**kamera yayını açtı**】 <:klan:1342237452990939166>`);
    }

    // Video stop
    if (oldState.selfVideo === true && newState.selfVideo === false) {
        seslog.send(`\n<:klan:1342237452990939166>      ${oldState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${newState.channel} 【**kamera yayını kapattı**】 <:klan:1342237452990939166>`);
    }

    // Streaming state change
    if (oldState.streaming === false && newState.streaming === true) {
        seslog.send(`\n<:klan:1342237452990939166>      ${oldState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${newState.channel} 【**canlı yayın açtı**】 <:klan:1342237452990939166>`);
    }

    // Stop streaming
    if (oldState.streaming === true && newState.streaming === false) {
        seslog.send(`\n<:klan:1342237452990939166>      ${oldState.member.user} 【**ᴋᴜʟʟᴀɴɪᴄɪ**】 ${newState.channel} 【**canlı yayını kapattı**】 <:klan:1342237452990939166>`);
    }

});
  
//----------------------------------------# • Oto Kayıt-------------------------------------------------\\



client.on('guildMemberAdd', async (member) => {
    const moment = require("moment");
    require("moment-duration-format");

    let cslog = "1358182628964171816"; // Log kanalı ID
    let registrationRoleId = "1266868745696055311"; // Kayıt rolü ID
    let logChannel = member.guild.channels.cache.get(cslog); // Log kanalı al

    // Yeni üyeye kayıt rolü ekle
    await member.roles.add(registrationRoleId);
  
  


// ========================================================== Kullanıcı Adını Belirle =========================================================== \\
  
  
    try {
        await member.setNickname(`〔👤〕・ #Nɪᴄᴋ #İꜱɪᴍ #Yᴀꜱ`);
    } catch (err) {
        console.error('Takma ad değiştirilirken bir hata oluştu:', err);
    }
  
  
  // ========================================================== Kullanıcı Adını Belirle =========================================================== \\

    let user = member.user;
    const accountCreationYear = user.createdAt.getFullYear();
    moment.locale('tr');
  


   // ========================================================== Sunucuya katılma ve oluşturulma tarihi =========================================================== \\
  
  
  
    let serverJoinDate = moment(member.joinedAt).local().format('LL');
    let serverCreationDate = moment(member.guild.createdAt).local().format('LL');
  
  
  
  
  // ========================================================== Sunucuya katılma ve oluşturulma tarihi =========================================================== \\
  
  

  
 // ========================================================== Kullanıcı Avatar =========================================================== \\
  
  
  
  
    const avatarUrl = user.displayAvatarURL({ format: 'png', dynamic: true });
  
  
  

  
// ========================================================== Kullanıcı Avatar =========================================================== \\
  
  
  

// ========================================================== Kullanıcının Oynadığı Oyun =========================================================== \\
  
  
  
    let gameActivity = "Şu an bir oyun oynamıyor.";
    if (member.presence && member.presence.activities.length > 0) {
        const game = member.presence.activities.find(activity => activity.type === "PLAYING");
        if (game) {
            gameActivity = `**${game.name}**`;
        }
    }
  
  // ========================================================== Kullanıcının Oynadığı Oyun =========================================================== \\
  
  
  

   // ========================================================== Botmu Değilmi =========================================================== \\
  
    let isBot = user.bot ? 'Evet, bu bir bot.' : 'Hayır, bu bir kullanıcı.';
  
  // ==========================================================  =========================================================== \\
  
  // ========================================================== Özel Durum =========================================================== \\
  
  let customStatus = "Belirtilmemiş";
if (member.presence && member.presence.activities) {
    const custom = member.presence.activities.find(a => a.type === "CUSTOM_STATUS");
    if (custom && custom.state) {
        customStatus = custom.state;
    }
}
  
// ========================================================== Kullanıcı =========================================================== \\
  
  const members = member.guild.members.cache;
const toplam = members.size;
const botlar = members.filter(m => m.user.bot).size;
const insanlar = toplam - botlar;
  
// ========================================================== Spotify =========================================================== \\

// ========================================================== Kayıt =========================================================== \\
  
    const embed = new Discord.MessageEmbed()
    
        .setDescription(`
            **|───────────────────────────────────────────|**
            <:klan:1342237452990939166> 〖✨〗 Sunucu'ya ʜᴏş ɢᴇʟᴅɪɴ ᴋᴇʏɪғʟɪ sᴏʜʙᴇᴛʟᴇʀ ᴅɪʟᴇʀɪᴢ...
            <:klan:1342237452990939166> 〖🎁〗 ${member} 
            <:klan:1342237452990939166> 〖🧩〗 〖${member.user.username}〗 〖${member.user.id}〗
            <:klan:1342237452990939166> 〖🎈〗 𝙺ᴀᴛıʟᴅığıɴ ɪçɪɴ ᴛᴇşᴇᴋᴋüʀ ᴇᴅɪʏᴏʀᴜᴢ
            <:klan:1342237452990939166> 〖🖌〗 #𝙽𝚒𝚌𝚔 #İ𝚜𝚒𝚖 #𝚈𝚊ş 〖ᴠᴇʀɪɴ ᴋᴀʏıᴛ ᴇᴅᴇʟɪᴍ〗
            |───────────────────────────────────────────|
            <:klan:1342237452990939166> 〖🎉〗 𝚂unucudα sєnínlє вєrαвєr  **〖${insanlar}〗** 〖kíşíчíz〗
            <:klan:1342237452990939166> 〖🤖〗 𝙱ᴏᴛ ᴅᴜʀᴜᴍᴜ: **[${botlar}]**
            <:klan:1342237452990939166> 〖🎇〗 𝚃ᴏᴘʟᴀᴍ ᴋᴜʟʟᴀɴıᴄı sᴀʏısı: **〖${toplam}〗**
            |───────────────────────────────────────────|
            <:klan:1342237452990939166> 〖👑〗 <@&1338531067233046681>
            |───────────────────────────────────────────|
            <:klan:1342237452990939166> 〖📅〗 𝙺𝚞𝚕𝚕𝚊𝚗ı𝚌ı ʜᴇsᴀᴘ ᴀçıʟᴀʟı: 〖${accountCreationYear}〗
            <:klan:1342237452990939166> 〖🤖〗 𝙱ᴏᴛ ᴅᴜʀᴜᴍᴜ: 〖${isBot}〗
            <:klan:1342237452990939166> 〖📥〗 𝚂ᴜɴᴜᴄᴜ'ʏᴀ ᴋᴀᴛıʟᴍᴀ ᴛᴀʀɪʜɪ: 〖 ${serverJoinDate} 〗
            <:klan:1342237452990939166> 〖🏛〗 𝚂ᴜɴᴜᴄᴜ ᴏʟᴜşᴜᴍ ᴛᴀʀɪʜɪ: 〖 ${serverCreationDate} 〗
            <:klan:1342237452990939166> 〖🎮〗 𝙾ʏɴᴀᴅığı ᴏʏᴜɴ ɪsᴍɪ:  〖${gameActivity}〗 
            <:klan:1342237452990939166> 〖⏰〗 𝙺ᴀᴛıʟıᴍ sᴀᴀᴛɪ: <t:${Math.floor(Date.now() / 1000)}:F>
            <:klan:1342237452990939166> 〖💬〗 Özel Durumu: ${customStatus}
            <:klan:1342237452990939166> 〖📌〗 Sunucu Kuralları: <#1266868746421534757>
            **|───────────────────────────────────────────|**
        `)
        .setColor('RANDOM')
        .setAuthor('🔱 `  𝚆 𝙾 𝙴 ` 𝙴𝚂𝙿𝙾𝚁 ´ 𝙲𝙻𝚄𝙱 ` 「 #𝙺ᴀʏıᴛ #𝚂ɪsᴛᴇᴍɪ 」', member.guild.iconURL())
        .setThumbnail(avatarUrl);

    // Embed mesajını gönder ve emojiler ekle
    let sentMessage = await logChannel.send(embed);
    await sentMessage.react('<:klan:1342237452990939166>');
    await sentMessage.react('<:kalp3:1343986490958413864>');
    await sentMessage.react('<:askadro:1342562915403825173>');

// ========================================================== Kullanıcıya kural kanalını mesaj olarak gönder =========================================================== \\
  
    const rulesChannelId = "1266868746421534757"; // KURALLAR KANALI
    const rulesChannel = member.guild.channels.cache.get(rulesChannelId);
    if (rulesChannel) {
        await member.send(`**Merhaba ${member.user.username}, sunucumuza hoş geldin! 🎉 \n
        📜 Kurallar Kanalı: ${rulesChannel} \n
        📌 Kayıt olmak ve sunucuya katılmak için yukarıdaki kanala göz atmayı unutma! ✅\n
        📢 Kuralları Okuduysan [EMOJİ]'lere tıkla**\n`);
    }
});

//----------------------------------------# • Ayrıl-------------------------------------------------\\



client.on('guildMemberRemove', async member => {
    const cslog = "1355213714844024852"; // Log kanal ID
    const logChannel = member.guild.channels.cache.get(cslog);

    if (!logChannel) return console.log("Log kanalı bulunamadı!");

    // Kullanıcıyı fetch et
    await member.user.fetch();

    // Sunucudaki kalan üye sayısını hesapla
    const memberCount = member.guild.memberCount;

    // Ayrılma zamanı
    const ayrilmaZamani = `<t:${Math.floor(Date.now() / 1000)}:F>`;

    // Embed mesajını oluşturuyoruz
    const embed = new Discord.MessageEmbed()
        .setImage('https://cdn.discordapp.com/attachments/1341134245816438864/1349907269994676264/woe.png?ex=67d4ce9d&is=67d37d1d&hm=1ae9f489296b7338018efb2897f77fd2f35f79797826903385dbb1300c92645a&')
        .setAuthor('・Woe`e-Sports´Club・ #Ayrıldı Sistemi', member.guild.iconURL())
        .setDescription(`-----------------------------------------------------
<:klan:1342237452990939166> **Sunucu'dan Ayrıldı:** ${member.user}
<:klan:1342237452990939166> **Ayrılan Kullanıcı ID'si:** ${member.user.id}
<:klan:1342237452990939166> **Kalan Üye Sayısı:** **[${memberCount}]**
<:klan:1342237452990939166> **Zaman**: ${ayrilmaZamani}
<:klan:1342237452990939166> **Bot mu?:** ${member.user.bot ? "Evet 🤖" : "Hayır 👤"}
-----------------------------------------------------`)
        .setColor('RED')
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true })); // Kullanıcının avatarı

    // Log kanalına embed mesajını gönder
    logChannel.send(embed);
});

//----------------------------------------# • Oto Mesaj-------------------------------------------------\\  


const cooldown = new Set();

client.on("message", async msg => {
    if (msg.author.bot || !msg.guild) return;

    const mesajlar = {
        "sa": "<:klan:1342237452990939166> [Aleyküm Selam Kankam Hoş Geldin İyi Eğlenceler...]",
        "aq": "<:klan:1342237452990939166> [Bende Senin Amına Koyim...]",
        "piç": "<:klan:1342237452990939166> [Kendini Bilmen Güzel...]",
        "selamün aleyküm": "<:klan:1342237452990939166> [Aleyküm Selam Kankam Hoş Geldin İyi Eğlenceler...]",
        "selamın aleyküm": "<:klan:1342237452990939166> [Aleyküm Selam Kankam Hoş Geldin İyi Eğlenceler...]",
        "sea": "<:klan:1342237452990939166> [Aleyküm Selam Kankam Hoş Geldin İyi Eğlenceler...]",
        "orospu": "<:klan:1342237452990939166> [Orospuuu Bişeylerr...]",
        "ig": "<a:instagram:1349842404806623342> [İnstagram:] <@739059479617994816> | @ʙᴜʀᴀᴋ.ᴘᴇɴᴅɪᴋ𝟢6  &  | <@466611874558115840> | @ғʀᴏᴏssᴛᴛʏʏ.ғᴘs",
        "tag": "<:klan:1342237452990939166> [σчundαkí tαgımız:]  𝚆𝚘𝚎`",
        "amk": "<:klan:1342237452990939166> [Bende Senin Amına Koyim...]",
        "günaydın": "<:klan:1342237452990939166> [Sanada Günaydın Bebeğimmm...]",
        "woe": "<:klan:1342237452990939166> [En İyisi En Saygılısı En İyi [AİLE]´Klanı...]",
        "nasılsın": "<:klan:1342237452990939166> [İyiyim sen nasılsın...]",
        "napıyon": "<:klan:1342237452990939166> [İyiyim sen nabıyorsun...]",
        "sa beyler": "<:klan:1342237452990939166> [Aleyküm selam [KRAL]...]",
        "gel": "<:klan:1342237452990939166> [Nereye Yatağamı...]",
        "knk": "<:klan:1342237452990939166> [Söyle Kankaların Kankasığğğğ...]",
        "kanka": "<:klan:1342237452990939166> [Söyle Kankaların Kankasığğğğ...]",
        "sg": "<:klan:1342237452990939166> [Sen Siktir Git Orospu Çocuğuuu...]"
    };

    const mesaj = msg.content.toLowerCase();

    // SPAM / COOLDOWN kontrolü (5 saniye)
    if (cooldown.has(msg.author.id)) return;
    cooldown.add(msg.author.id);
    setTimeout(() => cooldown.delete(msg.author.id), 5000);

    // Artık anahtar kelime kontrolü yok, sadece istersen mesajlara başka tepkiler ekleyebilirsin
});

//----------------------------------------# • Fake Katıl Ayrıl-------------------------------------------------\\

client.on('message', async message => {
    if (message.content === '!katıl') { 
        // 'guildMemberAdd' olayını tetikle
        client.emit('guildMemberAdd', message.member || await message.guild.members.fetch(message.author));
    }

    if (message.content === '!ayrıl') { 
        // 'guildMemberRemove' olayını tetikle
        client.emit('guildMemberRemove', message.member || await message.guild.members.fetch(message.author));
    }
});

//----------------------------------------# • Küfür-------------------------------------------------\\

client.on('message', async msg => {
  if (!msg.guild || msg.author.bot) return;
  if (msg.member.roles.cache.has("1356270910692134953")) return;

  const filtre = await db.fetch(`${msg.guild.id}.kufur`);
  if (!filtre) return;

  const kufurler = [
    "oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amsk", "sikim", "sikiyim", 
    "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "sik", "yarrak", "amcık", "amık", 
    "yarram", "sikimi ye", "mk", "mq", "aq", "göt veren", "göt", "puşt", "amq"
  ];

  const mesaj = msg.content.toLowerCase().replace(/\s+/g, ''); // boşlukları kaldırıp küçük harfe çeviriyoruz

  // Küfür kontrolü
  if (kufurler.some(k => mesaj.includes(k))) {
    try {
      if (!msg.member.hasPermission("BAN_MEMBERS")) {
        let uyarilar = await db.fetch(`${msg.guild.id}.uyarilar.${msg.author.id}`) || 0;
        uyarilar++;
        await db.set(`${msg.guild.id}.uyarilar.${msg.author.id}`, uyarilar);

        let uyarıMesajı = `💀| Uyarı - ${uyarilar}`;
        const muteRoleId = "1355920223965810916";
        const muteRole = msg.guild.roles.cache.get(muteRoleId);
        const member = msg.guild.members.cache.get(msg.author.id);
        const originalNickname = member.nickname || member.user.username;

        if (uyarilar === 1) {
          return msg.reply(`${uyarıMesajı} - İlk uyarınız!`).then(msg => setTimeout(() => msg.delete().catch(() => {}), 3000));
        }

        if (uyarilar === 2) {
          return msg.reply(`${uyarıMesajı} - İkinci uyarınız!`).then(msg => setTimeout(() => msg.delete().catch(() => {}), 3000));
        }

        if (uyarilar >= 3) {
          msg.reply(`${uyarıMesajı} - Üçüncü uyarınız! Mute uygulanıyor...`).then(msg => setTimeout(() => msg.delete().catch(() => {}), 3000));

          await member.roles.add(muteRole);
          await member.setNickname(`〔🔕〕・ [MUTE'Lİ]´${member.user.username}`);

          msg.reply(`Küfür nedeniyle 30 saniyelik MUTE yediniz.`).then(msg => setTimeout(() => msg.delete().catch(() => {}), 10000));

          const originalRoles = member.roles.cache.filter(role => role.id !== muteRole.id).map(r => r.id);
          member.roles.cache.forEach(role => {
            if (role.id !== muteRole.id) {
              member.roles.remove(role).catch(console.error);
            }
          });

          setTimeout(async () => {
            await member.roles.remove(muteRole);
            await member.roles.set(originalRoles);
            await member.setNickname(originalNickname).catch(console.error);
            console.log(`Mute kaldırıldı: ${member.user.tag}`);
          }, 30000);

          await db.set(`${msg.guild.id}.uyarilar.${msg.author.id}`, 0);
        }

        return msg.delete();
      }
    } catch (err) {
      console.log(err);
    }
  }
});


//----------------------------------------# • Link-------------------------------------------------//

client.on("message", async msg => {
    var reklamDurumu = await db.fetch(`reklam_${msg.guild.id}`);

    // ID of the role that should be exempt from the advertisement filter
    const exemptRoleId = "1355916753883894053";

    // Check if the user has the exempt role
    const hasExemptRole = msg.member.roles.cache.has(exemptRoleId);

    // If reklamDurumu is 'acik' and user doesn't have exempt role
    if (reklamDurumu == 'acik' && !hasExemptRole) {
        const reklamListesi = [".com", ".net", ".hub", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg"];

        if (reklamListesi.some(word => msg.content.includes(word))) {
            try {
                if (!msg.member.hasPermission("BAN_MEMBERS")) {
                    // Reklam içeren mesajı sil
                    msg.delete();

                    // Log kanalını bul
                    const logKanal = msg.guild.channels.cache.find(channel => channel.name === '→・link');

                    // Eğer log kanalı varsa bilgi gönder
                    if (logKanal) {
                        // Kullanıcının avatarını al
                        const avatarURL = msg.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });

                        const reklamYapildiEmbed = new Discord.MessageEmbed()
                            .setColor('#ff0000')
                            .setDescription(`
                                <a:arrowright35:1215015269286543381> <a:hastagh:1097791206961983538>**[Link Atan Kişi]:** ${msg.author} 
                                
                                <a:arrowright35:1215015269286543381> <a:hastagh:1097791206961983538>**[Link İçeriği]:** ${msg.content}
                                
                                <a:arrowright35:1215015269286543381> <a:hastagh:1097791206961983538>**[Link Attığı Kanal]: **${msg.channel.name}`)
                            .setThumbnail(avatarURL) // Kullanıcının avatarını ekler
                            .setTimestamp();

                        logKanal.send(reklamYapildiEmbed);
                    } else {
                        console.log('Log kanalı bulunamadı!');
                    }

                    // Kullanıcıya uyarı mesajı gönder
                    msg.reply('Bu Sunucuda Reklam Engelleme Filtresi Aktiftir. Reklam Yapmana İzin Veremem !').then(msg => msg.delete({ timeout: 110000 }));
                }
            } catch (err) {
                console.log(err);
            }
        }
    } else if (reklamDurumu == 'kapali') {
        // Reklam engelleme kapalıysa herhangi bir işlem yapma
    }
});

//----------------------------------------# • AFK-------------------------------------------------\\

client.on("message", async (msg) => {
  if (!msg.guild) return; // Eğer DM'de mesaj geldiyse, işlem yapma
  if (msg.content.startsWith(ayarlar.prefix + "afk")) return; // AFK komutunu yok say

  let afk = msg.mentions.users.first(); // Etiketlenen kullanıcıyı al

  // AFK durumu kontrolü için veritabanından kullanıcı verisini alıyoruz
  const kisi = db.fetch(`afkid_${msg.author.id}_${msg.guild.id}`);
  const isim = db.fetch(`afkAd_${msg.author.id}_${msg.guild.id}`);

  if (afk) {
    // Etiketlenen kullanıcının AFK sebebini al
    const sebep = db.fetch(`afkSebep_${afk.id}_${msg.guild.id}`);
    const kisi3 = db.fetch(`afkid_${afk.id}_${msg.guild.id}`);

    // Eğer etiketlenen kişi AFK ise, mesajı gönder
    if (kisi3) {
      msg.reply(`Etiketlediğiniz Kişi Sunucuda [AFK] Olmuştur Girilen Sebep : ${sebep} \n\n <:klan:1342237452990939166> Sunucuda [AFK] olmak isterseniz, \`w!afk sebeb\` Komutunu kullanabilirsiniz...`);
    }
  }

  // Eğer kullanıcı AFK ise, AFK durumundan çıkarma işlemi yapılır
  if (msg.author.id === kisi) {
    msg.reply(`<:klan:1342237452990939166> [AFK]´dan Çıktınız. Sunucuda AFK olmak isterseniz, \`w!afk sebeb\` komutunu kullanabilirsiniz.`);

    // AFK verilerini temizle
    db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`);
    db.delete(`afkid_${msg.author.id}_${msg.guild.id}`);
    db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`);

    // Kullanıcının eski takma adını geri getir
    try {
      msg.member.setNickname(isim);
    } catch (error) {
      console.error("Takma ad değiştirilirken bir hata oluştu: ", error);
      msg.reply("Takma adınızı değiştirme yetkim yok veya bir hata oluştu.");
    }
  }
});


//-------------------------------------------------# • Pp Name Tag Log------------------------------------------------\\

client.on("userUpdate", async (oldUser, newUser) => {
  const avatarLogKanalID = "1356264908588712117"; // Avatar log kanalı
  const usernameTagLogKanalID = "1356294549248544999"; // Kullanıcı adı ve tag log kanalı

  const avatarKanal = client.channels.cache.get(avatarLogKanalID);
  const isimKanal = client.channels.cache.get(usernameTagLogKanalID);
  if (!avatarKanal || !isimKanal) return;

  const kişi = await client.users.fetch(newUser.id, { force: true });

  const yeniAvatar = kişi.displayAvatarURL({ dynamic: true, size: 1024 });
  const eskiAvatar = oldUser.displayAvatarURL({ dynamic: true, size: 1024 });

  function getFormat(url) {
    if (!url) return "Yok";
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    if (pathname.endsWith(".gif")) return "GIF";
    if (pathname.endsWith(".png")) return "PNG";
    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "JPG";
    if (pathname.endsWith(".webp")) return "WEBP";
    return "Bilinmiyor";
  }

  // Avatar değişimi
  if (eskiAvatar !== yeniAvatar) {
    const embed = new Discord.MessageEmbed()
      .setImage(yeniAvatar)
      .setColor("#00BFFF")
      .setTimestamp()
      .setDescription(`🖼️ ${kişi} \nᴋᴜʟʟᴀɴıᴄı [ᴀᴠᴀᴛᴀʀ'ı] ᴅᴇğɪşᴛɪ`)
      .addField("Önceki Avatar", eskiAvatar && !eskiAvatar.includes("null") ? `[Görüntüle](${eskiAvatar})` : "Silinmiş veya Yok", true)
      .addField("Yeni Avatar", `[Görüntüle](${yeniAvatar})`, true)
      .addField("Yeni Format", getFormat(yeniAvatar), true);

    avatarKanal.send({ embeds: [embed] });
  }

  // Kullanıcı adı değişimi
  if (oldUser.username !== newUser.username) {
    const embed = new Discord.MessageEmbed()
      .setColor("#FFA500")
      .setTimestamp()
      .setDescription(`⚡ ${kişi} \nᴋᴜʟʟᴀɴıᴄı ᴀᴅıɴı ᴅᴇğɪşᴛɪ`)
      .addField("Eski Ad", oldUser.username, true)
      .addField("Yeni Ad", newUser.username, true);

    isimKanal.send({ embeds: [embed] });
  }

  // Etiket (tag) değişimi
  if (oldUser.discriminator !== newUser.discriminator) {
    const embed = new Discord.MessageEmbed()
      .setColor("#8A2BE2")
      .setTimestamp()
      .setDescription(`🔰 ${kişi} \nᴋᴜʟʟᴀɴıᴄı ᴇᴛɪᴋᴇᴛɪɴɪ ᴅᴇğɪşᴛɪ`)
      .addField("Eski Tag", `#${oldUser.discriminator}`, true)
      .addField("Yeni Tag", `#${newUser.discriminator}`, true);

    isimKanal.send({ embeds: [embed] });
  }
});

//------------------------------------#Duyuru Mesaj Tepki---------------------------------------------------------\\

client.on("message", message => {

if(message.channel.id === "1339579245554565120"){
message.react("1215015475814076508")
message.react("1343986490958413864")
message.react("1342237452990939166")
message.react("🙏")
message.react("1049777853371273306")
}
})

//------------------------------------#Başvuru Mesaj Tepki---------------------------------------------------------\\

client.on("message", message => {

if(message.channel.id === "1343221818252722197"){
message.react("✅")
message.react("❎")
message.react("1342237452990939166")
}
})

//----------------------------------------# • Capslock-------------------------------------------------\\

client.on("message", async msg => {
  // DM mesajları ve bot mesajları için geçiş
  if (msg.channel.type === "dm") return;
  if (msg.author.bot) return;

  // Emojileri ve özel karakterleri ayıklama
  const containsEmoji = /<:.+?:\d+>|<a:.+?:\d+>/g.test(msg.content);
  
  // Mesajın uzunluğuna göre işlem yap
  if (msg.content.length === 1 && !containsEmoji) { // Mesajda sadece 1 harf varsa ve emoji içermiyorsa
    if (db.fetch(`capslock_${msg.guild.id}`)) {
      let caps = msg.content.toUpperCase();
      if (msg.content === caps) { // Eğer mesaj tamamen büyük harfse
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
          if (!msg.mentions.users.first()) {
            msg.delete();
            return msg.channel.send(`<:Yetkili:1049777855170621500> ${msg.author}, Bu sunucuda, [CAPS LOCK] kullanımı engellenmekte <:Duyuru:1049777853371273306>`).then(m => m.delete({ timeout: 3000 }));
          }
        }
      }
    }
  } else if (msg.content.length === 4) { // Mesaj 4 harfli ise engellemeyi kaldır
    // Burada herhangi bir işlem yapılmaz, sadece 4 harfli mesajlar için engel kalkar
    return;
  }
});

//------------------------------------Zula Fotoraf'a Emoji Tepki---------------------------------------------------------\\

client.on("messageCreate", message => {
  if (message.author.bot) return;

  const allowedChannels = [
    "1347229655253389363",
    "1350848583082971308",
    "1266868746421534759",
    "1343394547824197663",
    "1341134245816438864",
    "1339691596517736551",
    "1341083969092845679",
  ];

  if (!allowedChannels.includes(message.channel.id)) return;

  // Sadece görsel içeren mesajlara tepki ver
  if (message.attachments.size > 0) {
    let hasImage = false;

    message.attachments.forEach(attachment => {
      const imageTypes = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
      if (imageTypes.some(type => attachment.url.endsWith(type))) {
        hasImage = true;
      }
    });

    if (hasImage) {
      // Sadece görsellere tepki eklenir
      message.react("📷");
      message.react("1342237452990939166");
      message.react("1343986490958413864");
      message.react("1343986490958413864");
      message.react("1343987017184317524");
      message.react("🙏");
    }
  }
});

//-----------------------ENV----------------------\\  
 client.login(process.env.token)