const Discord = require("discord.js");
const fs = require("fs")
module.exports = (client) => {

    console.log("Loaded Logger Module".green);
    try{
      client.on("channelCreate", function(channel){
        send_log(client,
          channel.guild,
          "GREEN",
          "Channel CREATED",
          `Csatorna neve: \`${channel.name}\`\nCsatorna ID-je: \`${channel.id}\`\nCsatorna típusa: \`${channel.type}\``
        )
      })
      client.on("channelDelete", function(channel){
        send_log(client,
          channel.guild,
          "RED",
          "Channel DELETED",
          `Csatorna neve: \`${channel.name}\`\nCsatorna ID-je: \`${channel.id}\`\nCsatorna típusa: \`${channel.type}\``
        )
      })
      client.on("channelPinsUpdate", function(channel, time){
        send_log(client,
          channel.guild,
          "YELLOW",
          "Channel PINS UPDATE",
          `Csatorna neve: \`${channel.name}\`\nCsatorna ID-je: \`${channel.id}\`\nPinned at \`${time}\``
          , "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/265/pushpin_1f4cc.png"
        )
      })
      client.on("channelUpdate", function(oldChannel, newChannel){
        let newCat = newChannel.parent ? newChannel.parent.name : "NO PARENT";
        let guildChannel = newChannel.guild;
        if(!guildChannel || !guildChannel.available) return;

        let types = {
          text: "Szöveges csatorna",
          voice: "Hangcsatorna",
          null: "nincs típusa",
          news: "News csatorna",
          store: "Store csatorna",
          category: "kategória",
        }

        if(oldChannel.name != newChannel.name){
          send_log(client,
            oldChannel.guild,
            "YELLOW",
            "Csatorna frissítve - neve",
            `Csatorna neve: \`${oldChannel.name}\`\nCsatorna ID-je: \`${oldChannel.id}\`\n\n`+
            `Csatorna neve: \`${newChannel.name}\`\nCsatorna ID-je: \`${newChannel.id}\``
          )
        }
        else if(oldChannel.type != newChannel.type){
          send_log(client,
            oldChannel.guild,
            "YELLOW",
            "Csatorna frissítve - típus",
            `Csatorna neve: \`${oldChannel.name}\`\nCsatorna ID-je: \`${oldChannel.id}\`\nCsatorna típusa: \`${types[oldChannel.type]}\`\n\n`+
            `Csatorna neve: \`${newChannel.name}\`\nCsatorna ID-je: \`${newChannel.id}\`\nCsatorna típusa: \`${types[newChannel.type]}\``
          )
        }
        else if(oldChannel.topic != newChannel.topic){
          send_log(client,
            oldChannel.guild,
            "YELLOW",
            "Csatorna frissítve - TOPIC",
            `Csatorna neve: \`${oldChannel.name}\`\nCsatorna ID-je: \`${oldChannel.id}\`\nChannelTOPIC: \`${oldChannel.topic}\`\n\n`+
            `Csatorna neve: \`${newChannel.name}\`\nCsatorna ID-je: \`${newChannel.id}\`\nChannelTOPIC: \`${newChannel.topic}\``
          )
        }


      })
      client.on("emojiCreate", function (emoji) {
          send_log(client,
            emoji.guild,
            "GREEN",
            "EMOJI létrehozva",
            `EMOJI: ${emoji}\nEMOJI neve: ${emoji.name}\nEMOJI ID-je: ${emoji.id}\nEMOJI URl-je: ${emoji.url}`,
          )
      });

      client.on("emojiDelete", function (emoji) {
          send_log(client,
            emoji.guild,
            "RED",
            "EMOJI törölve",
            `EMOJI: ${emoji}\nEMOJI neve: ${emoji.name}\nEMOJI ID-je: ${emoji.id}\nEMOJI URL-je: ${emoji.url}`,
          )
      });

      client.on("emojiUpdate", function (oldEmoji, newEmoji) {
          if (oldEmoji.name !== newEmoji.name) {
            send_log(client,
              oldEmoji.guild,
              "ORANGE",
              "EMOJI NEVE CSERÉLVE",
              `__Emoji: ${newEmoji}__ \n\n**ELŐTTE:** \`${oldEmoji.name}\`\n**UTÁNA:** \`${newEmoji.name}\`\n**Emoji ID-JE:** \`${newEmoji.id}\``
            )
          }
      });

      client.on("guildBanAdd", function (guild, user) {
          send_log(client,
            guild,
            "RED",
            "FELHASZNÁLÓ KITILTVA",
            `Felhasználó: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
             member.user.displayAvatarURL({dynamic: true})
          )
      });

      client.on("guildBanRemove", function (guild, user) {
          send_log(client,
            guild,
            "YELLOW",
            "Felhasználó kitiltása felodlva",
            `Felhasználó: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
             member.user.displayAvatarURL({dynamic: true})
            )
      });

      client.on("guildMemberAdd", function (member) {
          send_log(member.guild,
             client,
             "GREEN",
             "FELHASZNÁLÓ CSATLAKOZOTT",
             `Felhasználó: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``,
              member.user.displayAvatarURL({dynamic: true})
             )
      });

      client.on("guildMemberRemove", function (member) {
          send_log(client,
            member.guild,
            "RED",
            "FELHASZNÁLÓ KILÉPETT",
            `Felhasználó neve: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``,
            member.user.displayAvatarURL({dynamic: true}))
      });

      client.on("guildMembersChunk", function (members, guild) {
          send_log(guild,
            client,
            "RED",
            "MEMBER CHUNK / RAID - " + members.length + " Members",
            members.map((user, index) => `${index}) - ${user} - ${user.tag} - \`${user.id}\``),
            )
      });

      client.on("guildMemberUpdate", function (oldMember, newMember) {
          let options = {}

          if (options[newMember.guild.id]) {
              options = options[newMember.guild.id]
          }

          // Add default empty list
          if (typeof options.excludedroles === "undefined") options.excludedroles = new Array([])
          if (typeof options.trackroles === "undefined") options.trackroles = true
          const oldMemberRoles = oldMember.roles.cache.keyArray()
          const newMemberRoles = newMember.roles.cache.keyArray()
          const oldRoles = oldMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !newMemberRoles.includes(x))
          const newRoles = newMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !oldMemberRoles.includes(x))
          const rolechanged = (newRoles.length || oldRoles.length)

          if (rolechanged) {
              let roleadded = ""
              if (newRoles.length > 0) {
                  for (let i = 0; i < newRoles.length; i++) {
                      if (i > 0) roleadded += ", "
                      roleadded += `<@&${newRoles[i]}>`
                  }
              }
              let roleremoved = ""
              if (oldRoles.length > 0) {
                  for (let i = 0; i < oldRoles.length; i++) {
                      if (i > 0) roleremoved += ", "
                      roleremoved += `<@&${oldRoles[i]}>`
                  }
              }
              let text = `${roleremoved ? `❌ RANG TÖRÖLVE: \n${roleremoved}` : ""}${roleadded ? `✅ RANG HOZZÁADVA:\n${roleadded}` : ""}`
              send_log(client,
                oldMember.guild,
                `${roleadded ? "GREEN" : "RED"}`,
                "FELHASZNÁLÓ RANGJA CSERÉLVE",
                `FELHASZNÁLÓ NEVE: ${newMember.user}\nFELHASZNÁLÓ NEVE: \`${oldMember.user.tag}\`\n\n${text}`,
                )
          }

      });

      client.on("messageDelete", function (message) {
              if (message.author.bot) return;

              if (message.channel.type !== "text") return;

              send_log(client,
                message.guild,
                "ORANGE",
                "ÜZENET TÖRÖLVE", `
**Author : ** <@${message.author.id}> - *${message.author.tag}*
**Date : ** ${message.createdAt}
**Channel : ** <#${message.channel.id}> - *${message.channel.name}*
**Deleted Message : **
\`\`\`
${message.content.replace(/`/g, "'")}
\`\`\`
**Attachment URL : **
${message.attachments.map(x => x.proxyURL)}
`,
)
      });

      client.on("messageDeleteBulk", function (messages) {
          send_log(client,
            messages.guild,
            "RED",
            messages.length + "  Message Deleted BULK",
            `${messages.length} Messages delete in: ${messages.channel}`,
          )
      });

      client.on("messageUpdate", function (oldMessage, newMessage) {
        if (oldMessage.author.bot) return;

        if (oldMessage.channel.type !== "text") return
        if (newMessage.channel.type !== "text") return

        if (oldMessage.content === newMessage.content) return
        send_log(client, oldMessage.guild,
          "YELLOW",
          "Message UPDATED",`
**Author : ** <@${newMessage.member.user.id}> - *${newMessage.member.user.tag}*
**Date : ** ${newMessage.createdAt}
**Channel : ** <#${newMessage.channel.id}> - *${newMessage.channel.name}*
**Orignal Message : **
\`\`\`
${oldMessage.content.replace(/`/g, "'")}
\`\`\`
**Updated Message : **
\`\`\`
${newMessage.content.replace(/`/g, "'")}
\`\`\``)
      });

      client.on("roleCreate", function (role) {
          send_log(client,
            role.guild,
            "GREEN",
            "ROLE CREATED",
            `ROLE: ${role}\nROLENAME: ${role.name}\nROLEID: ${role.id}\nHEXCOLOR: ${role.hexColor}\nPOSITION: ${role.position}`,
            )
      });

      client.on("roleDelete", function (role) {
          send_log(client,
            role.guild,
            "RED",
            "ROLE DELETED",
            `ROLE: ${role}\nROLENAME: ${role.name}\nROLEID: ${role.id}\nHEXCOLOR: ${role.hexColor}\nPOSITION: ${role.position}`,
            )
      });

      client.on("roleUpdate", function (oldRole, newRole) {
        let perms = {
"1": "CREATE_INSTANT_INVITE",
"2": "KICK_MEMBERS",
"4": "BAN_MEMBERS",
"8": "ADMINISTRATOR",
"16": "MANAGE_CHANNELS",
"32": "MANAGE_GUILD",
"64": "ADD_REACTIONS",
"128": "VIEW_AUDIT_LOG",
"256": "PRIORITY_SPEAKER",
"1024": "VIEW_CHANNEL",
"1024": "READ_MESSAGES",
"2048": "SEND_MESSAGES",
"4096": "SEND_TTS_MESSAGES",
"8192": "MANAGE_MESSAGES",
"16384": "EMBED_LINKS",
"32768": "ATTACH_FILES",
"65536": "READ_MESSAGE_HISTORY",
"131072": "MENTION_EVERYONE",
"262144": "EXTERNAL_EMOJIS",
"262144": "USE_EXTERNAL_EMOJIS",
"1048576": "CONNECT",
"2097152": "SPEAK",
"4194304": "MUTE_MEMBERS",
"8388608": "DEAFEN_MEMBERS",
"16777216": "MOVE_MEMBERS",
"33554432": "USE_VAD",
"67108864": "CHANGE_NICKNAME",
"134217728": "MANAGE_NICKNAMES",
"268435456": "MANAGE_ROLES",
"268435456": "MANAGE_ROLES_OR_PERMISSIONS",
"536870912": "MANAGE_WEBHOOKS",
"1073741824 ": "MANAGE_EMOJIS",
"CREATE_INSTANT_INVITE": "CREATE_INSTANT_INVITE",
"KICK_MEMBERS": "KICK_MEMBERS",
"BAN_MEMBERS": "BAN_MEMBERS",
"ADMINISTRATOR": "ADMINISTRATOR",
"MANAGE_CHANNELS": "MANAGE_CHANNELS",
"MANAGE_GUILD": "MANAGE_GUILD",
"ADD_REACTIONS": "ADD_REACTIONS",
"VIEW_AUDIT_LOG": "VIEW_AUDIT_LOG",
"PRIORITY_SPEAKER": "PRIORITY_SPEAKER",
"VIEW_CHANNEL": "VIEW_CHANNEL",
"READ_MESSAGES": "READ_MESSAGES",
"SEND_MESSAGES": "SEND_MESSAGES",
"SEND_TTS_MESSAGES": "SEND_TTS_MESSAGES",
"MANAGE_MESSAGES": "MANAGE_MESSAGES",
"EMBED_LINKS": "EMBED_LINKS",
"ATTACH_FILES": "ATTACH_FILES",
"READ_MESSAGE_HISTORY": "READ_MESSAGE_HISTORY",
"MENTION_EVERYONE": "MENTION_EVERYONE",
"EXTERNAL_EMOJIS": "EXTERNAL_EMOJIS",
"USE_EXTERNAL_EMOJIS": "USE_EXTERNAL_EMOJIS",
"CONNECT": "CONNECT",
"SPEAK": "SPEAK",
"MUTE_MEMBERS": "MUTE_MEMBERS",
"DEAFEN_MEMBERS": "DEAFEN_MEMBERS",
"MOVE_MEMBERS": "MOVE_MEMBERS",
"USE_VAD": "USE_VAD",
"CHANGE_NICKNAME": "CHANGE_NICKNAME",
"MANAGE_NICKNAMES": "MANAGE_NICKNAMES",
"MANAGE_ROLES": "MANAGE_ROLES",
"MANAGE_ROLES_OR_PERMISSIONS": "MANAGE_ROLES_OR_PERMISSIONS",
"MANAGE_WEBHOOKS": "MANAGE_WEBHOOKS",
"MANAGE_EMOJIS": "MANAGE_EMOJIS"
 }
          if (oldRole.name !== newRole.name) {
              send_log(client,
                oldRole.guild,
                 "ORANGE",
                 "ROLE NAME CHANGED",
`__ROLE: ${oldRole}__ \n\n**Before:** \`${oldRole.name}\`
**After:** \`${newRole.name}\`
**Role ID:** \`${newRole.id}\`
`)
          }

          else if (oldRole.color !== newRole.color) {
            send_log(client,
              oldRole.guild,
              "ORANGE",
              "ROLE COLOR CHANGED",
              `__ROLE: ${newRole}__ \n\n**Before:** \`${oldRole.color.toString(16)}\`
            **After:** \`${newRole.color.toString(16)}\`
            **ROLE ID:** \`${newRole.id}\``)

          }
          else {
            send_log(client,
              oldRole.guild,
              "RED",
              "ROLE PERMISSIONS CHANGED",
  `__ROLE: ${newRole}__ \n
**THE PERMISSIONS CHANGED PLEASE CHECK!!!**
OLD PERMISSIONS: ${/*perms[String(oldRole.permissions.bitfield)]*/oldRole.permissions.bitfield}
NEW PERMISSIONS: ${/*perms[String(newRole.permissions.bitfield)]*/newRole.permissions.bitfield}
**Role ID:** \`${newRole.id}\``)
          }
      });

      client.on("userUpdate", function (oldUser, newUser) {
          if(oldUser.username !== newUser.username){
              send_log(newUser.guild,
                client,
                "BLACK",
                "Member Username Changed",
                `Member: ${newUser}\nOld Username: \`${oldUser.username}\`\nNew Username: \`${newUser.username}\` `,
                )
          }
      });

    }catch (e) {
        console.log(String(e.stack).yellow)
    }
}

