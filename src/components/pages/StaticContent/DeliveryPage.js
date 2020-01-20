/**
 * Imports
 */
import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

import config from '../../../config';

// Flux
import IntlStore from '../../../stores/Application/IntlStore';

// Required components
import Heading from '../../common/typography/Heading';
import Text from '../../common/typography/Text';

// Translation data for this component
import intlData from './DeliveryPage.intl';


/**
 * Component
 */
class DeliveryPage extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired
    };

    //*** Page Title and Snippets ***//

    static pageTitleAndSnippets = function (context, params, query) {
        return {
            title: `${context.getStore(IntlStore).getMessage(intlData, 'title')} - ${config.app.title[context.getStore(IntlStore).getCurrentLocale()]}`
        }
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./DeliveryPage.scss');
    }

    //*** Template ***//

    render() {
        let intlStore = this.context.getStore(IntlStore);

        return (
            <div className="stores-page">
                <div className="stores-page__title">
                    <Heading size="large">
                        <FormattedMessage id="deliveryHeader"/>
                    </Heading>
                </div>
                <div className="stores-page__content">
                    <div className="stores-page__block">
                        <Heading size="medium">
                            <FormattedMessage id="deliveryShippingTitle" />
                        </Heading>
                        <p>
                            <FormattedMessage id="deliveryShippingDescription" />
                        </p>
                        <ul>
                            <li>
                                <FormattedMessage id="deliveryShippingMethodNovaPoshta" />
                            </li>
                            <li>
                                <FormattedMessage id="deliveryShippingMethodUkrPoshta" />
                            </li>
                            <li>
                                <FormattedMessage id="deliveryShippingMethodInPerson" />
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="stores-page__content">
                    <div className="stores-page__block">
                        <Heading size="medium">
                            <FormattedMessage id="deliveryPaymentTitle" />
                        </Heading>
                        <p>
                            <FormattedMessage id="deliveryPaymentDescription" />
                        </p>
                        <ul>
                            <li>
                                <FormattedMessage id="deliveryPaymentMethodPrivatBank" />
                            </li>
                            <li>
                                <FormattedMessage id="deliveryPaymentMethodPOD" />
                            </li>
                            <li>
                                <FormattedMessage id="deliveryPaymentMethodInPerson" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Exports
 */
export default DeliveryPage;
