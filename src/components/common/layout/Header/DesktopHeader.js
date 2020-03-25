/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Flux
import IntlStore from '../../../../stores/Application/IntlStore';
import ContentsListStore from '../../../../stores/Contents/ContentsListStore';
import AccountStore from '../../../../stores/Account/AccountStore';
import CartStore from '../../../../stores/Cart/CartStore';
import DrawerStore from '../../../../stores/Application/DrawerStore';
import triggerDrawer from '../../../../actions/Application/triggerDrawer';

// Required components
import Badge from '../../indicators/Badge';
import CollectionTreeMenu from '../../navigation/CollectionTreeMenu';
import MainNavigation from '../../navigation/MainNavigation';
import Text from '../../typography/Text';
import LogoDisplayer from '../../../common/images/LogoDisplayer';

/**
 * Component
 */
class DesktopHeader extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        cartTotalItems: this.context.getStore(CartStore).getTotalItems(),
        user: this.context.getStore(AccountStore).getAccountDetails(),
        openedDrawer: this.context.getStore(DrawerStore).getOpenedDrawer(),
        headerDesktopLogo: this.context.getStore(ContentsListStore).getOrderedContentsOfType('headerDesktopLogo', [], true),
        collectionsTreeMenuEnabled: false
    };

    //*** Component Lifecycle ***//

    componentDidMount() {
        // Component styles
        require('./DesktopHeader.scss');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            cartTotalItems: nextProps._cartTotalItems,
            user: nextProps._user,
            openedDrawer: nextProps._openedDrawer,
            headerDesktopLogo: nextProps._headerDesktopLogo,
        });
    }

    //*** View Controllers ***//

    handleBtnClick = (drawer) => {
        this.context.executeAction(triggerDrawer, drawer);
    };

    //*** Template ***//

    render() {
        // Helper variables
        const locale = this.context.getStore(IntlStore).getCurrentLocale();
        const routeParams = {locale: locale};
        const isAdmin = this.context.getStore(AccountStore).isAuthorized(['admin']);
        // Return
        return (
            <div className="desktop-header">
                <div className="desktop-header__container">
                    <div className="desktop-header__row">
                        <div className="desktop-header__container-left-column">
                            <LogoDisplayer logo={this.state.headerDesktopLogo} locale={locale} />
                            <div className="desktop-header__navigation">
                                <MainNavigation links={this.props.collections} />
                            </div>
                        </div>
                        <div className="desktop-header__container-right-column">
                            {this.state.user ?
                                <div className="desktop-header__account">
                                    { isAdmin ?
                                        <div className="desktop-header__logout-button">
                                            <Link to={`/${this.context.intl.locale}/adm`} params={routeParams}>
                                                <Text size="small" weight="bold" color="white">
                                                    <FormattedMessage id="adminPanel" />
                                                </Text>
                                            </Link>
                                        </div>
                                        :
                                        null
                                    }
                                    <div className="desktop-header__logout-button">
                                        <Link to={`/${this.context.intl.locale}/logout`}>
                                            <Text size="small">
                                                <FormattedMessage id="logoutHeader" />
                                            </Text>
                                        </Link>
                                    </div>
                                    <div className="desktop-header__account-button">
                                        <Link to={`/${this.context.intl.locale}/account`}>
                                            <div>
                                                <Text size="small">
                                                    <FormattedMessage id="hi" />, {this.state.user.name && this.state.user.name.split(' ')[0]}
                                                </Text>
                                            </div>
                                            <div>
                                                <Text size="small" weight="bold">
                                                    <FormattedMessage id="myAccount" />
                                                </Text>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                :
                                <div className="desktop-header__account">
                                    <div className="desktop-header__register-button">
                                        <Link to={`/${this.context.intl.locale}/register`}>
                                            <Text size="medium">
                                                <FormattedMessage id="registerHeader" />
                                            </Text>
                                        </Link>
                                    </div>
                                    <div className="desktop-header__login-button">
                                        <Link to={`/${this.context.intl.locale}/login`} >
                                            <Text size="medium">
                                                <FormattedMessage id="loginHeader" />
                                            </Text>
                                        </Link>
                                    </div>
                                </div>
                            }
                            <div className="desktop-header__cart" onClick={this.handleBtnClick.bind(null, 'cart')}>
                                <Badge value={this.state.cartTotalItems > 0 ? this.state.cartTotalItems : null} />
                            </div>
                        </div>
                    </div>
                    {this.state.collectionsTreeMenuEnabled && this.props.collectionsTree ?
                        <div className="desktop-header__row">
                            <CollectionTreeMenu collections={this.props.collectionsTree} />
                        </div>
                        :
                        null
                    }
                </div>
            </div>
        );
    }
}

/**
 * Flux
 */
DesktopHeader = connectToStores(DesktopHeader, [AccountStore, CartStore, DrawerStore], (context) => {
    return {
        _cartTotalItems: context.getStore(CartStore).getTotalItems(),
        _user: context.getStore(AccountStore).getAccountDetails(),
        _openedDrawer: context.getStore(DrawerStore).getOpenedDrawer(),
        _headerDesktopLogo: context.getStore(ContentsListStore).getOrderedContentsOfType('headerDesktopLogo', ['homepage'], true),
    };
});

/**
 * Exports
 */
export default DesktopHeader;
