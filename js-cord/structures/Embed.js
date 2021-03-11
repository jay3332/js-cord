const { Colors } = require('../util/Useful');

export class Embed {
    constructor(obj = {}) {
		this.type = 'rich';
        this.title = null;
		this.url = null;
        this.description = null;
		this.fields = [];
		this.author = {};
		this.image = {};
		this.footer = {};
		this.timestamp = null;
		this.color = null;
    }
    setTitle(title) {
        this.title = title;
    }
	setDescription(description) {
		this.description = description;
	}
	setUrl(url) {
		this.url = url;
	}
	setColor(color) {
		if (typeof color === string) {
			if (color.toUpperCase() === 'RANDOM')
				color = Math.floor(Math.random() * (0xffffff + 1));
			else if (color.toUpperCase() === 'DEFAULT')
				color = 0
			
		}
		else throw new TypeError('Embed color must be a valid hex color or integer.');
	}
	setTimestamp(timestamp = Date.now()) {
		try {
			this.timestamp = new Date(timestamp)
		} catch {
			throw new TypeError('Timestamp must be a valid date, unix timestamp, or string.')
		} 
	}

	get color() {
		return this.color 
			? `#${this.color.toString(16).padStart(6, '0')}` : null;
	}
}

/**
 * Example Embed

{"url":"http://placekitten.ddfddfdfcom/601/604","fields":[{"name":"Cat","value":"Cat","inline":false},{"name":"Cat","value":"Cat","inline":true},{"name":"Cat","value":"Cat","inline":true}],"timestamp":"2021-03-01T20:00:00.000Z","title":"Cat","description":"Cat","thumbnail":{"url":"http://placekitten.com/601/604"},"image":{"url":"http://placekitten.com/601/604"},"author":{"name":"Cat","url":"http://placekitten.com/601/604","icon_url":"http://placekitten.com/601/604"},"color":2105893,"footer":{"icon_url":"http://placekitten.com/601/604","text":"Cat"}}

 */