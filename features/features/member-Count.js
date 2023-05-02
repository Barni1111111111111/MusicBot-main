module.exports = (client) => {
    const channelId = '872880210478002198'
  
    const updateMembers = (guild) => {
      const channel = guild.channels.cache.get(channelId)
      if (channel) {
    
      channel.setName(`Members: ${guild.memberCount.toLocaleString()}`)
      }
    }

  
    client.on('guildMemberAdd', (member) => updateMembers(member.guild))
    client.on('guildMemberRemove', (member) => updateMembers(member.guild))
  
    const guild = client.guilds.cache.get('872517719357014016')
    updateMembers(guild)
  }