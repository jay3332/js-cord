module.exports = {
    Bot: require('./Bot'),
    View: require('./View'),
    Command: require('./models/Command'),
    Context: require('./models/Context'),
    ...require('./Errors')
}