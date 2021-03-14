const INTENT_FLAG_VALUES = {
    guilds: 1 << 0,
    members: 1 << 1,
    bans: 1 << 2,
    emojis: 1 << 3,
    integrations: 1 << 4,
    webhooks: 1 << 5,
    invites: 1 << 6,
    voice: 1 << 7,
    presences: 1 << 8,
    messages: (1 << 9) | (1 << 12),
    reactions: (1 << 10) | (1 << 13),
    typing: (1 << 11) | (1 << 14),
    guild_messages: 1 << 9,
    guild_reactions: 1 << 10,
    guild_typing: 1 << 11,
    dm_messages: 1 << 12,
    dm_reactions: 1 << 13,
    dm_typing: 1 << 14
}

module.exports = { INTENT_FLAG_VALUES }