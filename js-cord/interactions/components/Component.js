module.exports = class Component {
    constructor(type, customID) {
        this.type = type;
        this.id = customID;
    }

    get customID() {
        return this.id;
    }

    static fromJSON(data) {
        return new this(data.type, data.custom_id);
    }

    toJSON() {
        return {
            type: this.type,
            custom_id: this.id
        }
    }
}