
class Check {
    /**
     * This class represents a command check.
     * You can implement this check by adding `check` (for one check) or `checks` (for multiple, via Array) in your command object.
     */
    constructor(callable, silence = false) {
        this.exec = callable;
        this.silence = silence;
    }
    static none() {
        this.exec = () => true;
        this.silence = true;
    }
    static ownerOnly() {
        this.exec = ctx => ctx.bot.owner_id === ctx.author.id;
    }
	static hasRole(role) {
		if (!role instanceof String)
			throw new TypeError('The role/role id must be a string.');
		this.exec = ctx => ctx.roles.find(r => {
			return r.name.toLowerCase() === role.toLowerCase()
				|| r.id === role
		})
	}
    static hasAnyRole(...roles) {
        this.exec = ctx => roles.map(role => ctx.roles.find(r => Check.hasRole(role)) !== undefined).includes(true);
    }
    static hasPermission(perm, status = true) {
        // check if user has permissions in channel
        return; // because things haven't been figured out yet
    }
}

module.exports = Check;