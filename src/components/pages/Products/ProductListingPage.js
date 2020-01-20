/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import config from '../../../config';

// Flux
import CollectionsStore from '../../../stores/Collections/CollectionsStore';
import IntlStore from '../../../stores/Application/IntlStore';
import ProductsListStore from '../../../stores/Products/ProductsListStore';

import fetchProducts from '../../../actions/Products/fetchProducts';

// Required components
import Breadcrumbs from '../../common/navigation/Breadcrumbs';
import ProductList from '../../common/products/ProductList';
import ProductsSortingSelect from '../../common/products/ProductsSortingSelect';

// Translation data for this component
import intlData from './ProductListingPage.intl';

/**
 * Component
 */
class ProductListingPage extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Required Data ***//

    static fetchData = function (context, params, query, done) {
        let productsQuery = {};
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
        return {
            title: `${context.getStore(IntlStore).getMessage(intlData, 'title')} - ${config.app.title[context.getStore(IntlStore).getCurrentLocale()]}`
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
        require('./ProductListingPage.scss');
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
            pathname: `/${this.context.intl.locale}/products`,
            search: `?sort=${value}`
        });
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let locale = this.context.intl.locale;

        // Breadcrumbs
        let breadcrumbs = [
            {
                name: <FormattedMessage id="homepage" />,
                to: `/${this.context.intl.locale}`,
            },
            {
                name: <FormattedMessage id="productsList" />
            }
        ];

        // Products SideMenu
        let filters = [
            {
                name: this.context.intl.formatMessage({id: 'categories'}),
                collections: this.state.categories
            },
            {
                name: this.context.intl.formatMessage({id: 'collections'}),
                collections: this.state.collections
            }
        ];

        //
        // Return
        //
        return (
            <div className="product-listing-page">
                <div>
                    <div className="product-listing-page__header">
                        <div className="product-listing-page__breadcrumbs">
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
                        <div className="product-listing-page__sorting">
                            <ProductsSortingSelect onChange={this.handleSortChange} />
                        </div>
                    </div>

                    <div className="product-listing-page__products">
                        <ProductList title={<FormattedMessage id="productsHeader" />}
                                     filters={filters}
                                     products={this.state.products}
                                     location={this.props.location}
                                     paginateTo={`/${locale}/products/`}
                                     totalPages={this.state.totalPages}
                                     currentPage={this.state.currentPage} />
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Flux
 */
ProductListingPage = connectToStores(ProductListingPage, [CollectionsStore, ProductsListStore], (context) => {
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
export default ProductListingPage;
