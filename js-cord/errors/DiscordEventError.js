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

module.exports = { ConnectionError, InvalidEventError, ConstructionError }