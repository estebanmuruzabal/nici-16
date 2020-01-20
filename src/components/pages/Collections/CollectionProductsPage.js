/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import {slugify} from '../../../utils/strings';
import config from '../../../config';

// Flux
import CollectionsStore from '../../../stores/Collections/CollectionsStore';
import IntlStore from '../../../stores/Application/IntlStore';
import ProductsListStore from '../../../stores/Products/ProductsListStore';

import fetchProducts from '../../../actions/Products/fetchProducts';

// Required components
import Breadcrumbs from '../../common/navigation/Breadcrumbs';
import NotFound from '../../pages/NotFound/NotFound';
import ProductList from '../../common/products/ProductList';
import ProductsSortingSelect from '../../common/products/ProductsSortingSelect';

/**
 * Component
 */
class CollectionProductsPage extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Required Data ***//

    static fetchData = function (context, params, query, done) {
        let productsQuery = {collections: params.collectionId};
        if (query.page) {
            productsQuery.page = query.page;
        }
        if (query.sort) {
            productsQuery.sort = query.sort;
        }
        return context.executeAction(fetchProducts, productsQuery, done);
    };

    //*** Page Title and Snippets ***//

    static pageTitleAndSnippets = function (context, params, query) {
        let collection = context.getStore(CollectionsStore).getCollection(params.collectionId);
        if (collection) {
            return {
                title: `${context.getStore(IntlStore).getMessage(collection.name)} - ${config.app.title[context.getStore(IntlStore).getCurrentLocale()]}`
            }
        } else {
            return {
                title: 'Collection Not Found'
            }
        }
    };

    //*** Initial State ***//

    state = {
        categories: this.context.getStore(CollectionsStore).getCollections(['category']),
        collections: this.context.getStore(CollectionsStore).getCollections(['collection']),
        products: this.context.getStore(ProductsListStore).getProducts(),
        totalPages: this.context.getStore(ProductsListStore).getTotalPages(),
        currentPage: this.context.getStore(ProductsListStore).getCurrentPage()
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./CollectionProductsPage.scss');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            categories: nextProps._categories,
            collections: nextProps._collections,
            products: nextProps._products,
            totalPages: nextProps._totalPages,
            currentPage: nextProps._currentPage
        });
    }

    //*** View Controllers ***//

    handleSortChange = (value) => {
        this.props.history.push({
            pathname: `/${this.context.intl.locale}/collections/${this.props.match.params.collectionId}`,
            search: `?sort=${value}`
        });
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //

        let locale = this.context.intl.locale;
        let collection = this.context.getStore(CollectionsStore).getCollection(this.props.match.params.collectionId);

        // Stuff that only makes sense (and will crash otherwise) if collection exists
        if (collection) {

            // Breadcrumbs
            var breadcrumbs = [
                {
                    name: this.context.intl.formatMessage({id: "homepage"}),
                    to: `/${this.context.intl.locale}`,
                },
                {
                    name: this.context.intl.formatMessage({id: "productsList"}),
                    to: `/${this.context.intl.locale}/products`,
                },
                {
                    name: collection.name[locale]
                }
            ];

            // Products SideMenu
            var filters = [
                {
                    name: this.context.intl.formatMessage({id: 'categories'}),
                    collections: this.state.categories
                },
                {
                    name: this.context.intl.formatMessage({id: 'collections'}),
                    collections: this.state.collections
                }
            ];
        }

        //
        // Return
        //
        return (
            <div className="collection-products-page">
                {collection ?
                    <div>
                        <div className="collection-products-page__header">
                            <div className="collection-products-page__breadcrumbs">
                                <Breadcrumbs links={breadcrumbs}>
                                    {this.state.totalPages > 0 ?
                                        <FormattedMessage id="pagination"
                                            values={{
                                                currentPage: this.state.currentPage,
                                                totalPages: this.state.totalPages }} />
                                        :
                                        null
                                    }
                                </Breadcrumbs>
                            </div>
                            <div className="collection-products-page__sorting">
                                <ProductsSortingSelect key={collection.id} onChange={this.handleSortChange} />
                            </div>
                        </div>

                        <div className="collection-products-page__products">
                            <ProductList title={collection.name[locale]}
                                         filters={filters}
                                         location={this.props.location}
                                         collection={collection}
                                         products={this.state.products}
                                         totalPages={this.state.totalPages}
                                         currentPage={this.state.currentPage} />
                        </div>
                    </div>
                    :
                    <div>
                        <NotFound />
                    </div>
                }
            </div>
        );
    }
}

/**
 * Flux
 */
CollectionProductsPage = connectToStores(CollectionProductsPage, [CollectionsStore, ProductsListStore], (context) => {
    return {
        _products: context.getStore(ProductsListStore).getProducts(),
        _totalPages: context.getStore(ProductsListStore).getTotalPages(),
        _currentPage: context.getStore(ProductsListStore).getCurrentPage(),
        _categories: context.getStore(CollectionsStore).getCollections(['category']),
        _collections: context.getStore(CollectionsStore).getCollections(['collection'])
    };
});

/**
 * Exports
 */
export default CollectionProductsPage;
