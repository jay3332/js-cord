class Cooldown {
    /**
     * Represents a command cooldown.
     */
    constructor(rate, cooldown, type = "user") {
        this.rate = rate;
        this.cooldown = cooldown;
        this.type = type;
    }
}
