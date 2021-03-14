class ConnectionError extends Error {
	constructor(...args) {
		super(...args);
	}
};

class InvalidEventError extends Error {
	constructor(...args) {
		super(...args);
	}
};

class ConstructionError extends Error {
	constructor(...args) {
		super(...args);
	}
}

class GuildOnlyError extends Error {
    constructor(...args) {
        super(...args);
    }
}

class CheckError extends Error {
    constructor(...args) {
        super(...args);
    }
}

class PermissionError extends Error {
    constructor(...args) {
        super(...args);
    }
}

module.exports = { 
    ConnectionError, InvalidEventError, ConstructionError,
    GuildOnlyError,  CheckError,        PermissionError 
}