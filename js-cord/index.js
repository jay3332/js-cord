/**
 * js-cord
 * =======
 * All properties should follow camelCase.
 * The last word should be all uppercase if it is `ID`, `URL` 
 *                          ... or another short abbreviation.
 * 
 * E.g.: jumpURL, channelID, someOtherMethod
 */

module.exports = {
    Client: require('./client/Client'),

    Asset: require('./models/Asset'),
    User: require('./models/User'),

    loggers: require('./loggers'),
    constants: require('./constants'),
    utils: require('./utils')
}
