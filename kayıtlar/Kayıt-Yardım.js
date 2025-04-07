const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");
var prefix = ayarlar.prefix;

exports.run = async (client, message, args) => {
    let gold = await db.fetch(`gold_${message.member.id}`);
    let user = message.mentions.users.first() || message.author;

    // Gerekli rolün ID'si
    const requiredRole = "1345740320192598099";
    const userRoles = message.member.roles.cache.map(role => role.id);

    if (!userRoles.includes(requiredRole)) {
        return message.reply("Bu komutu kullanmak için gerekli <@&1345740320192598099> rolüne sahip değilsiniz.");
    }

    const yardimEmbed = new Discord.MessageEmbed()
        .setColor('AQUA')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter(`Bu komut ${message.author.username} tarafından kullanıldı.`)
        .setTitle(`> <:klan:1342237452990939166> 『 𝙺𝙰𝚈𝙸𝚃 』 Yardım Menüsü`)
        .setDescription(`
> <a:8onking:1215015475814076508> **Merhaba <@${message.author.id}>! Prefix: \`${prefix}\`**

> <a:gelistirici:1050119158387458068> ─────── [ Kayıt Komutları ] ───────
> \`${prefix}woe @Kullanıcı [nick] [isim] [yaş]\` → **[Woe]**
> \`${prefix}uw @Kullanıcı [nick] [isim] [yaş]\` → **[Uw]**
> \`${prefix}kadro @Kullanıcı [nick] [isim] [yaş]\` → **[Kadro]**
> \`${prefix}özel @Kullanıcı [nick] [isim] [yaş]\` → **[Özel]**

> <a:gelistirici:1050119158387458068> ─────── [ Diğer Kayıtlar ] ───────
> \`${prefix}dost @Kullanıcı [nick] [isim] [yaş]\` → **[Dost]**
> \`${prefix}pubg @Kullanıcı [nick] [isim] [yaş]\` → **[Pubg]**
> \`${prefix}misafir @Kullanıcı [nick] [isim] [yaş]\` → **[Misafir]**
> \`${prefix}kadın @Kullanıcı [nick] [isim] [yaş]\` → **[Kız]**
> \`${prefix}kayıtsız @Kullanıcı\` → **Kullanıcıyı kayıtsıza atar**

> 🕒 **Bu mesaj 30 saniye içinde otomatik olarak silinecektir.**
        `)
        .setImage('https://cdn.discordapp.com/attachments/1341193865461366844/1345741375597187182/woe.png');

    message.channel.send(yardimEmbed).then(msg => {
        setTimeout(() => {
            msg.delete().catch(() => {});
        }, 30000); // 30 saniye sonra silinir
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['kayıt', 'kyardım', 'kayıtyardım'],
    permLevel: 0
};

exports.help = {
    name: 'kayıt-y',
    description: 'Kayıt sistemleri yardım menüsünü gösterir.',
    usage: 'kayıt-y'
};
