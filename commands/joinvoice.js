module.exports = {
  name: 'bruh',
  description: 'join voice',
  async execute(message, args) {
    const channel = message.guild.channels.cache.find(channel => channel.name === args[0]);
    const connection = await channel.join();
    const dispatcher = connection.play(args[1] + '.mp3');
    dispatcher.on('finish', () => {
      connection.disconnect();
    });
  },
};