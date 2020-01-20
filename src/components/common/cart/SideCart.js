/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, FormattedNumber, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

// Flux
import CartStore from '../../../stores/Cart/CartStore';

import addToCart from '../../../actions/Cart/addToCart';
import triggerDrawer from '../../../actions/Application/triggerDrawer';

// Required components
import Button from '../buttons/Button';
import CartItem from './CartItem';
import Heading from '../typography/Heading';
import Text from '../typography/Text';

/**
 * Component
 */
class SideCart extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        cart: this.context.getStore(CartStore).getCart(),
        cartLoading: this.context.getStore(CartStore).isLoading()
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./SideCart.scss');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            cart: nextProps._cart,
            cartLoading: nextProps._cartLoading
        });
    }

    //*** View Controllers ***//

    handleContinueShoppingClick = () => {
        this.context.executeAction(triggerDrawer, null);
    };

    handleQuantityChange = (product, value) => {
        let payload = Object.assign({details: product.details}, {
            id: product.id,
            quantity: value
        });
        this.context.executeAction(addToCart, payload);
    };

    handleCheckoutClick = () => {
        this.context.executeAction(triggerDrawer, null);
    };

    //*** Template ***//

    render() {

        let locale = this.context.intl.locale;

        // Process Subtotal
        let subTotal = {value: 0, currency: undefined};
        if (this.state.cart && this.state.cart.products.length > 0) {
            this.state.cart.products.forEach(function (product) {
                if (!subTotal.currency) {
                    subTotal.currency = product.details.pricing.currency;
                }
                subTotal.value += product.details.pricing.retail * product.quantity;
            });
        }

        //
        // Return
        //
        return (
            <div className="side-cart">
                {this.state.cart && this.state.cart.products.length > 0 ?
                    <div>
                        <div className="side-cart__header">
                            <Heading size="small">
                                <FormattedMessage id="sideCartHeader" />
                            </Heading>
                        </div>
                        <div className="side-cart__products">
                            {this.state.cart.products.map((product, idx) => {
                                return (
                                    <div key={idx} className="side-cart__item">
                                        <CartItem product={product}
                                                  onQuantityChange={this.handleQuantityChange.bind(null, product)} />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="side-cart__subtotal">
                            <div className="side-cart__subtotal-label">
                                <Text size="medium" transform="uppercase" weight="bold">
                                    <FormattedMessage id="subtotal" />
                                </Text>
                            </div>
                            <div className="side-cart__subtotal-value">
                                <Text size="medium">
                                    <FormattedNumber value={subTotal.value}
                                                     style="currency"
                                                     currency={subTotal.currency} />
                                </Text>
                            </div>
                        </div>
                        <div className="side-cart__actions">
                            <div className="side-cart__btn">
                                {!this.state.cartLoading ?
                                    <Link to={`/${locale}/checkout`}>
                                        <Button type="primary" onClick={this.handleCheckoutClick} disabled={this.state.cartLoading}>
                                            <FormattedMessage id="checkout" />
                                        </Button>
                                    </Link>
                                    :
                                    <Button type="primary" disabled={true}>
                                        <FormattedMessage id="checkout" />
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className="side-cart__empty">
                        <div className="side-cart__empty-action" onClick={this.handleContinueShoppingClick}>
                            <Text size="small">
                                <FormattedMessage id="continueShopping" />
                            </Text>
                        </div>
                        <div className="side-cart__empty-message">
                            <Text size="medium" transform="uppercase">
                                <FormattedMessage id="emptyCart" />
                            </Text>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

/**
 * Flux
 */
SideCart = connectToStores(SideCart, [CartStore], (context) => {
    return {
        _cart: context.getStore(CartStore).getCart(),
        _cartLoading: context.getStore(CartStore).isLoading()
    };
});

/**
 * Exports
 */
export default SideCart;
