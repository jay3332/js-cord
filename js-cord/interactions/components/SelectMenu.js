const Component = require('./Component');
const SelectOption = require('./SelectOption');
const { urandom } = require('../../utils');


module.exports = class SelectMenu extends Component {
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
        this.options = options.some(o => o instanceof SelectOption)
            ? options : options.map(o => DropdownOption.fromJSON(o));

        this.callback = callback || (() => {});
    }

    addOption(options, callback) {
        if (options instanceof SelectOption) {
            this.options.push(options);
            return this
        }
        this.options.push(new SelectOption(options, callback));
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
