/**
 * Imports
 */
import React from 'react';
import async from 'async';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { renderRoutes } from 'react-router-config';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import {slugify} from '../../../utils/strings';
import config from '../../../config';

// Flux
import AccountStore from '../../../stores/Account/AccountStore';
import ApplicationStore from '../../../stores/Application/ApplicationStore';
import CollectionsStore from '../../../stores/Collections/CollectionsStore';
import DrawerStore from '../../../stores/Application/DrawerStore';
import NotificationQueueStore from '../../../stores/Application/NotificationQueueStore';
import PageLoadingStore from '../../../stores/Application/PageLoadingStore';

import fetchAccountDetails from '../../../actions/Account/fetchAccountDetails';
import fetchUserLastOrder from '../../../actions/Orders/fetchUserLastOrder';
import popNotification from '../../../actions/Application/popNotification';
import triggerDrawer from '../../../actions/Application/triggerDrawer';

// Required components
import Drawer from '../../common/layout/Drawer/Drawer';
import Footer from '../../common/layout/Footer';
import Header from '../../common/layout/Header';
import Heading from '../../common/typography/Heading';
import OverlayLoader from '../../common/indicators/OverlayLoader';
import SideCart from '../../common/cart/SideCart';
import SideMenu from '../../common/navigation/SideMenu';

import PopTopNotification from '../../common/notifications/PopTopNotification';

// Instantiate debugger
let debug = require('debug')('simple-store');


/**
 * Component
 */
class Application extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        navCollections: this.context.getStore(CollectionsStore).getMainNavigationCollections(),
        collectionsTree: this.context.getStore(CollectionsStore).getCollectionsTree(),
        notification: this.context.getStore(NotificationQueueStore).pop(),
        openedDrawer: this.context.getStore(DrawerStore).getOpenedDrawer(),
        pageLoading: this.context.getStore(PageLoadingStore).isLoading(),
    };

    //*** Component Lifecycle ***//

    componentDidMount() {
        // Load styles
        require('./Application.scss');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            navCollections: nextProps._navCollections,
            collectionsTree: nextProps._collectionsTree,
            notification: nextProps._notification,
            openedDrawer: nextProps._openedDrawer,
            pageLoading: nextProps._pageLoading,
        });
    }

    //*** View Controllers ***//

    handleNotificationDismissClick = () => {
        this.context.executeAction(popNotification);
    };

    handleOverlayClick = () => {
        this.context.executeAction(triggerDrawer, null);
    };

    //*** Template ***//

    render() {
        // Main navigation menu items
        let locale = this.context.intl.locale;
        let collections = this.state.navCollections.map(function (collection) {
            let name = collection.name[locale];
            return {
                name: name,
                to: `/${locale}/collections/${collection.id}/${slugify(name)}`,
            };
        });

        // Compute CSS classes for the overlay
        let overlayClass = 'application__overlay';
        if (this.state.openedDrawer === 'menu') {
            overlayClass += ' application__overlay--left-drawer-open';
        } else if (this.state.openedDrawer === 'cart') {
            overlayClass += ' application__overlay--right-drawer-open';
        }

        // Compute CSS classes for the content
        let contentClass = 'application__container';
        if (this.state.openedDrawer === 'menu') {
            contentClass += ' application__container--left-drawer-open';
        } else if (this.state.openedDrawer === 'cart') {
            contentClass += ' application__container--right-drawer-open';
        }

        // Check if user logged-in is an Admin
        let isAdmin = this.context.getStore(AccountStore).isAuthorized(['admin']);

        // Return
        return (
            <div className="application">
                {this.state.pageLoading ?
                    <OverlayLoader />
                    :
                    null
                }

                {this.state.notification ?
                    <PopTopNotification key={this.context.getStore(ApplicationStore).uniqueId()}
                                        type={this.state.notification.type}
                                        onDismissClick={this.handleNotificationDismissClick}>
                        {this.state.notification.message}
                    </PopTopNotification>
                    :
                    null
                }

                <Drawer position="left" open={this.state.openedDrawer === 'menu'}>
                    <SideMenu collections={collections} />
                </Drawer>
                <Drawer position="right" open={this.state.openedDrawer === 'cart'}>
                    <SideCart />
                </Drawer>
                <div className={overlayClass} onClick={this.handleOverlayClick}>
                    <div className="application__overlay-content"></div>
                </div>
                <div className={contentClass}>
                    {isAdmin ?
                        <div className="application__admin-warning">
                            <Heading>*** ADMIN ACCOUNT ***</Heading>
                        </div>
                        :
                        null
                    }
                    <Header collections={collections}
                            collectionsTree={this.state.collectionsTree}
                            location={this.props.location} />
                    <div className="application__container-wrapper">
                        <div className="application__container-content">
                            {renderRoutes(this.props.route.routes)}
                        </div>
                    </div>
                    <Footer brandName={config.app.brand}/>
                </div>
            </div>
        );
    }
}

/**
 * Flux
 */
Application = connectToStores(Application, [
    AccountStore,
    CollectionsStore,
    DrawerStore,
    NotificationQueueStore,
    PageLoadingStore,
], (context) => {
    return {
        _navCollections: context.getStore(CollectionsStore).getMainNavigationCollections(),
        _collectionsTree: context.getStore(CollectionsStore).getCollectionsTree(),
        _notification: context.getStore(NotificationQueueStore).pop(),
        _openedDrawer: context.getStore(DrawerStore).getOpenedDrawer(),
        _pageLoading: context.getStore(PageLoadingStore).isLoading(),
    };
});

/**
 * Exports
 */
export default Application;
