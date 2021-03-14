const { parseHex } = require('../util/Useful');

class Embed {
    constructor(obj = {}) {
		this.type = 'rich';
        
		if (!obj) {
			this.title = null;
			this.author = {};
			this.footer = {};
			this.url = null;
			
			this.description = null;
			this.fields = [];
			
			this.image = {};
			this.thumbnail = {};
			
			this.timestamp = null;
            this.colour = null;
		} else {
            for (const key of Object.keys(obj)) {
                key = key.replace("_", "");
                const valid = ['title', 'author', 'footer', 'url', 'description', 'fields', 'image', 'thumbnail', 'timestamp', 'colour'];
                if (!valid.includes(key)) delete obj[key];
            };
			
            for (const prop of Object.keys(obj)) {
                this[prop] = obj[prop];
            };
		}
    }
    get asJSON() {
        /*let buffer = this;
        buffer['colour'] = buffer['_colour'];
        delete buffer['_colour'];*/
        return JSON.stringify(this);
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
	setAuthor(name, icon_url, url) {
		this.author.name = name;
		this.author.icon_url = icon_url;
		this.author.url = url;
	}
	setFooter(text, icon_url) {
		this.footer.text = text;
		this.footer.icon_url = icon_url;
	}
	setImage(url) {
		this.image.url = url;
	}
	setThumbnail(url) {
		this.thumbnail.url = url;
	}
	setColour(color) {
		this.colour = parseHex(color);
	}
    setColor(color) {
        // alias of setColour
        this.setColour(color);
    }
	setTimestamp(timestamp) {
		try {
			this.timestamp = new Date(timestamp || Date.now())
		} catch {
			throw new TypeError('Timestamp must be a valid date, unix timestamp, or string.')
		}
	}
	addField(name, value, inline = false) {
		this.fields.push({name: name, value: value, inline: inline});
	}

	/*get colour() {
		return this._colour 
			? `#${this._colour.toString(16).padStart(6, '0')}` : null;
    }*/

    get color() {
        return this.colour;
    }
}

module.exports = Embed;

/**
 * Example Embed

{"url":"http://placekitten.ddfddfdfcom/601/604","fields":[{"name":"Cat","value":"Cat","inline":false},{"name":"Cat","value":"Cat","inline":true},{"name":"Cat","value":"Cat","inline":true}],"timestamp":"2021-03-01T20:00:00.000Z","title":"Cat","description":"Cat","thumbnail":{"url":"http://placekitten.com/601/604"},"image":{"url":"http://placekitten.com/601/604"},"author":{"name":"Cat","url":"http://placekitten.com/601/604","icon_url":"http://placekitten.com/601/604"},"color":2105893,"footer":{"icon_url":"http://placekitten.com/601/604","text":"Cat"}}

 */