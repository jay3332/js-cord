class Role {
	constructor(guild, state, data) {
        this.id = data.id;
        this.name = data.name;
        this.guild = guild;
        this._state = state;
	}
}

module.exports = Role;