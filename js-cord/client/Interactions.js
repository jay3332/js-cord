const { ComponentType } = require('../enums');
const { maybePromise } = require('../utils');

module.exports = async function handleInteraction(interaction) {
    let data;
    let client = interaction.client;

    if (data = interaction.data) {
        if (data.type || data.customID) {
            // Probably a component
            const matches = client._components
                .filter(c => c.type == data.type && c.id == data.customID); 
            
            for (const match of matches) {
                await maybePromise(match.callback, interaction);
            }
        }
    }
}