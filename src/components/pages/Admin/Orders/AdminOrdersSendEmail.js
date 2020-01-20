/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Required components
import Button from '../../../common/buttons/Button';
import InputField from '../../../common/forms/InputField';
import Select from '../../../common/forms/Select';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class AdminOrdersSendEmail extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        template: undefined,
        email: undefined,
        subject: undefined,
        fieldErrors: {}
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./AdminOrdersSendEmail.scss');
    }

    componentWillReceiveProps(nextProps) {

        // Find field error descriptions in request response
        let fieldErrors = {};
        if (nextProps.error && nextProps.error.validation && nextProps.error.validation.keys) {
            nextProps.error.validation.keys.forEach(function (field) {
                fieldErrors[field] = nextProps.error.validation.details[field];
            });
        }

        this.setState({fieldErrors: fieldErrors});
    }

    //*** View Controllers ***//

    handleTemplateChange = (value) => {
        this.setState({template: value});
    };

    handleEmailAddressChange = (value) => {
        this.setState({email: value});
    };

    handleSubjectChange = (value) => {
        this.setState({subject: value});
    };


    handleSubmitClick = () => {
        let intl = this.context.intl;

        this.setState({fieldErrors: {}});
        let fieldErrors = {};
        if (!this.state.template) {
            fieldErrors.template = intl.formatMessage({id: 'fieldRequired'});
        }
        if (!this.state.email) {
            fieldErrors.email = intl.formatMessage({id: 'fieldRequired'});
        }
        if (!this.state.subject) {
            fieldErrors.subject = intl.formatMessage({id: 'fieldRequired'});
        }
        this.setState({fieldErrors: fieldErrors});

        if (Object.keys(fieldErrors).length === 0) {
            this.props.onSubmitClick({
                template: this.state.template,
                email: this.state.email,
                subject: this.state.subject
            });
        }
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //

        let intl = this.context.intl;

        // Build list of available email templates for given order
        let emailTemplateOptions = [
            {name: intl.formatMessage({id: 'orderCreated'}), value: 'order.created'}
        ];
        if (this.props.order.status === 'paid') {
            emailTemplateOptions.push({name: intl.formatMessage({id: 'orderPaid'}), value: 'order.paid'});
        }
        if (this.props.order.status === 'pendingPayment') {
            emailTemplateOptions.push({name: intl.formatMessage({id: 'orderPendingPayment'}), value: 'order.pendingPayment'});
        }

        //
        // Return
        //
        return (
            <div className="admin-orders-send-email">
                <div className="admin-orders-send-email__form-item">
                    <Select label={intl.formatMessage({id: 'template'})}
                            placeholder
                            options={emailTemplateOptions}
                            onChange={this.handleTemplateChange}
                            error={this.state.fieldErrors.template} />
                </div>
                <div className="admin-orders-send-email__form-item">
                    <InputField label={intl.formatMessage({id: 'emailAddress'})}
                                onChange={this.handleEmailAddressChange}
                                error={this.state.fieldErrors.email}/>
                </div>
                <div className="admin-orders-send-email__form-item">
                    <InputField label={intl.formatMessage({id: 'subject'})}
                                onChange={this.handleSubjectChange}
                                error={this.state.fieldErrors.subject}/>
                </div>
                <div className="admin-orders-send-email__actions">
                    <div className="admin-orders-send-email__button">
                        <Button type="default" onClick={this.props.onCancelClick} disabled={this.props.loading}>
                            <FormattedMessage id="cancelButton" />
                        </Button>
                    </div>
                    <div className="admin-orders-send-email__button">
                        <Button type="primary" onClick={this.handleSubmitClick} disabled={this.props.loading}>
                            <FormattedMessage id="sendButton" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Default Props
 */
AdminOrdersSendEmail.defaultProps = {
    onCancelClick: function () { debug('onCancelClick not defined'); },
    onSubmitClick: function (data) { debug(`onSubmitClick not defined. Value: ${data}`); }
};

/**
 * Exports
 */
export default AdminOrdersSendEmail;
