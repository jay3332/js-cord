class Cooldown {
    /**
     * Represents a command cooldown.
     */
    constructor(rate, cooldown, type = "user") {
        this.rate = rate;
        this.cooldown = cooldown;
        this.type = type;
    }

    static none() {
        return new Cooldown(1, 0);
    }

    static user(rate, cooldown) {
        return new Cooldown(rate, cooldown, "user");
    }

    static channel(rate, cooldown) {
        return new Cooldown(rate, cooldown, "channel")
    }
    
    static guild(rate, cooldown) {
        return new Cooldown(rate, cooldown, "guild");
    }

    static global(rate, cooldown) {
        return new Cooldown(rate, cooldown, "global");
    }
}

module.exports = Cooldown;