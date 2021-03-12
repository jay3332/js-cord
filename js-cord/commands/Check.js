
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
        const exec = () => true;
        return Check(exec, true);
    }
    static ownerOnly(silence = false) {
        const exec = ctx => ctx.bot.owner_id === ctx.author.id;
        return Check(exec, silence);
    }
	static hasRole(role, silence) {
		if (!role instanceof String)
			throw new TypeError('The role/role id must be a string.');
		const exec = ctx => ctx.roles.find(r => {
			return r.name.toLowerCase() === role.toLowerCase()
				|| r.id === role
		});
        return Check(exec, silence)
	}
    static hasAnyRole(...roles) {
        const exec = ctx => roles.map(role => ctx.roles.find(r => Check.hasRole(role)) !== undefined).includes(true);
        return Check(exec)
    }
    static hasPermission(perm, status = true) {
        // check if user has permissions in channel
        return; // because things haven't been figured out yet
    }
    static hasAnyPermission(...perms) {
        return;
    }
}

module.exports = Check;