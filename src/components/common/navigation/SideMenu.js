/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

// Flux
import AccountStore from '../../../stores/Account/AccountStore';
import triggerDrawer from '../../../actions/Application/triggerDrawer';

// Required Components
import Text from '../typography/Text';

/**
 * Component
 */
class SideMenu extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        user: this.context.getStore(AccountStore).getAccountDetails()
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./SideMenu.scss');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({user: nextProps._user});
    }

    //*** View Controllers ***//

    handleItemClick = () => {
        this.context.executeAction(triggerDrawer, null); // Close drawer
    };

    //*** Template ***//

    render() {
        return (
            <div className="side-menu">
                <nav>
                    <ul className="side-menu__homepage">
                        <li className="side-menu__item side-menu__collection-item" onClick={this.handleItemClick}>
                            <Link to={`/${this.context.intl.locale}`}>
                                <Text size="small">
                                    <FormattedMessage id="homepage" />
                                </Text>
                            </Link>
                        </li>
                    </ul>
                    <ul className="side-menu__collections">
                        {this.props.collections && this.props.collections.map((obj, idx) => {
                            return (
                                <li key={idx} className="side-menu__item side-menu__collection-item" onClick={this.handleItemClick}>
                                    <Link to={obj.to}>
                                        <Text size="medium">{obj.name}</Text>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    {this.state.user ?
                        <ul className="side-menu__account">
                            <li className="side-menu__item side-menu__account-item" onClick={this.handleItemClick}>
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
                            </li>
                            <li className="side-menu__item side-menu__account-item" onClick={this.handleItemClick}>
                                <Link to={`/${this.context.intl.locale}/logout`} >
                                    <Text size="small" weight="bold">
                                        <FormattedMessage id="logoutButton" />
                                    </Text>
                                </Link>
                            </li>
                        </ul>
                        :
                        <ul className="side-menu__account">
                            <li className="side-menu__item side-menu__account-item" onClick={this.handleItemClick}>
                                <Link to={`/${this.context.intl.locale}/login`}>
                                    <Text size="small" weight="bold">
                                        <FormattedMessage id="loginHeader" />
                                    </Text>
                                </Link>
                            </li>
                            <li className="side-menu__item side-menu__account-item" onClick={this.handleItemClick}>
                                <Link to={`/${this.context.intl.locale}/register`}>
                                    <Text size="small" weight="bold">
                                        <FormattedMessage id="registerHeader" />
                                    </Text>
                                </Link>
                            </li>
                        </ul>
                    }
                </nav>
            </div>
        );
    }
}

/**
 * Flux
 */
SideMenu = connectToStores(SideMenu, [AccountStore], (context) => {
    return {
        _user: context.getStore(AccountStore).getAccountDetails()
    };
});

/**
 * Exports
 */
export default SideMenu;
