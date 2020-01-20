/**
 * Imports.
 */
import React from 'react';
import async from 'async';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {slugify} from '../../../utils/strings';

// Flux
import CollectionsStore from '../../../stores/Collections/CollectionsStore';
import ContentsListStore from '../../../stores/Contents/ContentsListStore';
import ProductsHomepageStore from '../../../stores/Products/ProductsHomepageStore';

import fetchContents from '../../../actions/Contents/fetchContents';
import fetchHomepageProducts from '../../../actions/Products/fetchHomepageProducts';

// Required components
import ArticleSummary from '../../common/articles/ArticleSummary';
import Carousel from '../../common/images/Carousel';
import ProductList from '../../common/products/ProductList';

import HomepageFeaturedCollection from './HomepageFeaturedCollection';

/**
 * Component.
 */
class Homepage extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Required Data ***//

    static fetchData = function (context, params, query, done) {
        return async.parallel([
            function (callback) {
                context.executeAction(fetchContents, {tags: 'homepage'}, callback);
            },
            function (callback) {
                context.executeAction(fetchHomepageProducts, {}, callback);
            }
        ], done);
    };

    //*** Initial State ***//

    state = {
        banners: this.context.getStore(ContentsListStore).getOrderedContentsOfType('banner', ['homepage'], true),
        articles: this.context.getStore(ContentsListStore).getOrderedContentsOfType('article', ['homepage'], true),
        collections: this.context.getStore(CollectionsStore).getOrderedCollections(['homepageFeatured'], true, 'homepageFeaturedOrder'),
        featuredCategories: this.context.getStore(CollectionsStore).getCollections(['category', 'homepage']),
        featuredCollections: this.context.getStore(CollectionsStore).getCollections(['collection', 'homepage']),
        featuredProducts: this.context.getStore(ProductsHomepageStore).getProducts(),
        hideCTA: true,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./Homepage.scss');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            banners: nextProps._banners,
            articles: nextProps._articles,
            collections: nextProps._collections,
            featuredProducts: nextProps._featuredProducts,
            featuredCategories: nextProps._featuredCategories,
            featuredCollections: nextProps._featuredCollections,
        });
    }

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //

        let locale = this.context.intl.locale;

        // Featured Collections
        let featuredCollections = [null, null, null, null];
        for (let i=0; i<4; i++) {
            if (this.state.collections[i]) {
                let collection = this.state.collections[i];
                featuredCollections[i] = {
                    name: collection.name[locale],
                    link: {
                        to: `/${locale}/collections/${collection.id}/${slugify(collection.name[locale])}`,
                    }
                };
                if (collection.images && collection.images.length > 0) {
                    featuredCollections[i].img = {
                        src: `//${collection.images[0].url}`,
                        alt: collection.name[locale]
                    };
                }
            }
        }

        // Featured Products SideMenu
        let productFilters = () => {
            if (this.state.featuredCategories.length > 0 || this.state.featuredCollections.length > 0) {
                return [
                    {
                        name: this.context.intl.formatMessage({id: 'categories'}),
                        collections: this.state.featuredCategories
                    },
                    {
                        name: this.context.intl.formatMessage({id: 'collections'}),
                        collections: this.state.featuredCollections
                    }
                ];
            }
        };

        // Fetaured Products Title Component
        let featuredProductsTitle = function() {
            return <FormattedMessage id="productsList" />;
        };

        //
        // Return
        //
        return (
            <div className="homepage">
                {!this.state.hideCTA ?
                    <div className="homepage__cta">
                        <div className="homepage__featured">
                            <div className="homepage__featured-block">
                                <HomepageFeaturedCollection feature={featuredCollections[0]} />
                                <HomepageFeaturedCollection feature={featuredCollections[1]} />
                            </div>
                            <div className="homepage__featured-block">
                                <HomepageFeaturedCollection feature={featuredCollections[2]} />
                                <HomepageFeaturedCollection feature={featuredCollections[3]} />
                            </div>
                        </div>

                        <div className="homepage__banners">
                            <Carousel images={this.state.banners.filter(function (banner) {
                                return banner.body && banner.body.image;
                            }).map(function (banner) {
                                return {
                                    src: `//${banner.body.image.url}`,
                                    link: banner.body.link
                                };
                            })} />
                        </div>
                    </div>
                    :
                    null
                }

                {this.state.articles.length > 0 ?
                    <div className="homepage__articles">
                        {this.state.articles.map((content, idx) => {
                            return (
                                <div key={idx} className="homepage__article-item">
                                    <Link className="homepage__article-link" to={`/${locale}/articles/${content.id}/${slugify(content.name[locale])}`} >
                                        <ArticleSummary key={idx} size="small" content={content} hideLink={true} />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                    :
                    null
                }

                <div className="homepage__products">
                    <ProductList title={featuredProductsTitle()}
                                 filters={productFilters()}
                                 location={this.props.location}
                                 products={this.state.featuredProducts} />
                </div>
            </div>
        );
    }
}

/**
 * Flux
 */
Homepage = connectToStores(Homepage, [CollectionsStore, ProductsHomepageStore], (context) => {
    return {
        _banners: context.getStore(ContentsListStore).getOrderedContentsOfType('banner', ['homepage'], true),
        _articles: context.getStore(ContentsListStore).getOrderedContentsOfType('article', ['homepage'], true),
        _collections: context.getStore(CollectionsStore).getOrderedCollections(['homepageFeatured'], true, 'homepageFeaturedOrder'),
        _featuredCategories: context.getStore(CollectionsStore).getCollections(['category', 'homepage']),
        _featuredCollections: context.getStore(CollectionsStore).getCollections(['collection', 'homepage']),
        _featuredProducts: context.getStore(ProductsHomepageStore).getProducts()
    };
});

/**
 * Export.
 */
export default Homepage;
