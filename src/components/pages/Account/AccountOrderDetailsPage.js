/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Flux
import OrderDetailsStore from '../../../stores/Orders/OrderDetailsStore';
import fetchOrderAndCheckIfFound from '../../../actions/Orders/fetchOrderAndCheckIfFound';

// Required components
import Heading from '../../common/typography/Heading';
import NotFound from '../NotFound/NotFound';
import OrderDetails from '../../common/orders/OrderDetails';
import Spinner from '../../common/indicators/Spinner';

/**
 * Component
 */
class AccountOrderDetailsPage extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        order: this.context.getStore(OrderDetailsStore).getOrder(),
        loading: this.context.getStore(OrderDetailsStore).isLoading()
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./AccountOrderDetailsPage.scss');

        // Load required data
        this.context.executeAction(fetchOrderAndCheckIfFound, this.props.match.params.orderId);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            order: nextProps._order,
            loading: nextProps._loading
        });
    }

    //*** Template ***//

    render() {
        return (
            <div className="account-order-details-page">
                <div className="account-order-details-page__title">
                    <Heading size="medium">
                        <FormattedMessage id="accountOrderDetailsHeader" />
                    </Heading>
                </div>
                {this.state.loading ?
                    <div className="account-order-details-page__loader">
                        <Spinner />
                    </div>
                    :
                    <div>
                        {!this.state.order ?
                            <NotFound />
                            :
                            <div className="account-order-details-page__content">
                                <OrderDetails order={this.state.order} customerDetails={this.state.order.customer} />
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
}

/**
 * Flux
 */
AccountOrderDetailsPage = connectToStores(AccountOrderDetailsPage, [OrderDetailsStore], (context) => {
    return {
        _order: context.getStore(OrderDetailsStore).getOrder(),
        _loading: context.getStore(OrderDetailsStore).isLoading()
    };
});

/**
 * Exports
 */
export default AccountOrderDetailsPage;