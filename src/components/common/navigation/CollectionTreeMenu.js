/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {slugify} from '../../../utils/strings';

// Required components
import Text from '../typography/Text';

import TreeMenu from './TreeMenu';

/**
 * Component
 */
class CollectionTreeMenu extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        openedDrawer: undefined
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./CollectionTreeMenu.scss');
    }

    //*** View Controllers ***//

    handleMouseEnter = (collection) => {
        this.setState({openedDrawer: collection});
    };

    handleMouseLeave = () => {
        this.setState({openedDrawer: null});
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let locale = this.context.intl.locale;
        //
        // Return
        //
        return (
            <div className="collection-tree-menu">
                <nav className="collection-tree-menu__nav" onMouseLeave={this.handleMouseLeave}>
                    <ul>
                        {this.props.collections.map((collection, idx) => {
                            let className = 'collection-tree-menu__root-item';
                            if (this.state.openedDrawer && this.state.openedDrawer.id === collection.id) {
                                className += ' collection-tree-menu__root-item--selected';
                            }
                            return (
                                <li key={idx} className={className}
                                    onMouseEnter={this.handleMouseEnter.bind(null, collection)}>
                                    <Text className="collection-tree-menu__root-item-label" size="medium">
                                        <Link to={`/${locale}/collections/${collection.id}/${slugify(collection.name[locale])}`}>
                                            {collection.name[locale]}
                                        </Link>
                                    </Text>
                                </li>
                            );
                        })}
                    </ul>
                    {this.state.openedDrawer && this.state.openedDrawer.children && this.state.openedDrawer.children.length > 0 ?
                        <div className="collection-tree-menu__drawer">
                            <div className="collection-tree-menu__drawer-block">
                                <TreeMenu links={this.state.openedDrawer.children.map(function (collection) {
                                    return {
                                        name: collection.name[locale],
                                        to: `/${locale}/collections/${collection.id}/${slugify(collection.name[locale])}`,
                                    };
                                })} />
                            </div>
                        </div>
                        :
                        null
                    }
                </nav>
            </div>
        );
    }
}

/**
 * Exports
 */
export default CollectionTreeMenu;