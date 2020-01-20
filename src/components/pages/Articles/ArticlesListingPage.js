/**
 * Imports
 */
import React from 'react';
import async from 'async';
import queryString from 'query-string';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import config from '../../../config';
import {slugify} from '../../../utils/strings';

// Flux
import CollectionsStore from '../../../stores/Collections/CollectionsStore';
import ContentsListStore from '../../../stores/Contents/ContentsListStore';
import IntlStore from '../../../stores/Application/IntlStore';
import ProductSuggestionsStore from '../../../stores/Products/ProductSuggestionsStore';

import fetchContents from '../../../actions/Contents/fetchContents';
import fetchProductSuggestions from '../../../actions/Products/fetchProductSuggestions';

// Required components
import ArticleSummary from '../../common/articles/ArticleSummary';
import Heading from '../../common/typography/Heading';
import ProductSuggestions from '../../common/products/ProductSuggestions';
import NewsletterSubscription from '../../common/forms/NewsletterSubscription';
import Text from '../../common/typography/Text';
import TreeMenu from '../../common/navigation/TreeMenu';

// Translation data for this component
import intlData from './ArticlesListingPage.intl';

/**
 * Component
 */
class ArticlesListingPage extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Required Data ***//

    static fetchData = function (context, params, query, done) {
        return async.parallel([
            function (callback) {
                context.executeAction(fetchContents, {type: 'article', collections: query.collections}, callback);
            },
            function (callback) {
                let collections;
                if (context.getStore(CollectionsStore).getCollections() > 0) {
                    collections = context.getStore(CollectionsStore).getCollections().join(',');
                }
                context.executeAction(fetchProductSuggestions, {metadata: {mainCollection: collections}}, callback);
            }
        ], done);
    };

    //*** Page Title and Snippets ***//

    static pageTitleAndSnippets = function (context, params, query) {
        return {
            title: `${context.getStore(IntlStore).getMessage(intlData, 'title')} - ${config.app.title[context.getStore(IntlStore).getCurrentLocale()]}`
        }
    };

    //*** Initial State ***//

    state = {
        contents: this.context.getStore(ContentsListStore).getContents(),
        loading: this.context.getStore(ContentsListStore).isLoading(),
        error: this.context.getStore(ContentsListStore).getError(),
        categories: this.context.getStore(CollectionsStore).getCollections(['category']),
        collections: this.context.getStore(CollectionsStore).getCollections(['collection']),
        productSuggestions: this.context.getStore(ProductSuggestionsStore).getProducts(),
        productSuggestionsLoading: this.context.getStore(ProductSuggestionsStore).isLoading()
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ArticlesListingPage.scss');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            contents: nextProps._contents,
            loading: nextProps._loading,
            error: nextProps._error,
            categories: nextProps._categories,
            collections: nextProps._collections,
            productSuggestions: nextProps._productSuggestions,
            productSuggestionsLoading: nextProps._productSuggestionsLoading
        });
    }

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let locale = this.context.intl.locale;
        let query = queryString.parse(this.props.location.search);

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
            <div className="articles-listing-page">
                <div className="article-listing-page__header">
                    <div className="article-listing-page__title">
                        <Heading size="large">
                            <i className="fa fa-file-text-o" aria-hidden="true" />
                            &nbsp;
                            <FormattedMessage id="articlesListingHeader"
                                values={{ 'appTitle': config.app.brand }} />
                        </Heading>
                    </div>
                    <div className="article-listing-page__headline">
                        <Text>
                            <FormattedMessage id="articlesHeadline" />
                        </Text>
                    </div>
                </div>
                <div className="article-listing-page__body">
                    <div className="article-listing-page__left-column">
                        {query.collections ?
                            <div className="article-listing-page__view-all">
                                <Link to={`/${locale}/articles`}>
                                    <Text>
                                        <i className="fa fa-chevron-left" aria-hidden="true" />
                                        &nbsp;
                                        <FormattedMessage id="viewAllArticles" />
                                    </Text>
                                </Link>
                            </div>
                            :
                            null
                        }
                        {filters.map((item, idx) => {
                            let links = item.collections.map((col) => {
                                return {
                                    name: col.name,
                                    to: `/${locale}/articles`,
                                    query: {
                                        collections: col.id
                                    },
                                    selected: query.collections ? query.collections.split(',').indexOf(col.id) !== -1 : false
                                };
                            });
                            if (links.length > 0) {
                                return (
                                    <div key={idx} className="article-listing-page__filter">
                                        <TreeMenu links={links}>
                                            {item.name[locale]}
                                        </TreeMenu>
                                    </div>
                                );
                            }
                        })}
                    </div>
                    <div className="article-listing-page__center-column">
                        {this.state.contents.length > 0 ?
                            <div className="article-listing-page__list">
                                {this.state.contents.filter(c => c.type === 'article').map((content, idx) => {
                                    return (
                                        <div key={idx} className="article-listing-page__item">
                                            <Link className="article-listing-page__item-link" to={`/${locale}/articles/${content.id}/${slugify(content.name[locale])}`}>
                                                <ArticleSummary key={idx} content={content} hideLink={true} />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                            :
                            <div className="article-listing-page__list article-listing-page__noResults">
                                <Text>
                                    <FormattedMessage id="noResults" />!
                                </Text>
                            </div>
                        }
                    </div>
                    <div className="article-listing-page__right-column">
                        <div className="article-listing-page__newsletter">
                            <div className="article-listing-page__newsletter-cta">
                                <Heading size="small">
                                    <FormattedMessage id="newsletterCta" />
                                </Heading>
                            </div>
                            <NewsletterSubscription />
                        </div>
                        {this.state.productSuggestions && this.state.productSuggestions.length > 0 ?
                            <div className="article-listing-page__product-suggestions">
                                <ProductSuggestions products={this.state.productSuggestions} loading={this.state.productSuggestionsLoading}>
                                    <FormattedMessage id="suggestedProducts" />
                                </ProductSuggestions>
                            </div>
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Flux
 */
ArticlesListingPage = connectToStores(ArticlesListingPage, [CollectionsStore, ContentsListStore, ProductSuggestionsStore], (context) => {
    return {
        _contents: context.getStore(ContentsListStore).getContents(),
        _loading: context.getStore(ContentsListStore).isLoading(),
        _error: context.getStore(ContentsListStore).getError(),
        _categories: context.getStore(CollectionsStore).getCollections(['category']),
        _collections: context.getStore(CollectionsStore).getCollections(['collection']),
        _productSuggestions: context.getStore(ProductSuggestionsStore).getProducts(),
        _productSuggestionsLoading: context.getStore(ProductSuggestionsStore).isLoading()
    };
});

/**
 * Exports
 */
export default ArticlesListingPage;
