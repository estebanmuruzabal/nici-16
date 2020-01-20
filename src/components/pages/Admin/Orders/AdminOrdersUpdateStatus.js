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
class AdminOrdersUpdateStatus extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        status: undefined,
        description: undefined,
        fieldErrors: {}
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./AdminOrdersUpdateStatus.scss');
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

    handleStatusChange = (value) => {
        this.setState({status: value});
    };

    handleDescriptionChange = (value) => {
        this.setState({description: value});
    };

    handleSubmitClick = () => {
        let intl = this.context.intl;

        this.setState({fieldErrors: {}});
        let fieldErrors = {};
        if (!this.state.status) {
            fieldErrors.status = intl.formatMessage({id: 'fieldRequired'});
        }
        // if (!this.state.description) {
        //     fieldErrors.description = intl.formatMessage({id: 'fieldRequired'});
        // }
        this.setState({fieldErrors: fieldErrors});

        if (Object.keys(fieldErrors).length === 0) {
            this.props.onSubmitClick({
                status: this.state.status,
                description: this.state.description
            });
        }
    };

    //*** Template ***//

    render() {
        //
        // Helper methods & variables
        //

        let intl = this.context.intl;

        // let statusOptions = [];
        // if (['created', 'pendingPayment', 'paymentError', 'paid', 'processing', 'ready'].indexOf(this.props.order.status) !== -1) {
        //     statusOptions.push({name: intl.formatMessage({id: 'status_cancelOrder'}), value: 'canceled'});
        // }
        // if (this.props.order.status === 'paid') {
        //     statusOptions.push({name: intl.formatMessage({id: 'status_processing'}), value: 'processing'});
        // }
        // if (this.props.order.status === 'processing') {
        //     statusOptions.push({name: intl.formatMessage({id: 'status_ready'}), value: 'ready'});
        // }
        // if (this.props.order.status === 'ready') {
        //     statusOptions.push({name: intl.formatMessage({id: 'status_shipped'}), value: 'shipped'});
        // }

        let statusOptions = [
            {name: intl.formatMessage({id: 'status_created'}), value: 'created'},
            {name: intl.formatMessage({id: 'status_canceled'}), value: 'canceled'},
            {name: intl.formatMessage({id: 'status_pendingPayment'}), value: 'pendingPayment'},
            {name: intl.formatMessage({id: 'status_paid'}), value: 'paid'},
            {name: intl.formatMessage({id: 'status_processing'}), value: 'processing'},
            {name: intl.formatMessage({id: 'status_ready'}), value: 'ready'},
            {name: intl.formatMessage({id: 'status_shipped'}), value: 'shipped'},
        ];

        //
        // Return
        //
        return (
            <div className="admin-orders-update-status">
                <div className="admin-orders-update-status__form-item">
                    <Select label={intl.formatMessage({id: 'status'})}
                            placeholder
                            options={statusOptions}
                            onChange={this.handleStatusChange}
                            value={this.state.status}
                            error={this.state.fieldErrors.status} />
                </div>
                <div className="admin-orders-update-status__form-item">
                    <InputField label={intl.formatMessage({id: 'description'})}
                                onChange={this.handleDescriptionChange}
                                error={this.state.fieldErrors.description}/>
                </div>
                <div className="admin-orders-update-status__actions">
                    <div className="admin-orders-update-status__button">
                        <Button type="default" onClick={this.props.onCancelClick} disabled={this.props.loading}>
                            <FormattedMessage id="cancelButton" />
                        </Button>
                    </div>
                    <div className="admin-orders-update-status__button">
                        <Button type="primary" onClick={this.handleSubmitClick} disabled={this.props.loading}>
                            <FormattedMessage id="updateButton" />
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
AdminOrdersUpdateStatus.defaultProps = {
    onCancelClick: function () { debug('onCancelClick not defined'); },
    onSubmitClick: function (data) { debug(`onSubmitClick not defined. Value: ${data}`); }
};

/**
 * Exports
 */
export default AdminOrdersUpdateStatus;
