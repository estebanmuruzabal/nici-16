/**
 * Imports
 */
import React from 'react';
import { renderRoutes } from 'react-router-config';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import config from '../../../config';

// Flux
import IntlStore from '../../../stores/Application/IntlStore';
import fetchAllCollections from '../../../actions/Collections/fetchAllCollections';

// Required components
import AuthenticatedComponent from '../../core/AuthenticatedComponent';
import Heading from '../../common/typography/Heading';
import MainNavigation from '../../common/navigation/MainNavigation';

/**
 * Component
 */
class Admin extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Page Title and Snippets ***//

    static pageTitleAndSnippets = function (context) {
        return {
            title: `[ADMIN] ${config.app.title[context.getStore(IntlStore).getCurrentLocale()]}`
        }
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Load styles
        require('./Admin.scss');

        // Request Collections refresh because, if we're here, then we want
        // to see all the collections in Product page (for example) and not only
        // the ones enabled which are the ones with which the app is loaded on the
        // server-side
        this.context.executeAction(fetchAllCollections);
    }

    //*** Template ***//

    render() {
        let intl = this.context.intl;
        let locale = intl.locale;

        // Links
        const links = [
            {name: intl.formatMessage({id: 'dashboard'}), to: `/${locale}/adm`},
            {name: intl.formatMessage({id: 'orders'}), to:  `/${locale}/adm/orders`},
            {name: intl.formatMessage({id: 'customers'}), to:  `/${locale}/adm/customers`},
            {name: intl.formatMessage({id: 'collections'}), to:  `/${locale}/adm/collections`},
            {name: intl.formatMessage({id: 'products'}), to:  `/${locale}/adm/products`},
            {name: intl.formatMessage({id: 'contents'}), to:  `/${locale}/adm/contents`}
        ];

        // Return
        return (
            <div className="admin">
                <div className="admin-header">
                    <div className="admin-title">
                        <Heading size="large">Admin</Heading>
                    </div>
                    <div className="admin-nav">
                        <MainNavigation links={links} />
                    </div>
                </div>
                <div className="admin-container">
                    {renderRoutes(this.props.route.routes)}
                </div>
            </div>
        );
    }
}

/**
 * This component requires Authentication
 */
const AdminWrapper = AuthenticatedComponent(Admin, ['admin']);

/**
 * Exports
 */
export default AdminWrapper;
