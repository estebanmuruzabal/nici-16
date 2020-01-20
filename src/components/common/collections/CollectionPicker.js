/**
 * Imports
 */
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Required components
import Checkbox from '../forms/Checkbox';
import FormLabel from '../forms/FormLabel';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class CollectionPicker extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./CollectionPicker.scss');
    }

    //*** View Controllers ***//

    handleCollectionChange = (collectionId) => {
        if (!this.props.checked) {
            this.props.onChange([collectionId]);
        } else if (this.props.checked.indexOf(collectionId) === -1) {
            let result = this.props.checked;
            result.push(collectionId);
            this.props.onChange(result);
        } else {
            let checked = this.props.checked;
            checked.splice(checked.indexOf(collectionId), 1);
            this.props.onChange(checked);
        }
    };

    //*** Template ***//

    render() {
        let locale = this.context.intl.locale;
        return (
            <div className="collection-picker">
                {this.props.children ?
                    <FormLabel>{this.props.children}</FormLabel>
                    :
                    null
                }
                {this.props.collections.map((collection, idx) => {
                    let name = collection.name[locale];
                    let checkboxClass = 'collection-picker__checkbox';
                    if (collection.enabled !== true) {
                        checkboxClass += ' collection-picker__checkbox--disabled';
                    }
                    return (
                        <div key={idx} className={checkboxClass}>
                            <Checkbox label={name}
                                      onChange={this.handleCollectionChange.bind(null, collection.id)}
                                      checked={this.props.checked.indexOf(collection.id) !== -1} />
                        </div>
                    );
                })}
            </div>
        );
    }
}

/**
 * Default Props
 */
CollectionPicker.defaultProps = {
    onChange: function () { debug('onChange not defined'); }
};

/**
 * Exports
 */
export default CollectionPicker;
