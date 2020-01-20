/**
 * Imports
 */
import React from 'react';
import async from 'async';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, FormattedNumber, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import {slugify} from '../../../utils/strings';
import config from '../../../config';

// Flux
import CartStore from '../../../stores/Cart/CartStore';
import CollectionsStore from '../../../stores/Collections/CollectionsStore';
import IntlStore from '../../../stores/Application/IntlStore';
import ProductContentsStore from '../../../stores/Products/ProductContentsStore';
import ProductDetailsStore from '../../../stores/Products/ProductDetailsStore';
import ProductSuggestionsStore from '../../../stores/Products/ProductSuggestionsStore';

import addToCart from '../../../actions/Cart/addToCart';
import clearSuggestionsList from '../../../actions/Products/clearSuggestionsList';
import fetchProductContent from '../../../actions/Products/fetchProductContent';
import fetchProductSuggestions from '../../../actions/Products/fetchProductSuggestions';
import fetchProductAndCheckIfFound from '../../../actions/Products/fetchProductAndCheckIfFound';
import triggerDrawer from '../../../actions/Application/triggerDrawer';

// Required components
import ArticleSummary from '../../common/articles/ArticleSummary';
import Breadcrumbs from '../../common/navigation/Breadcrumbs';
import Button from '../../common/buttons/Button';
import Heading from '../../common/typography/Heading';
import ImageGallery from '../../common/images/ImageGallery';
import NotFound from '../../pages/NotFound/NotFound';
import ProductSuggestions from '../../common/products/ProductSuggestions';
import QuantitySelector from '../../common/forms/QuantitySelector';
import Text from '../../common/typography/Text';

/**
 * Component
 */
