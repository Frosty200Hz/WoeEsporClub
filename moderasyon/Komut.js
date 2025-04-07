const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    try {
        let commandList = "";
        client.commands.forEach(command => {
            commandList += `${command.help.name}\` ${command.help.description}\` \`${command.help.usage}\`\n`;
        });
        
        const embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor("#0099ff")
            .setFooter(`Bu komut ${message.author.username} tarafından kullanıldı.`)
            .setTitle("✘ <:klanlogo:1213835740228620358> [𝚁]ᴏɪssᴇʀʀ ✘ sᴜɴᴜᴄᴜ ʙᴏᴛ ᴋᴏᴍᴜᴛ ʟɪsᴛᴇsɪ <:klanlogo:1213835740228620358> ✘")
            .setDescription(commandList);
        
        message.channel.send(embed);
    } catch (e) {
        throw e;
    }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["commands","komut"],
  permLevel: 0
};

exports.help = {
    name: 'Komut : [ĸoмυтlar]',
    description: "",
    usage: ',komut [bot´daki komutlar]'
};
