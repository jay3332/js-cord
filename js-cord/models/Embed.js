const Color = require('./Color');
const File = require('./File');

module.exports = class Embed {
    constructor(data) {
        this.type = 'rich';
        this.footer = {}
        this.author = {}
        this.thumbnail = {}
        this.image = {}
        this.video = {}
        this.provider = {}
        this.fields = [];
        this.files = [];

        if (data) this.loadData(data);
    }

    loadData(data) {
        if (data.type) this.type = data.type;

        this.title = data.title;
        this.description = data.description;
        this.url = data.url;
        this.timestamp = new Date(Date.parse(data.timestamp));
        this.color = new Color(data.color || 0);
        this.fields = data.fields ? data.fields : [];

        if (data.footer) {
            this.footer = {
                text: data.footer.text,
                iconURL: data.footer.icon_url,
                proxyIconURL: data.footer.proxy_icon_url,
                toString() {
                    return data.footer.text
                }
            }
        }

        if (data.author) {
            this.author = {
                name: data.author.name,
                iconURL: data.author.icon_url,
                proxyIconURL: data.author.proxy_icon_url,
                url: data.author.url,
                toString() {
                    return data.author.name
                }
            }
        }

        if (data.thumbnail) {
            this.thumbnail = {
                url: data.thumbnail.url,
                proxyURL: data.thumbnail.proxy_url,
                height: data.thumbnail.height,
                width: data.thumbnail.width,
                toString() {
                    return data.thumbnail.url;
                }
            }
        }

        if (data.image) {
            this.image = {
                url: data.image.url,
                proxyURL: data.image.proxy_url,
                height: data.image.height,
                width: data.image.width,
                toString() {
                    return data.image.url;
                }
            }
        }

        if (data.video) {
            this.video = {
                url: data.video.url,
                proxyURL: data.video.proxy_url,
                height: data.video.height,
                width: data.video.width,
                toString() {
                    return data.video.url;
                }
            }
        }

        if (data.provider) 
            this.provider = data.provider;
    }
    
    get colour() {
        return this.color;
    }

    setTitle(title, url) {
        this.title = title;
        if (url) this.url = url;
        return this
    } 

    setDescription(description) {
        this.description = description;
        return this
    }

    appendDescription(description) {
        if (!this.description) 
            this.description = '';
        this.description += '\n' + description;
        return this
    }

    setURL(url) {
        this.url = url;
        return this
    }

    setColor(color) {
        if (typeof color === 'number')
            color = new Color(color);

        else if (typeof color == 'string') {
            let oldColor = color;
            color = Color[color];

            if (!color) color = Color.fromHex(oldColor);
            else { color = color() }
        }

        this.color = color;
        return this
    }

    setColour(colour) {
        return this.setColor(colour);
    }

    setTimestamp(timestamp) {
        timestamp = timestamp || new Date(Date.now());
        if (typeof timestamp === 'number')
            timestamp = new Date(timestamp);
        this.timestamp = timestamp;
        return this
    }

    #craftField(name, value, inline = true) {
        if (name instanceof Object) {
            value = name.value;
            inline = name.inline || true;
            name = name.name;
        }

        return {
            name: name,
            value: value,
            inline: inline
        }
    } 

    addField(name, value, inline) {
        this.fields.push(this.#craftField(name, value, inline));
        return this
    }

    removeField(index) {
        this.fields.splice(index, 1);
        return this
    }

    setField(index, name, value, inline) {
        this.fields[index] = this.#craftField(name, value, inline);
        return this
    }

    spliceField(index, remove, name, value, inline) {
        this.fields.splice(index, remove, this.#craftField(name, value, inline));
        return this
    }

    insertField(index, name, value, inline) {
        this.fields.splice(index, 0, this.#craftField(name, value, inline));
        return this
    }

    clearFields() {
        this.fields = [];
        return this
    }
    
    popField() {
        return this.fields.pop();
    }

    shiftField() {
        this.fields.shift();
        return this
    }

    swapField(index, otherIndex) {
        [this.fields[index], this.fields[otherIndex]] = [this.fields[otherIndex], this.fields[index]];
        return this
    }

    findField(name) {
        return this.fields.find(field => field.name == name);
    }

    setFields(fields) {
        this.fields = fields;
        return this
    }

    #buildFooter(text, iconURL) {
        if (text instanceof Object) {
            iconURL = text.iconURL;
            text = text.text;
        }

        return [text, iconURL]
    }

    setFooter(text, iconURL) {
        [ text, iconURL ] = this.#buildFooter(text, iconURL);

        this.footer = {
            text: text || this.footer.text,
            iconURL: iconURL || this.footer.iconURL
        }
        return this
    }

    setFooterText(text) {
        return this.setFooter(text);
    }

    setFooterIconURL(iconURL) {
        return this.setFooter(undefined, iconURL);
    } 

    #buildAuthor(name, iconURL, url) {
        if (name instanceof Object) {
            iconURL = name.iconURL;
            url = name.url;
        } else if (iconURL instanceof Object &&
                   typeof name === 'string') {
            url = iconURL.url;
            iconURL = iconURL.iconURL;
        }

        return [ name, iconURL, url ]
    }

    setAuthor(name, iconURL, url) {
        [ name, iconURL, url ] = this.#buildAuthor(name, iconURL, url);

        this.author = {
            name: name || this.author.name,
            iconURL: iconURL || this.author.iconURL,
            url: url || this.author.url
        }
        return this
    }

    setAuthorName(name) {
        return this.setAuthor(name);
    }

    setAuthorIconURL(iconURL) {
        return this.setAuthor(undefined, iconURL);
    }

    setAuthorURL(url) {
        return this.setAuthor(undefined, undefined, url);
    }

    setThumbnail(url) {
        if (url instanceof File) {
            this.files.push(url);
            url = `attachment://${url.filename}`
        }
        this.thumbnail.url = url;
        return this
    }

    setImage(url) {
        if (url instanceof File) {
            this.files.push(url);
            url = `attachment://${url.filename}`
        }
        this.image.url = url;
        return this
    }

    toJSON() {
        /**
         * Note: This only takes into account rich embeds.
         */

        return {
            type: this.type || 'rich',
            title: this.title || null,
            description: this.description || null,
            url: this.url || null,
            timestamp: this.timestamp ? this.timestamp.toISOString() : null,
            color: this.color ? this.color.value : null,
            footer: Object.keys(this.footer).length 
                ? {
                    name: this.footer.name || null,
                    iconURL: this.footer.iconURL || null
                } : null,
            author: Object.keys(this.author).length
                ? {
                    name: this.author.name || null,
                    iconURL: this.author.iconURL || null,
                    url: this.author.url || null
                } : null,
            image: this.image.url ? this.image : null,
            thumbnail: this.thumbnail.url ? this.thumbnail : null,
            fields: this.fields
        }
    }
}