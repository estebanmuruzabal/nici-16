/**
 * Imports
 */
import React from 'react';
import { renderRoutes } from 'react-router-config';

// Required components
import AuthenticatedComponent from '../../core/AuthenticatedComponent';


/**
 * Component
 */
class AccountBase extends React.Component {

    //*** Template ***//

    render() {
        return (
            <div className="account-base">
                {renderRoutes(this.props.route.routes)}
            </div>
        );
    }
}

/**
 * This component requires Authentication
 */
const AccountWrapper = AuthenticatedComponent(AccountBase);

/**
 * Exports
 */
export default AccountWrapper;
