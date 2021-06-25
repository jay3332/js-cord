const SlashContext = require('../interactions/slash/SlashContext');
const { InteractionType } = require('../enums');
const { maybePromise } = require('../utils');

/**
 * Properly executes the callback function of an interaction.
 * @param {Interaction} interaction
 */
module.exports = async function handleInteraction(interaction) {
    let data;
    let client = interaction.client;

    if (data = interaction.data) {
        if (interaction.type === InteractionType.component && (data.type || data.customID)) {
            // Probably a component
            const matches = client._connection._components
                .filter(c => c.type == data.type && c.id == data.customID); 

            for (const match of matches) {
                await maybePromise(match.callback, interaction, match);
            }
        } else if (interaction.type === InteractionType.command) {
            const callbacks = client._connection._slash.filter(c => c.id == data.id);
            const command = client.cache.commands.find(c => c.id == data.id);
            const ctx = new SlashContext(interaction, command);

            for (const callback of callbacks) {
                await maybePromise(callback.callback, ctx, data.options);
            }
        }
    }
}