async function send_log(client, guild, color, title, description, thumb){
  try {
    //CREATE THE EMBED
    const LogEmbed = new Discord.MessageEmbed()
    .setColor(color ? color : "BLACK")
    .setDescription(description ? description.substr(0, 2048) : "\u200b")
    .setTitle(title ? title.substr(0, 256) : "\u200b")
    .setTimestamp()
    .setThumbnail(thumb ? thumb : guild.iconURL({format: "png"}))
    .setFooter(guild.name + " | powered by: BArni", guild.iconURL({format: "png"}))
    //GET THE CHANNEL
    const channel = await guild.channels.cache.find(channel => channel.name === 'log');
    if(!channel) throw new SyntaxError("CHANNEL NOT FOUND")
      //TRY TO GET THE WEBHOOK, BUT IF THERE IS NO WEBHOOK THEN RETURN CREATE IT
      try{
        
       
       
        channel.send(LogEmbed)
       
      }catch(err){
        console.log(err)
          
          
      }
 
    } catch(err) {
      console.log(err)
    }

    /*
       * Create a new webhook
       * The Webhooks ID and token can be found in the URL, when you request that URL, or in the response body.
       * https://discord.com/api/webhooks/12345678910/T0kEn0fw3Bh00K
       *                                  ^^^^^^^^^^  ^^^^^^^^^^^^
       *                                  Webhook ID  Webhook Token
       */
    
  }