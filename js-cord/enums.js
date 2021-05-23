module.exports = {
    ChannelType: {
        text: 0,
        dm: 1,
        voice: 2,
        group: 3,
        category: 4,
        news: 5,
        store: 6,
        newsThread: 10,
        publicThread: 11,
        privateThread: 12,
        stage: 13
    },

    MessageType: {
        default: 0,
        recipientAdd: 1,
        recipientRemove: 2,
        call: 3,
        channelNameUpdate: 4,
        channelIconUpdate: 5,
        pinned: 6,
        memberJoin: 7,
        boost: 8,
        boostLevel1: 9,
        boostLevel2: 10,
        boostLevel3: 11,
        channelFollow: 12,
        discoveryDisqualified: 13,
        discoveryRequalified: 14,
        discoveryGracePeriodInitialWarning: 15,
        discoveryGracePeriodFinalWarning: 16,
        threadCreate: 17,
        reply: 18,
        applicationCommand: 19,
        threadStarterMessage: 20,
        guildInviteReminder: 21
    },

    MessageActivityType: {
        join: 1,
        spectate: 2,
        listen: 3,
        request: 5
    },

    StickerFormatType: {
        png: 1,
        apng: 2,
        lottie: 3
    },

    AuditLogEvent: {
        guildUpdate: 1,
        channelCreate: 10,
        channelUpdate: 11,
        channelDelete: 12,
        channelOverwriteCreate: 13,
        channelOverwriteUpdate: 14,
        channelOverwriteDelete: 15,
        memberKick: 20,
        memberPrune: 21,
        memberBan: 22,
        memberUnban: 23,
        memberUpdate: 24,
        memberRoleUpdate: 25,
        memberMove: 26,
        memberDisconnect: 27,
        botAdd: 28,
        roleCreate: 30,
        roleUpdate: 31,
        roleDelete: 32,
        inviteCreate: 40,
        inviteUpdate: 41,
        inviteDelete: 42,
        webhookCreate: 50,
        webhookUpdate: 51,
        webhookDelete: 52,
        emojiCreate: 60,
        emojiUpdate: 61,
        emojiDelete: 62,
        messageDelete: 72,
        messageBulkDelete: 73,
        messagePin: 74,
        messageUnpin: 75,
        integrationCreate: 80,
        integrationUpdate: 81,
        integrationDelete: 82
    }
}