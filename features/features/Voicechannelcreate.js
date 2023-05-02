module.exports = (client) => {
    const { Collection } = require('discord.js');
    const voiceCollection = new Collection();
  
    client.on("voiceStateUpdate", async (oldState, newState) => {
      const user = await client.users.fetch(newState.userId);
      const member = newState.guild.members.cache.get(user.id);
  
      if (!oldState.channel && newState.channelId === "1102658083227963432") {
        const channel = await newState.guild.channels.create(user.tag, {
          type: 'GUILD_VOICE',
          parent: newState.channel.parentId,
        });
        member.voice.setChannel(channel);
        voiceCollection.set(user.id, channel.id);
      } else if (!newState.channel) {
        if (oldState.channelId === voiceCollection.get(newState.userId)) {
          const channel = await client.channels.fetch(oldState.channelId);
          channel.delete();
        }
      }
    });
  };
  