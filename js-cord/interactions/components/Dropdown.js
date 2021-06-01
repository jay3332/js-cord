const Component = require('./Component');
const DropdownOption = require('./DropdownOption');
const { urandom } = require('../../utils');


module.exports = class Dropdown extends Component {
    constructor({
        placeholder,
        id,
        minValues = 1,
        maxValues = 1,
        options = []
    } = {}, callback) {
        if (!id) id = urandom(32).toString(16); 
    
        super(3, id);
        this.placeholder = placeholder;
        this.minValues = minValues;
        this.maxValues = maxValues;
        this.options = options.some(o => o instanceof DropdownOption)
            ? options : options.map(o => DropdownOption.fromJSON(o));

        this.callback = callback || (() => {});
    }

    addOption(options, callback) {
        if (options instanceof DropdownOption) {
            this.options.push(options);
            return this
        }
        this.options.push(new DropdownOption(options, callback));
        return this
    }

    toJSON() {
        return {
            type: 3,
            placeholder: this.placeholder,
            custom_id: this.id,
            min_values: this.minValues,
            max_values: this.maxValues,
            options: this.options.map(o => o.toJSON())
        };
    }
}
