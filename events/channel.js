const config = require("../config.js");
const { EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");
const fs = require("fs");

let channelNumber = 1; // Az új csatornák számát tároló változó

module.exports = async (client, oldState, newState) => {
  if (newState.channel?.id === '1102658083227963432') { // Csak akkor folytatódik a kód, ha az új állapot az adott hangcsatornához tartozik
    const category = newState.channel.parent; // Az új csatorna kategóriája
    const guild = newState.guild;
    const channelName = `Hangcsatorna ${channelNumber} by Jn`; // Az új csatorna neve
    const voiceChannel = await guild.channels.create(channelName, { // Létrehozzuk az új hangcsatornát
      type: 'GUILD_VOICE',
      parent: category,
      userLimit: 5, // Az elsődleges hangcsatornához hasonlóan beállítjuk a felhasználói limitet
    });

    await newState.setChannel(voiceChannel); // Átrakjuk a csatlakozó embert az új csatornába

    channelNumber++; // Növeljük az új csatornák számát

    // Töröljük az üres csatornákat
    category.children.forEach(channel => {
      if (channel.type === 'GUILD_VOICE' && channel.members.size === 0) {
        channel.delete();
      }
    });
  }
};
