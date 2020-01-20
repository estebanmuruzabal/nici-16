/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';


// Required components
import Button from '../../common/buttons/Button';
import InlineItems from '../../common/forms/InlineItems';
import InputField from '../../common/forms/InputField';
import Text from '../../common/typography/Text';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class CheckoutCustomerDetails extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        email: (this.props.user) ? this.props.user.email : '',
        name: (this.props.user) ? this.props.user.name : '',

        fieldErrors: {}
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./CheckoutCustomerDetails.scss');
    }

    componentWillReceiveProps(nextProps) {

        // Find field error descriptions in request response
        let fieldErrors = {};
        if (nextProps.error && nextProps.error.validation && nextProps.error.validation.keys) {
            nextProps.error.validation.keys.forEach(function (field) {
                fieldErrors[field] = nextProps.error.validation.details[field];
            });
        }

        // Update state
        this.setState({fieldErrors: fieldErrors});
    }

    //*** View Controllers ***//

    handleInputChange = (field, value) => {
        this.setState({[field]: value});
    };

    handleSaveClick = () => {

        let intl = this.context.intl;

        // Client-side validations
        let fieldErrors = {};

        if (!this.state.name) {
            fieldErrors['customer.name'] = intl.formatMessage({id: 'fieldRequired'});
        }

        if (!this.state.email) {
            fieldErrors['customer.email'] = intl.formatMessage({id: 'fieldRequired'});
        }

        this.setState({fieldErrors: fieldErrors});

        // Validation passed, trigger request
        if (Object.keys(fieldErrors).length === 0) {
            this.props.onDetailsSubmit({
                email: this.state.email,
                name: this.state.name,
            });
        }
    };

    //*** Template ***//

    render() {
        let intl = this.context.intl;
        return (
            <div className="checkout-customer-details">
                {this.props.editing && !this.props.user ?
                    <div className="checkout-customer-details__form">
                        <div className="checkout-customer-details__item">
                            <InlineItems>
                                <InputField label={intl.formatMessage({id: 'fullName'})}
                                            labelWeight="normal"
                                            value={this.state.name}
                                            onChange={this.handleInputChange.bind(null, 'name')}
                                            error={this.state.fieldErrors['customer.name']} />
                            </InlineItems>
                        </div>
                        <div className="checkout-customer-details__item">
                            <InlineItems>
                                <InputField label={intl.formatMessage({id: 'email'})}
                                            labelWeight="normal"
                                            value={this.state.email}
                                            onChange={this.handleInputChange.bind(null, 'email')}
                                            error={this.state.fieldErrors['customer.email']} />
                            </InlineItems>
                        </div>
                        <div className="checkout-customer-details__item">
                            <InlineItems>
                                <div></div>
                                <div>
                                    <Button type="primary"
                                            onClick={this.handleSaveClick}
                                            loading={this.props.loading}>
                                        <FormattedMessage id="saveButton" />
                                    </Button>
                                </div>
                            </InlineItems>
                        </div>
                    </div>
                    :
                    <div>
                        <div>
                            <Text>{this.state.name}</Text>
                        </div>
                        <div>
                            <Text>{this.state.email}</Text>
                        </div>
                        {!this.props.user ?
                            <div className="checkout-customer-details__actions">
                                <Button className="checkout-customer-details__edit"
                                        type="default"
                                        fontSize="small"
                                        onClick={this.props.onEditClick}
                                        loading={this.props.loading}>
                                    <FormattedMessage id="editButton" />
                                </Button>
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
CheckoutCustomerDetails.defaultProps = {
    onDetailsSubmit: function (value) { debug(`onDetailsSubmit not defined. Value: ${value}`); }
};

/**
 * Exports
 */
export default CheckoutCustomerDetails;
