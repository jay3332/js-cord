class CooldownError extends Error {
    constructor(command, timeLeft, defaultCooldown) {
        this.command = command;
        this.timeLeft = timeLeft;
        this.defaultCooldown = defaultCooldown;
    }
    get secondsLeft() {
        return Math.ceil(this.timeLeft/1000)
    }
}