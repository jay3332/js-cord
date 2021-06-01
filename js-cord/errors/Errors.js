class DiscordError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor?.name || 'DiscordError';
    }
}

class HTTPError extends DiscordError {};

function getErrors(errors, key = '') {
    let messages = [];

    for (const [k, v] of Object.entries(errors)) {
        if (k === 'message') { 
            messages.push(v);
            continue;
        }
        
        const newKey = key ? (isNaN(k) ? `${key}.${k}` : `${key}[${k}]`) : k;

        if (v._errors) {
            messages.push(`${newKey}: ${v._errors.map(e => e.message).join(' ')}`);
        } else if (v.code || v.message) {
            messages.push(`${v.code ? `${v.code}: ` : ''}${v.message}`.trim());
        } else if (typeof v === 'string') {
            messages.push(v);
        } else {
            messages = messages.concat(getErrors(v, newKey));
        }
    }

    return messages;
}

module.exports = {
    DiscordError,
    TimeoutError: class extends DiscordError {},
    BadFormat: class extends DiscordError {},
    ConstructionError: class extends DiscordError {},
    InvalidToken: class extends DiscordError {},
    HTTPError,
    APIError: class extends HTTPError {
        constructor(response, json) {
            const status = response.status;
            const statusText = response.statusText;
            const errors = getErrors(json.errors || json);
            super(`${status} ${statusText}: ${errors.join("\n")}`);
            Object.defineProperty(this, 'json', { writable: true });
            Object.defineProperty(this, 'response', { writable: true });
            
            this.json = json;
            this.status = status;
            this.statusText = statusText;
            this.errors = errors; 
            this.response = response;
        }
    }
}
