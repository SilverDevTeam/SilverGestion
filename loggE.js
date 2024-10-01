const { EmbedBuilder } = require("discord.js");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////
////////// logs d'erreur
//////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function loggE(client, erreur) {
    ////////////////////////// TIME /////////////////////////////////////////////////////////////////////////////
    const d = new Date()
    var jours = d.getDate().toString().padStart(2, "0")
    var mois = d.getMonth().toString().padStart(2, "0")
    var année = d.getFullYear().toString().padStart(2, "0")
    var heures = d.getHours().toString().padStart(2, "0")
    var minutes = d.getMinutes().toString().padStart(2, "0")
    var secondes = d.getSeconds().toString().padStart(2, "0")
    var milliseconds = d.getMilliseconds().toString().padStart(3, "0")
    const time = `${jours}/${Number(mois + 1)}/${année} =>> ${heures}h ${minutes}m ${secondes}s ${milliseconds}ms`
    ////////////////////////// CODE DE LOG ///////////////////////////////////////////////////////////////////////
    const text = erreur

    const embed = new EmbedBuilder()
        .setTitle(`[ERROR] ${time} :`)
        .setDescription(text)
        .setColor('Red')
        .setTimestamp()
        .setFooter({
            text: `La console virtuelle !`,
            iconURL: client.user.displayAvatarURL(), 
        });

    client.channels.cache.get('1289977176149463103').send({ embeds: [embed] })
}
