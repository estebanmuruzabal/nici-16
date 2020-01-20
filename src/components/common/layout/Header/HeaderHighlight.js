/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Flux
import IntlStore from '../../../../stores/Application/IntlStore';

// Required components
import Text from '../../typography/Text';

/**
 * Component
 */
class HeaderHighlight extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./HeaderHighlight.scss');
    }

    //*** Template ***//

    render() {
        let intlStore = this.context.getStore(IntlStore);
        return (
            <div className="header-highlight">
                <div className="header-highlight__shipping-icon">
                    <i className="fa fa-truck" aria-hidden="true" />
                </div>
                <div className="header-highlight__shipping-text">
                    <Text size="small" weight="bold">
                        <FormattedMessage id="freeShipping" />
                        &nbsp;
                        <FormattedNumber value="19.90"
                                         style="currency"
                                         currency="EUR" />
                    </Text>
                </div>
            </div>
        );
    }
}

/**
 * Exports
 */
export default HeaderHighlight;