class ProductPage extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Required Data ***//

    static fetchData = function (context, params, query, done) {
        return async.parallel([
            function (callback) {
                context.executeAction(fetchProductAndCheckIfFound, params.productId, callback);
            },
            function (callback) {
                context.executeAction(fetchProductContent, null, callback);
            }
        ], done);

    };

    //*** Page Title and Snippets ***//

    static pageTitleAndSnippets = function (context) {
        let product = context.getStore(ProductDetailsStore).getProduct();
        if (product) {
            return {
                title: `${context.getStore(IntlStore).getMessage(product.name)} - ${config.app.title[context.getStore(IntlStore).getCurrentLocale()]}`
            }
        } else {
            return {
                title: 'Product Not Found'
            }
        }
    };

    //*** Helper Methods ***//

    getQuantityInCart = () => {
        let quantity = 0;
        if (this.props._product) {
            this.props._cartProducts.filter((product) => {
                return product.id === this.props._product.id;
            }).forEach(function (product) {
                quantity += product.quantity;
            });
        }
        return quantity;
    };

    //*** Initial State ***//

    state = {
        cartLoading: this.context.getStore(CartStore).isLoading(),
        cartProducts: this.context.getStore(CartStore).getProducts(),
        product: this.context.getStore(ProductDetailsStore).getProduct(),
        contents: this.context.getStore(ProductContentsStore).getContents(),
        addingToCart: false,
        suggestions: this.context.getStore(ProductSuggestionsStore).getProducts(),
        suggestionsLoading: this.context.getStore(ProductSuggestionsStore).isLoading(),
        placeholderImage: undefined,
        quantity: 1
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ProductPage.scss');

        // Load static files
        this.setState({
            placeholderImage: require('../../common/images/image_placeholder.png')
        });

        // If product has main collection, trigger fetching of cross-sell products
        if (this.state.product && this.state.product.metadata && this.state.product.metadata.mainCollection) {
            this.context.executeAction(fetchProductSuggestions, this.state.product);
        } else {
            this.context.executeAction(clearSuggestionsList);
        }
    }

    componentWillReceiveProps(nextProps) {

        // --------------------- THIS IS VERY USEFUL TO READ! ---------------------
        // If product changed (because component is being "re-used") act accordingly
        // ------------------------------------------------------------------------
        if (this.state.product && nextProps._product && this.state.product.id !== nextProps._product.id) {

            // Reset quantity
            this.setState({quantity: 1});

            // If product has main collection, trigger fetching of cross-sell products
            if (nextProps._product && nextProps._product.metadata && nextProps._product.metadata.mainCollection) {
                this.context.executeAction(fetchProductSuggestions, nextProps._product);
            } else {
                this.context.executeAction(clearSuggestionsList);
            }
        }

        // Check for cart changes when we flagged that we were adding to cart
        if (this.state.addingToCart && this.state.cartLoading && !nextProps._cartLoading) {
            this.setState({
                addingToCart: false,
                quantity: 1
            });
            this.context.executeAction(triggerDrawer, 'cart');
        }

        this.setState({
            cartLoading: nextProps._cartLoading,
            cartProducts: nextProps._cartProducts,
            product: nextProps._product,
            contents: nextProps._contents,
            suggestions: nextProps._suggestions,
            suggestionsLoading: nextProps._suggestionsLoading
        });
    }

    //*** View Controllers ***//

    handleAddToCartClick = () => {
        let payload = Object.assign({details: this.state.product}, {
            id: this.state.product.id,
            quantity: this.getQuantityInCart() + this.state.quantity
        });
        this.setState({addingToCart: true});
        this.context.executeAction(addToCart, payload);
    };

    handleQuantityChange = (value) => {
        this.setState({quantity: value});
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
                to: `/${locale}`,
            },
            {
                name: <FormattedMessage id="productsList" />,
                to: `/${locale}/products/`,
            }
        ];

        let addCollectionToBreadcrumbs = (collectionId) => {
            let collection = this.context.getStore(CollectionsStore).getCollection(collectionId);
            if (collection) {
                breadcrumbs.push({
                    name: collection.name[locale],
                    to: `/${locale}/collections/${collection.id}/${slugify(collection.name)}`,
                });
            }
        };

        // Stuff that only makes sense (and will crash otherwise) if product exists
        if (this.state.product) {

            // Look for Main Category
            if (this.state.product.metadata && this.state.product.metadata.mainCategory) {
                addCollectionToBreadcrumbs(this.state.product.metadata.mainCategory);
            }

            // Look for Main Collection
            if (this.state.product.metadata && this.state.product.metadata.mainCollection) {
                addCollectionToBreadcrumbs(this.state.product.metadata.mainCollection);
            }
        }

        //
        // Return
        //
        return (
            <div className="product-page">
                {!this.state.product ?
                    <NotFound />
                    :
                    <div>
                        <div className="product-page__header">
                            <Breadcrumbs links={breadcrumbs} weight="bold">
                                {this.state.product.name[locale]}
                            </Breadcrumbs>
                        </div>

                        <div className="product-page__product" itemScope itemType="http://schema.org/Product">
                            <div className="product-page__gallery-container">
                                {this.state.product.images && this.state.product.images.length > 0 ?
                                    <div className="product-page__gallery">
                                        <span style={{display: 'none'}} itemProp="image">
                                            {`//${this.state.product.images[0].url}`}
                                        </span>
                                        <ImageGallery key={this.state.product.id} images={this.state.product.images} />
                                    </div>
                                    :
                                    <div className="product-page__gallery">
                                        <img src={this.state.placeholderImage} />
                                    </div>
                                }
                            </div>
                            <div className="product-page__details">
                                <div className="product-page__name" itemProp="name">
                                    <Heading size="large">
                                        {this.state.product.name[locale]}
                                    </Heading>
                                </div>
                                {this.state.product.pricing ?
                                    <div className="product-page__price" itemProp="offers" itemScope itemType="http://schema.org/Offer">
                                        <div style={{display: 'none'}} itemProp="price">
                                            {this.state.product.pricing.retail}
                                        </div>
                                        <div style={{display: 'none'}} itemProp="priceCurrency">
                                            {this.state.product.pricing.currency}
                                        </div>
                                        <div>
                                            <Text size="large" weight="normal">
                                                <FormattedNumber
                                                    value={this.state.product.pricing.retail}
                                                    style="currency"
                                                    currency={this.state.product.pricing.currency} />
                                            </Text>
                                        </div>
                                    </div>
                                    :
                                    null
                                }
                                <div className="product-page__sku">
                                    <Text size="small">
                                        <FormattedMessage id="ref" />:
                                        <span itemProp="sku">{this.state.product.sku}</span>
                                    </Text>
                                </div>
                                <div className="product-page__add">
                                    <div className="product-page__quantity">
                                        <QuantitySelector value={this.state.quantity}
                                                          onChange={this.handleQuantityChange} />
                                    </div>
                                    <div className="product-page__add-buttons">
                                        {this.state.product.stock > 0 ?
                                            <Button type="primary"
                                                    onClick={this.handleAddToCartClick}
                                                    disabled={this.state.quantity <= 0 || this.state.cartLoading}>
                                                <FormattedMessage id="addToCart"/>
                                            </Button>
                                            :
                                            <Button type="primary" disabled={true}>
                                                <FormattedMessage id="outOfStock" />
                                            </Button>
                                        }
                                    </div>
                                </div>

                                <div className="product-page__description">
                                    <div className="product-page__description-label">
                                        <Heading size="medium">
                                            <FormattedMessage id="descriptionLabel" />
                                        </Heading>
                                    </div>
                                    <div className="product-page__description-content" itemProp="description">
                                        <Text size="small">
                                            {this.state.product.description[locale]}
                                        </Text>
                                    </div>
                                </div>

                                {this.state.contents.map(function (content, idx) {
                                    return (
                                        <div key={idx} className="product-page__content">
                                            <ArticleSummary content={content} />
                                        </div>
                                    );
                                })}
                            </div>

                            {!this.state.suggestionsLoading && this.state.suggestions.length === 0 ?
                                <div className="product-page__suggestions product-page__suggestions--no-border"></div>
                                :
                                <div className="product-page__suggestions">
                                    <ProductSuggestions products={this.state.suggestions} loading={this.state.suggestionsLoading}>
                                        <FormattedMessage id="crossSell" />
                                    </ProductSuggestions>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

/**
 * Flux
 */
ProductPage = connectToStores(ProductPage, [CartStore, ProductContentsStore, ProductDetailsStore, ProductSuggestionsStore], (context) => {
    return {
        _cartLoading: context.getStore(CartStore).isLoading(),
        _cartProducts: context.getStore(CartStore).getProducts(),
        _product: context.getStore(ProductDetailsStore).getProduct(),
        _contents: context.getStore(ProductContentsStore).getContents(),
        _suggestions: context.getStore(ProductSuggestionsStore).getProducts(),
        _suggestionsLoading: context.getStore(ProductSuggestionsStore).isLoading()
    };
});

/**
 * Exports
 */
export default ProductPage;
