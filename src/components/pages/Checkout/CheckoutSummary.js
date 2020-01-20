/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';

// Required components
import Button from '../../common/buttons/Button';
import Heading from '../../common/typography/Heading';
import OrderSummary from '../../common/orders/OrderSummary';
import Text from '../../common/typography/Text';

/**
 * Component
 */
class CheckoutSummary extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./CheckoutSummary.scss');
    }

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let intl = this.context.intl;

        let missingInfo = [];
        if (!this.props.checkout.customer && !this.props.checkout.cart.userId) {
            missingInfo.push(`1 - ${intl.formatMessage({id: 'customerDetails'})}`);
        }
        if (!this.props.checkout.shippingAddress || Object.keys(this.props.checkout.shippingAddress).length === 0) {
            missingInfo.push(`2 - ${intl.formatMessage({id: 'shippingInformation'})}`);
        }
        if (!this.props.checkout.shippingMethod) {
            missingInfo.push(`2.1 - ${intl.formatMessage({id: 'shippingMethod'})}`);
        }
        if (!this.props.useShippingAddressForBilling && (!this.props.checkout.billingAddress || Object.keys(this.props.checkout.billingAddress).length === 0)) {
            missingInfo.push(`3 - ${intl.formatMessage({id: 'billingAddress'})}`);
        }
        if (!this.props.checkout.paymentMethod) {
            missingInfo.push(`3.1 - ${intl.formatMessage({id: 'paymentMethod'})}`);
        }

        //
        // Return
        //
        return (
            <div className="checkout-summary">
                <div className="checkout-summary__order">
                    <OrderSummary checkout={this.props.checkout} />
                </div>
                {missingInfo.length > 0 ?
                    <div className="checkout-summary__warning">
                        <Heading size="small">
                            <FormattedMessage id="whatsMissing" />
                        </Heading>
                        {missingInfo.map(function (detail, idx) {
                            return (
                                <div key={idx} className="checkout-summary__warning-item">
                                    <Text size="small">{detail}</Text>
                                </div>
                            );
                        })}
                    </div>
                    :
                    null
                }
                <div className="checkout-summary__row checkout-summary__submit">
                    <div className="checkout-summary__submit-button">
                        <Button type="primary" disabled={!this.props.readyForCheckout} onClick={this.props.onCheckoutClick}>
                            <FormattedMessage id="checkoutButton" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Exports
 */
export default CheckoutSummary;
