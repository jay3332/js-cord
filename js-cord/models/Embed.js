const Color = require('./Color');
const File = require('./File');


/**
 * Represents embedded content of a Discord message.
 * You can also construct this class to send your own embeds.
 * 
 * Use `attachment://filename.extension` to send an instance of a {@link File}, for example `attachment://image.png`.
 * Only usable in thumbnail, image, and author/footer icons.
 * @param {?Object} data The raw JSON data, usually from Discord, to construct this embed with.
 */
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

    /**
     * Sets the embed title.
     * @param {string} title The embed's new title.
     * @param {?string} url The embed title's new hyperlink.
     * @returns {Embed}
     */
    setTitle(title, url) {
        this.title = title;
        if (url) this.url = url;
        return this;
    } 

    /**
     * Sets the embed description.
     * @param {string} description The embed's new description.
     * @returns {Embed}
     */
    setDescription(description) {
        this.description = description;
        return this;
    }

    /**
     * Appends a string with a new line to the existing description.
     * @param {string} description The string to append.
     * @returns {Embed}
     */
    appendDescription(description) {
        if (!this.description) 
            this.description = '';
        this.description += '\n' + description;
        return this;
    }

    /**
     * An alias for the second parameter of {@link Embed#setTitle}.
     * @param {string} url The embed title's new hyperlink.
     * @returns {Embed}
     */
    setURL(url) {
        this.url = url;
        return this;
    }

    /**
     * Sets the embed color.
     * @param {number | string | Color} color The embed's new color.
     * @returns {Embed}
     */
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
        return this;
    }

    /**
     * Sets the embed color.
     * @param {number | string | Color} color The embed's new color.
     * @returns {Embed}
     */
    setColour(colour) {
        return this.setColor(colour);
    }

    /**
     * Sets the embed timestamp.
     * @param {?Date | ?Number} timestamp The embed's new timestamp.
     * @returns {Embed}
     */
    setTimestamp(timestamp) {
        timestamp = timestamp || new Date(Date.now());
        if (typeof timestamp === 'number')
            timestamp = new Date(timestamp);
        this.timestamp = timestamp;
        return this;
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
        };
    } 

    /**
     * Adds a field to the embed.
     * @param {string} name The embed field name.
     * @param {string} value The content of the field.
     * @param {boolean} inline Whether the field should be inline.
     * @returns {Embed}
     */
    addField(name, value, inline) {
        this.fields.push(this.#craftField(name, value, inline));
        return this;
    }

    /**
     * Removes a field from the embed.
     * @param {number} index The index of the field to remove.
     * @returns {Embed}
     */
    removeField(index) {
        this.fields.splice(index, 1);
        return this;
    }

    /**
     * Sets a field at a specific index.
     * @param {number} index The index for the field.
     * @param {string} name The embed field name.
     * @param {string} value The content of the field.
     * @param {boolean} inline Whether the field should be inline.
     * @returns {Embed}
     */
    setField(index, name, value, inline) {
        this.fields[index] = this.#craftField(name, value, inline);
        return this;
    }

    /**
     * Splices a field. See [Array.prototype.splice]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice}.
     * @param {number} index The index to start splicing at.
     * @param {number} remove The amount of fields to replace.
     * @param {string} name The embed field name.
     * @param {string} value The content of the field.
     * @param {boolean} inline Whether the field should be inline.
     * @returns {Embed}
     */
    spliceField(index, remove, name, value, inline) {
        this.fields.splice(index, remove, this.#craftField(name, value, inline));
        return this;
    }

    /**
     * Inserts a field at an index.
     * @param {number} index The index to insert a field at.
     * @param {string} name The embed field name.
     * @param {string} value The content of the field.
     * @param {boolean} inline Whether the field should be inline.
     * @returns {Embed}
     */
    insertField(index, name, value, inline) {
        this.fields.splice(index, 0, this.#craftField(name, value, inline));
        return this;
    }

    /**
     * Resets the embed fields, essentially setting the fields to an empty array.
     * @returns {Embed}
     */
    clearFields() {
        this.fields = [];
        return this;
    }
    
    /**
     * Removes the last field from the embed.
     * @returns {Embed}
     */
    popField() {
        this.fields.pop();
        return this;
    }

    /**
     * Removes the first field from the embed.
     * @returns {Embed}
     */
    shiftField() {
        this.fields.shift();
        return this;
    }

    /**
     * Swaps 2 fields' positions.
     * @param {number} index An index of a field.
     * @param {number} otherIndex Another index of a field.
     * @returns {Embed}
     */
    swapField(index, otherIndex) {
        [this.fields[index], this.fields[otherIndex]] = [this.fields[otherIndex], this.fields[index]];
        return this;
    }

    /**
     * Finds an embed fields by field name/title.
     * @param {string} name The field name.
     * @returns {Object}
     */
    findField(name) {
        return this.fields.find(field => field.name == name);
    }

    /**
     * Completely overwrites the embed's fields with new ones.
     * @param {Object[]} fields The new fields for the embed.
     * @returns {Embed}
     */
    setFields(fields) {
        this.fields = fields;
        return this;
    }

    #buildFooter(text, iconURL) {
        if (text instanceof Object) {
            iconURL = text.iconURL;
            text = text.text;
        }

        return [text, iconURL]
    }

    /**
     * Sets the embed's footer.
     * @param {string} text The footer's text.
     * @param {string} iconURL The URL of the footer icon.
     * @returns {Embed}
     */
    setFooter(text, iconURL) {
        [ text, iconURL ] = this.#buildFooter(text, iconURL);

        this.footer = {
            text: text || this.footer.text,
            iconURL: iconURL || this.footer.iconURL
        }
        return this;
    }

    /**
     * Sets the embed's footer text.
     * @param {string} text The footer's text.
     * @returns {Embed}
     */
    setFooterText(text) {
        return this.setFooter(text);
    }

    /**
     * Sets the footer icon's URL.
     * @param {string} iconURL The footer icon's URL.
     * @returns {Embed}
     */
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

    /**
     * Sets the author field of the embed.
     * @param {string} name The author field's name.
     * @param {string} iconURL The author field's icon URL.
     * @param {string} url The author field's hyperlink.
     * @returns {Embed}
     */
    setAuthor(name, iconURL, url) {
        [ name, iconURL, url ] = this.#buildAuthor(name, iconURL, url);

        this.author = {
            name: name || this.author.name,
            iconURL: iconURL || this.author.iconURL,
            url: url || this.author.url
        }
        return this;
    }

    /**
     * Sets the name of the embed's author field.
     * @param {string} name The author field's name.
     * @returns {Embed}
     */
    setAuthorName(name) {
        return this.setAuthor(name);
    }

    /**
     * Sets the embed author's icon.
     * @param {string} iconURL The author field's icon.
     * @returns {Embed}
     */
    setAuthorIconURL(iconURL) {
        return this.setAuthor(undefined, iconURL);
    }

    /**
     * Sets the embed author's hyperlink.
     * @param {string} url The author field's hyperlink.
     * @returns {Embed}
     */
    setAuthorURL(url) {
        return this.setAuthor(undefined, undefined, url);
    }

    /**
     * Sets the embed thumbnail.
     * @param {string} url The thumbnail URL.
     * @returns {Embed}
     */
    setThumbnail(url) {
        if (url instanceof File) {
            this.files.push(url);
            url = `attachment://${url.filename}`
        }
        this.thumbnail.url = url;
        return this;
    }

    /**
     * Sets the embed image.
     * @param {string} url The image URL.
     * @returns {Embed}
     */
    setImage(url) {
        if (url instanceof File) {
            this.files.push(url);
            url = `attachment://${url.filename}`
        }
        this.image.url = url;
        return this;
    }

    /**
     * Returns the JSON representation of this embed.
     * @returns {Object}
     */
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
                    icon_url: this.footer.iconURL || null
                } : null,
            author: Object.keys(this.author).length
                ? {
                    name: this.author.name || null,
                    icon_url: this.author.iconURL || null,
                    url: this.author.url || null
                } : null,
            image: this.image ? { url: this.image.url } : null,
            thumbnail: this.thumbnail ? { url: this.thumbnail.url } : null,
            fields: this.fields
        }
    }
}
