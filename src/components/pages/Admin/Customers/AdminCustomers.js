/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import moment from 'moment';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Flux
import CustomersListStore from '../../../../stores/Customers/CustomersListStore';
import fetchCustomers from '../../../../actions/Customers/fetchCustomers';

// Required components
import Heading from '../../../common/typography/Heading';
import Spinner from '../../../common/indicators/Spinner';
import StatusIndicator from '../../../common/indicators/StatusIndicator';
import Table from '../../../common/tables/Table';
import Text from '../../../common/typography/Text';

/**
 * Component
 */
class AdminCustomers extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        customers: this.context.getStore(CustomersListStore).getCustomers(),
        loading: this.context.getStore(CustomersListStore).isLoading()
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./AdminCustomers.scss');

        // Request required data
        this.context.executeAction(fetchCustomers, {});

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            customers: nextProps._customers,
            loading: nextProps._loading
        });
    }

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //

        let headings = [
            <FormattedMessage id="nameFullHeading" />,
            <FormattedMessage id="emailHeading" />,
            <FormattedMessage id="createdAtHeading" />,
            <FormattedMessage id="statusHeading" />
        ];

        let rows = this.state.customers.map(function (customer) {
            let status;
            switch (customer.status) {
                case 'active':
                    status = 'success';
                    break;
                case 'pendingConfirmation':
                    status = 'warning';
                    break;
                case 'disabled':
                    status = 'default';
                    break;
                default:
                    status = 'error';
                    break;
            }
            return {
                data: [
                    <Text size="medium">{customer.name}</Text>,
                    <Text size="medium">{customer.email}</Text>,
                    <Text size="medium">{moment(customer.createdAt).format('YYYY/MM/DD HH:mm:ss')}</Text>,
                    <StatusIndicator status={status} />
                ]
            };
        });

        //
        // Return
        //
        return (
            <div className="admin-customers">
                <div className="admin-customers__header">
                    <div className="admin-customers__title">
                        <Heading size="medium">
                            <FormattedMessage id="adminCustomersHeader" />
                        </Heading>
                    </div>
                </div>

                {this.state.loading ?
                    <div className="admin-customers__spinner">
                        <Spinner />
                    </div>
                    :
                    <div className="admin-customers__list">
                        <Table headings={headings} rows={rows} />
                    </div>
                }
            </div>
        );
    }
}

/**
 * Flux
 */
AdminCustomers = connectToStores(AdminCustomers, [CustomersListStore], (context) => {
    return {
        _customers: context.getStore(CustomersListStore).getCustomers(),
        _loading: context.getStore(CustomersListStore).isLoading()
    };
});

/**
 * Exports
 */
export default AdminCustomers;
