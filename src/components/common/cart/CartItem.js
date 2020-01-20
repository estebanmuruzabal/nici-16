/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

// Flux
import triggerDrawer from '../../../actions/Application/triggerDrawer';

// Required components
import QuantitySelector from '../forms/QuantitySelector';
import Text from '../typography/Text';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class CartItem extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        placeholderImage: undefined
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./CartItem.scss');

        // Load static files
        this.setState({placeholderImage: require('../images/image_placeholder.png')});
    }

    //*** View Controllers ***//

    handleLinkClick = () => {
        this.context.executeAction(triggerDrawer, null);
    };

    //*** Template ***//

    render() {

        let product = this.props.product.details;
        let locale = this.context.intl.locale;

        return (
            <div className="cart-item">
                <div className="cart-item__frame">
                    <Link className="cart-item__link"
                          to={`/${locale}/products/${product.id}`}
                          onClick={this.handleLinkClick}>
                        <img className="cart-item__image" src={product.images && product.images.length > 0 ? `//${product.images[0].url}` : this.state.placeholderImage} />
                    </Link>
                </div>
                <div className="cart-item__details">
                    <div className="name">
                        <Text size="small">
                            <Link className="cart-item__link"
                                  to={`/${locale}/products/${product.id}`}
                                  onClick={this.handleLinkClick}>
                                  {product.name[locale]}
                            </Link>
                        </Text>
                    </div>
                    <div className="cart-item__price">
                        <Text size="small" weight="bold">
                            <FormattedNumber value={product.pricing.retail}
                                             style="currency"
                                             currency={product.pricing.currency} />
                        </Text>
                    </div>
                    <div className="cart-item__quantity">
                        <QuantitySelector value={this.props.product.quantity}
                                          onChange={this.props.onQuantityChange} />
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Default Props
 */
CartItem.defaultProps = {
    onQuantityChange: function (value) { debug(`onQuantityChange not defined. Value: ${value}`); }
};

/**
 * Exports
 */
export default CartItem;
