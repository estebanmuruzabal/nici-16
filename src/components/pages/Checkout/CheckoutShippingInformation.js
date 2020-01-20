/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Required components
import Button from '../../common/buttons/Button';
import AddressField from '../../common/forms/AddressField';
import AddressPreview from '../../common/forms/AddressPreview';
import RadioSelect from '../../common/forms/RadioSelect';

import CheckoutSection from './CheckoutSection';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class CheckoutShippingInformation extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };


    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./CheckoutShippingInformation.scss');
    }

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let locale = this.context.intl.locale;

        let shippingOptions = (this.props.shippingOptions) ? this.props.shippingOptions.map(function (option) {
            let name = (
                <FormattedMessage id={option.name[locale]} />
            );
            let price = (
                <FormattedNumber
                    value={option.price}
                    style="currency"
                    currency={option.currency} />
            );
            return {
                value: option.value,
                name: name,
                detail: price
            };
        }) : null;


        //
        // Return
        //
        return (
            <div className="checkout-shipping-information">
                {this.props.editingAddress ?
                    <div className="checkout-shipping-information__content">
                        <AddressField labelWeight="normal"
                                      address={this.props.address}
                                      savedAddresses={this.props.user && this.props.user.addresses}
                                      onSubmit={this.props.onAddressSubmit}
                                      submitLabel={this.context.intl.formatMessage({id: 'saveButton'})}
                                      loading={this.props.loading} />
                    </div>
                    :
                    <div className="checkout-shipping-information__content">
                        <div className="checkout-shipping-information__address-preview">
                            <AddressPreview address={this.props.address}
                                            onEditClick={this.props.onAddressEditClick} />
                        </div>
                        {shippingOptions ?
                            <div className="checkout-shipping-information__select-method">
                                <CheckoutSection number="2.1"
                                                 size="small"
                                                 title={this.context.intl.formatMessage({id: 'shippingMethodLabel'})} />
                                <RadioSelect options={shippingOptions}
                                             onChange={this.props.onShippingOptionChange}
                                             value={this.props.shippingMethod} />
                            </div>
                            :
                            null
                        }
                    </div>
                }
            </div>
        );
    }
}

/**
 * Default Props
 */
CheckoutShippingInformation.defaultProps = {
    onShippingDetailsSubmit: function (value) { debug(`onShippingDetailsSubmit not defined. Value: ${value}`); },
    onShippingDetailsEditClick: function () { debug('onShippingDetailsEditClick not defined'); },
};

/**
 * Exports
 */
export default CheckoutShippingInformation;
