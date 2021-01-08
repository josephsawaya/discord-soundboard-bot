module.exports = {
  name: 'shutdown',
  description: 'Shutdown bot',
  async execute(message, args) {
    message.client.destroy();
  },
}