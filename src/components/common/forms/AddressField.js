/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Flux
import IntlStore from '../../../stores/Application/IntlStore';

// Required components
import Button from '../buttons/Button';

import InlineItems from './InlineItems';
import InputField from './InputField';
import Select from './Select';

/**
 * Component
 */
class AddressField extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        address: this.props.address || {},
        fieldErrors: {}
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./AddressField.scss');
    }

    //*** View Controllers ***//

    handleSavedAddressChange = (idx) => {
        this.props.onSubmit(this.props.savedAddresses[idx]);
    };

    handleFieldChange = (field, value) => {
        let address = this.state.address;
        address[field] = value;
        this.setState({address: address});
    };

    handleSubmitClick = () => {

        let intl = this.context.intl;

        // Client-side validations
        let fieldErrors = {};

        if (!this.state.address.name) {
            fieldErrors.name = intl.formatMessage({id: 'fieldRequired'});
        }

        if (!this.state.address.addressLine1) {
            fieldErrors.addressLine1 = intl.formatMessage({id: 'fieldRequired'});
        }

        if (!this.state.address.postalCode) {
            fieldErrors.postalCode = intl.formatMessage({id: 'fieldRequired'});
        }

        if (!this.state.address.city) {
            fieldErrors.city = intl.formatMessage({id: 'fieldRequired'});
        }

        if (!this.state.address.country) {
            fieldErrors.country = intl.formatMessage({id: 'fieldRequired'});
        }

        this.setState({fieldErrors: fieldErrors});

        // Validation passed, trigger request
        if (Object.keys(fieldErrors).length === 0) {
            this.props.onSubmit(this.state.address);
        }
    };

    //*** Template ***//

    render() {

        let intl = this.context.intl;

        let countryOptions = [
            {name: 'Ukraine', value: 'UA'}
        ];

        let addressOptions;
        if (this.props.savedAddresses && this.props.savedAddresses.length > 0) {
            addressOptions = this.props.savedAddresses.map(function (address, idx) {
                return {
                    value: idx,
                    name: `${address.name}, ${address.addressLine1} ${address.addressLine2}, ${address.postalCode} ${address.city}`
                };
            });
        }

        return (
            <div className="address-field">
                {addressOptions ?
                    <div className="address-field__item address-field__saved-addresses">
                        <Select label={intl.formatMessage({id: 'savedAddresses'})}
                                labelWeight="normal"
                                labelSize="small"
                                placeholder
                                options={addressOptions}
                                onChange={this.handleSavedAddressChange} />
                    </div>
                    :
                    null
                }
                <div className="address-field__item">
                    <InlineItems>
                        <InputField label={intl.formatMessage({id: 'fullName'})}
                                    labelWeight={this.props.labelWeight}
                                    value={this.state.address.name || ''}
                                    onChange={this.handleFieldChange.bind(null, 'name')}
                                    error={this.state.fieldErrors['name']} />
                        <InputField label={intl.formatMessage({id: 'phoneNumber'})}
                                    labelWeight={this.props.labelWeight}
                                    value={this.state.address.phone || ''}
                                    onChange={this.handleFieldChange.bind(null, 'phone')}
                                    error={this.state.fieldErrors['phone']} />
                    </InlineItems>
                </div>
                <div className="address-field__item">
                    <InputField label={intl.formatMessage({id: 'vatin'})}
                                labelWeight={this.props.labelWeight}
                                value={this.state.address.vatin || ''}
                                onChange={this.handleFieldChange.bind(null, 'vatin')}
                                error={this.state.fieldErrors['vatin']} />
                </div>
                <div className="address-field__item">
                    <InputField label={intl.formatMessage({id: 'address'})}
                                labelWeight={this.props.labelWeight}
                                value={this.state.address.addressLine1 || ''}
                                onChange={this.handleFieldChange.bind(null, 'addressLine1')}
                                error={this.state.fieldErrors['addressLine1']} />
                </div>
                <div className="address-field__address-line2">
                    <InputField labelWeight={this.props.labelWeight}
                                value={this.state.address.addressLine2 || ''}
                                onChange={this.handleFieldChange.bind(null, 'addressLine2')}
                                error={this.state.fieldErrors['addressLine2']} />
                </div>
                <div className="address-field__item">
                    <InlineItems>
                        <InputField label={intl.formatMessage({id: 'postalCode'})}
                                    labelWeight={this.props.labelWeight}
                                    value={this.state.address.postalCode || ''}
                                    onChange={this.handleFieldChange.bind(null, 'postalCode')}
                                    error={this.state.fieldErrors['postalCode']} />
                        <InputField label={intl.formatMessage({id: 'city'})}
                                    labelWeight={this.props.labelWeight}
                                    value={this.state.address.city || ''}
                                    onChange={this.handleFieldChange.bind(null, 'city')}
                                    error={this.state.fieldErrors['city']} />
                    </InlineItems>
                </div>
                <div className="address-field__item">
                    <InlineItems>
                        <InputField label={intl.formatMessage({id: 'state'})}
                                    labelWeight={this.props.labelWeight}
                                    value={this.state.address.state || ''}
                                    onChange={this.handleFieldChange.bind(null, 'state')}
                                    error={this.state.fieldErrors['state']} />
                        <Select label={intl.formatMessage({id: 'country'})}
                                placeholder
                                options={countryOptions}
                                labelWeight={this.props.labelWeight}
                                value={this.state.address.country || ''}
                                onChange={this.handleFieldChange.bind(null, 'country')}
                                error={this.state.fieldErrors['country']} />
                    </InlineItems>
                </div>
                {this.props.onCancel || this.props.onSubmit ?
                    <div className="address-field__item">
                        <InlineItems>
                            <div>
                                {this.props.onCancel ?
                                    <Button type="default"
                                            onClick={this.props.onCancel}
                                            disabled={this.props.disabled}
                                            loading={this.props.loading}>
                                        {this.props.cancelLabel || intl.formatMessage({id: 'cancelButton'})}
                                    </Button>
                                    :
                                    null
                                }
                            </div>
                            <div>
                                {this.props.onSubmit ?
                                    <Button type="primary"
                                            onClick={this.handleSubmitClick}
                                            disabled={this.props.disabled}
                                            loading={this.props.loading}>
                                        {this.props.submitLabel || intl.formatMessage({id: 'updateButton'})}
                                    </Button>
                                    :
                                    null
                                }
                            </div>
                        </InlineItems>
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}

/**
 * Exports
 */
export default AddressField;
