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
    }
}