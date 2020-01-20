/**
 * Imports
 */
import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component
 */
class MainNavigation extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./MainNavigation.scss');
    }

    //*** Template ***//

    render() {

        // Return
        return (
            <div className="main-navigation">
                <nav>
                    <ul>
                        {this.props.links.map(function (link, idx) {
                            return (
                                <li key={idx} className="main-navigation__item">
                                    <Link to={link.to}>
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        );
    }
}

/**
 * Exports
 */
export default MainNavigation;
