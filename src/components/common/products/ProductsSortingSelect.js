/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Required components
import Select from '../forms/Select';
import Text from '../typography/Text';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class ProductsSortingSelect extends React.Component {

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ProductsSortingSelect.scss');
    }

    //*** Template ***//

    render() {

        // Sorting Options
        var sortOptions = [
            /*{
             name: this.context.intl.formatMessage({id: "sortFeatured"}),
             value: 'featured'
             },
             {
             name: this.context.intl.formatMessage({id: "sortBestSelling"}),
             value: 'best-selling'
             },*/
            {
                name: this.context.intl.formatMessage({id: "sortAlphabetically"}),
                value: 'alphabetically'
            },
            {
                name: this.context.intl.formatMessage({id: "sortAlphabeticallyReverse"}),
                value: '-alphabetically'
            },
            {
                name: this.context.intl.formatMessage({id: "sortPrice"}),
                value: 'price'
            },
            {
                name: this.context.intl.formatMessage({id: "sortPriceReverse"}),
                value: '-price'
            },
            {
                name: this.context.intl.formatMessage({id: "sortRecent"}),
                value: '-date'
            },
            {
                name: this.context.intl.formatMessage({id: "sortOldest"}),
                value: 'date'
            }
        ];

        return (
            <div className="products-sorting-select">
                <div className="products-sorting-select__label">
                    <Text size="small" weight="bold">
                        <FormattedMessage id="sortLabel" />
                    </Text>
                </div>
                <div className="products-sorting-select__options">
                    <Select size="small"
                            options={sortOptions}
                            placeholder
                            onChange={this.props.onChange} />
                </div>
            </div>
        );
    }
}

/**
 * Default Props
 */
Select.defaultProps = {
    onChange: function (value) { debug(`onChange not defined. Value: ${value}`); }
};

/**
 * Exports
 */
export default ProductsSortingSelect;