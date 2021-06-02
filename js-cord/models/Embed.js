const Color = require('./Color');
const File = require('./File');

/**
 * @typedef {Object} EmbedField
 * @property {string} name The field name. (title)
 * @property {string} value The field value. (description)
 * @property {boolean} inline Whether the field is inline.
 */

/**
 * Represents embedded content of a Discord message.
 * You can also construct this class to send your own embeds.
 * @param {?Object} data The raw JSON data, usually from Discord, to construct this embed with.
 */
module.exports = class Embed {
    constructor(data) {
        /**
         * The type of this embed. Usually 'rich'.
         * @type {string}
         */
        this.type = 'rich';

        /**
         * The footer for this embed. 
         * @type {?Object}
         */
        this.footer = {}

        /**
         * The author for this embed.
         * @type {?Object}
         */
        this.author = {}

        /**
         * The thumbnail for this embed.
         * @type {?Object}
         */
        this.thumbnail = {}

        /**
         * The large image for this embed.
         * @type {?Object}
         */
        this.image = {}
        
        /**
         * The video for this embed.
         * Rich embeds do not have this property.
         * @type {?Object}
         */
        this.video = {}
        
        /**
         * The embed's provider.
         * Rich embeds do not have this property.
         * @type {?Object}
         */
        this.provider = {}

        /**
         * The fields for this embed.
         * There can be up to 25 of these.
         * @type {?EmbedField[]}
         */
        this.fields = [];

        this.files = [];
        if (data) this.loadData(data);
    }

    loadData(data) {
        if (data.type) this.type = data.type;

        /**
         * The embed's title.
         * @type {?string}
         */
        this.title = data.title;

        /**
         * The embed's description.
         * @type {?string}
         */
        this.description = data.description;

        /**
         * The title's URL.
         * @type {?string}
         */
        this.url = data.url;

        /**
         * The timestamp shown on the embed.
         * @type {?Date}
         */
        this.timestamp = new Date(Date.parse(data.timestamp));
        
        /**
         * The color of the embed.
         * @type {?Color}
         */
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
    
    /**
     * An alias for {@link Embed#color}.
     */
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
     * Sets the title's URL.
     * @param {string} url The new URL of this embed.
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
     * An alias for {@link Embed#setColor}.
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
     * Adds a field to this embed.
     * @param {string} name The name [title] of this field.
     * @param {string} value The value [description] of this field. 
     * @param {?boolean} inline Whether or not this field is inline or not.
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
     * Overwrites an already existing field.
     * @param {number} index The index of the field to overwrite. 
     * @param {string} name The new name [title] of this field.
     * @param {string} value The new value [description] of this field. 
     * @param {?boolean} inline Whether or not this field is inline or not.
     * @returns {Embed}
     */
    setField(index, name, value, inline) {
        this.fields[index] = this.#craftField(name, value, inline);
        return this;
    }

    /**
     * Splices the embed fields.
     * @param {number} index The index to start splicing from.
     * @param {number} remove The amount of fields to remove at this index. 
     * @param {string} name The name [title] of this field.
     * @param {string} value The value [description] of this field. 
     * @param {?boolean} inline Whether or not this field is inline or not. 
     * @returns {Embed}
     */
    spliceField(index, remove, name, value, inline) {
        this.fields.splice(index, remove, this.#craftField(name, value, inline));
        return this;
    }

    /**
     * Inserts a new field at the given index.
     * @param {number} index The index to insert the field at.
     * @param {string} name The name [title] of this field.
     * @param {string} value The value [description] of this field. 
     * @param {?boolean} inline Whether or not this field is inline or not.
     * @returns {Embed}
     */
    insertField(index, name, value, inline) {
        this.fields.splice(index, 0, this.#craftField(name, value, inline));
        return this;
    }

    /**
     * Removes all the embed fields, essentially setting the fields to an empty array.
     * @returns {Embed}
     */
    clearFields() {
        this.fields = [];
        return this;
    }
    
    /**
     * Pops a field from this embed.
     * @return {?EmbedField} The field that was popped.
     */
    popField() {
        return this.fields.pop();
    }

    /**
     * Removes the first field from the embed.
     * @returns {?EmbedField} The field that was shifted.
     */
    shiftField() {
        return this.fields.shift();
    }

    /**
     * Swaps a field with another one.
     * @param {number} index The index to swap.
     * @param {number} otherIndex The other index to swap with.
     * @returns {Embed}
     */
    swapField(index, otherIndex) {
        [this.fields[index], this.fields[otherIndex]] = [this.fields[otherIndex], this.fields[index]];
        return this;
    }

    /**
     * Finds a field in this embed based on it's name.
     * @param {string} name The name [title] of the field to find.
     * @returns {?EmbedField} The field found, if any.
     */
    findField(name) {
        return this.fields.find(field => field.name == name);
    }

    /**
     * Completely overwrites the embed's fields with new ones.
     * @param {EmbedField[]} fields The new fields for the embed.
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
     * Sets and overwrites the current footer of this embed.
     * @param {string} text The text of the footer.
     * @param {?string} iconURL The icon URL of the footer.
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
     * @param {string | File} url The thumbnail URL.
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
     * Sets the large image of this embed.
     * @param {string | File} url The image URL of the new image.
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
     * Turns this embed into a JSON object.
     * Note: This only takes into account rich embeds.
     * @return {object}
     */
    toJSON() {
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
