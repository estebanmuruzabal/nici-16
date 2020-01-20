/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import {slugify} from '../../../utils/strings';

// Required components
import Heading from '../typography/Heading';
import Pagination from '../navigation/Pagination';
import ProductListItem from './ProductListItem';
import Text from '../typography/Text';
import TreeMenu from '../navigation/TreeMenu';

/**
 * Component
 */
class ProductList extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ProductList.scss');
    }

    //*** Template ***//

    render() {

        let locale = this.context.intl.locale;

        let hasDescription = () => {
            return this.props.collection && this.props.collection.description && this.props.collection.description[locale];
        };

        return (
            <div className="product-list">
                {this.props.filters ?
                    <div className="product-list__sidebar">
                        {this.props.filters.map((item, idx) => {
                            let links = item.collections.map((col) => {
                                return {
                                    name: col.name,
                                    to: `/${locale}/collections/${col.id}/${slugify(col.name)}`,
                                    selected: this.props.collection ? col.id === this.props.collection.id : false
                                };
                            });
                            if (links.length > 0) {
                                return (
                                    <div key={idx} className="product-list__filter">
                                        <TreeMenu links={links}>
                                            {item.name[locale]}
                                        </TreeMenu>
                                    </div>
                                );
                            }
                        })}
                    </div>
                    :
                    null
                }

                <div className="product-list__container">
                    {this.props.title ?
                        <div className="product-list__title">
                            <Heading size="medium">{this.props.title}</Heading>
                        </div>
                        :
                        null
                    }
                    {hasDescription() ?
                        <div className="product-list__collection-description">
                            <Text size="small">
                                {this.props.collection.description[locale]}
                            </Text>
                        </div>
                        :
                        null
                    }
                    {this.props.children ?
                        <div className="product-list__content">
                            {this.props.children}
                        </div>
                        :
                        null
                    }
                    <div className="product-list__items">
                        {this.props.products.length > 0 ?
                            this.props.products.map(function (item, idx) {
                                return (
                                    <div key={idx} className="product-list__product-item">
                                        <ProductListItem product={item} />
                                    </div>
                                );
                            })
                            :
                            <div className="product-list__no-results">
                                <Text size="medium">
                                    <FormattedMessage id="noResults" /> :(
                                </Text>
                            </div>
                        }
                    </div>
                    {this.props.totalPages && this.props.currentPage && this.props.totalPages > 1 ?
                        <div className="product-list__pagination">
                            <Pagination to={this.props.paginateTo || `/${locale}/collections/${this.props.collection.id}`}
                                        location={this.props.location}
                                        totalPages={this.props.totalPages}
                                        currentPage={this.props.currentPage} />
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
 * Exports
 */
export default ProductList;
