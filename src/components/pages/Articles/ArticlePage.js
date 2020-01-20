/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import config from '../../../config';

// Flux
import AccountStore from '../../../stores/Account/AccountStore';
import CollectionsStore from '../../../stores/Collections/CollectionsStore';
import ContentDetailsStore from '../../../stores/Contents/ContentDetailsStore';
import IntlStore from '../../../stores/Application/IntlStore';
import ProductSuggestionsStore from '../../../stores/Products/ProductSuggestionsStore';

import fetchContentAndCheckIfFound from '../../../actions/Contents/fetchContentAndCheckIfFound';
import fetchProductSuggestions from '../../../actions/Products/fetchProductSuggestions';
import submitComment from '../../../actions/Contents/submitComment';

// Required components
import ArticleSuggestions from '../../common/articles/ArticleSuggestions';
import Breadcrumbs from '../../common/navigation/Breadcrumbs';
import CommentBox from '../../common/comments/CommentBox';
import Heading from '../../common/typography/Heading';
import MarkdownHTML from '../../common/typography/MarkdownHTML';
import NewsletterSubscription from '../../common/forms/NewsletterSubscription';
import NotFound from '../../pages/NotFound/NotFound';
import ProductSuggestions from '../../common/products/ProductSuggestions';
import Spinner from '../../common/indicators/Spinner';
import Text from '../../common/typography/Text';

// Translation data for this component
import intlData from './ArticlePage.intl';

/**
 * Component
 */
class ArticlePage extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Required Data ***//

    static fetchData = function (context, params, query, done) {
        return context.executeAction(fetchContentAndCheckIfFound, params.contentId, done);
    };

    //*** Page Title and Snippets ***//

    static pageTitleAndSnippets = function (context) {
        let intlStore = context.getStore(IntlStore);
        let content = context.getStore(ContentDetailsStore).getContent();
        if (content && content.type === 'article') {
            return {
                title: `${intlStore.getMessage(content.name)} - ${config.app.title[intlStore.getCurrentLocale()]}`
            }
        } else if (content && content.type !== 'article') {
            return {
                title: intlStore.getMessage(intlData, 'invalidArticle')
            }
        } else {
            return {
                title: intlStore.getMessage(intlData, 'articleNotFound')
            }
        }
    };

    //*** Initial State ***//

    state = {
        user: this.context.getStore(AccountStore).getAccountDetails(),
        loading: this.context.getStore(ContentDetailsStore).isLoading(),
        error: this.context.getStore(ContentDetailsStore).getError(),
        content: this.context.getStore(ContentDetailsStore).getContent(),
        suggestions: this.context.getStore(ProductSuggestionsStore).getProducts(),
        suggestionsLoading: this.context.getStore(ProductSuggestionsStore).isLoading(),
        relatedArticles: [],
        submittingComment: false
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ArticlePage.scss');

        // Fetch product suggestions for given article
        if (this.state.content) {
            let collections;
            if (this.state.content.collections.length > 0) {
                collections = this.state.content.collections.join(',');
            }
            this.context.executeAction(fetchProductSuggestions, {metadata: {mainCollection: collections}});
        }
    }

    componentWillReceiveProps(nextProps) {

        // If comment was being submitted, check if Article has recently been updated
        if (this.state.submittingComment && this.state.loading && !nextProps._loading) {
            this.setState({submittingComment: false});
        }

        // Update state
        this.setState({
            user: nextProps._user,
            loading: nextProps._loading,
            error: nextProps._error,
            content: nextProps._content,
            suggestions: nextProps._suggestions,
            suggestionsLoading: nextProps._suggestionsLoading
        });
    }

    //*** View Controllers ***//

    handleCommentSubmit = (message) => {
        this.setState({submittingComment: true});
        this.context.executeAction(submitComment, {contentId: this.state.content.id, message});
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let locale = this.context.intl.locale;

        let breadcrumbs;
        if (this.state.content) {
            breadcrumbs = this.state.content.collections.map((collectionId) => {
                let collection = this.context.getStore(CollectionsStore).getCollection(collectionId);
                if (collection) {
                    return {
                        name: collection.name[locale],
                        to: `/${locale}/articles`,
                    };
                }
            });
        }

        //
        // Return
        //
        return (
            <div className="article-page" itemScope itemType="http://schema.org/Article">
                {!this.state.content ?
                    <NotFound />
                    :
                    null
                }
                {this.state.content ?
                    <div>
                        <div style={{display: 'none'}}>
                            <span itemProp="datePublished">
                                {this.state.content.createdAt}
                            </span>
                            <span itemProp="dateModified">
                                {this.state.content.updatedAt}
                            </span>
                            {this.state.content.name ?
                                <span itemProp="name">
                                    {this.state.content.name[locale]}
                                </span>
                                :
                                null
                            }
                            {this.state.content.body && this.state.content.body.summary ?
                                <span itemProp="headline">
                                    {this.state.content.body.summary[locale]}
                                </span>
                                :
                                null
                            }
                            <span itemProp="author">
                                {config.app.brand}
                            </span>
                            <span itemProp="publisher">
                                {config.app.brand}
                            </span>
                        </div>
                        {this.state.content.type === 'article' && this.state.content.body.markdown
                            ?
                            <div>
                                <div className="article-page__header">
                                    <div className="article-page__title">
                                        <Heading size="large">
                                            {this.state.content.name[locale]}
                                        </Heading>
                                        <Breadcrumbs links={breadcrumbs} disableResponsive={true} />
                                    </div>
                                    <div className="article-page__articles-home">
                                        <Link className="article-page__link" to={`/${locale}/articles`} >
                                            <i className="fa fa-chevron-left" aria-hidden="true" />
                                            <FormattedMessage id="viewAllArticles" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="article-page__content">
                                    <div className="article-page__left-column">
                                        <div className="article-page__triangle"></div>
                                        <div className="article-page__markdown" itemProp="articleBody">
                                            <MarkdownHTML>
                                                {this.state.content.body.markdown[locale]}
                                            </MarkdownHTML>
                                        </div>
                                        <div className="article-page__comments">
                                            {this.state.submittingComment ?
                                                <Spinner />
                                                :
                                                <CommentBox comments={this.state.content.comments}
                                                            user={this.state.user}
                                                            onSubmitClick={this.handleCommentSubmit}
                                                            disabled={this.state.loading} />
                                            }

                                        </div>
                                    </div>
                                    <div className="article-page__right-column">
                                        <div className="article-page__newsletter">
                                            <div className="article-page__newsletter-cta">
                                                <Heading size="small">
                                                    <FormattedMessage id="newsletterCta" />
                                                </Heading>
                                            </div>
                                            <NewsletterSubscription signupSource={`Article ${this.state.content.id}`} />
                                        </div>
                                        {this.state.suggestions && this.state.suggestions.length > 0 ?
                                            <div className="article-page__product-suggestions">
                                                <ProductSuggestions products={this.state.suggestions} loading={this.state.suggestionsLoading}>
                                                    <FormattedMessage id="suggestedProducts" />
                                                </ProductSuggestions>
                                            </div>
                                            :
                                            null
                                        }
                                        {this.state.relatedArticles && this.state.relatedArticles.length > 0 ?
                                            <div className="article-page__article-suggestions">
                                                <ArticleSuggestions articles={this.state.relatedArticles}>
                                                    <FormattedMessage id="suggestedArticles" />
                                                </ArticleSuggestions>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                                <Text>
                                    <FormattedMessage id="invalidArticle" />
                                </Text>
                            </div>
                        }
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}

/**
 * Flux
 */
ArticlePage = connectToStores(ArticlePage, [AccountStore, ContentDetailsStore, ProductSuggestionsStore], (context) => {
    return {
        _user: context.getStore(AccountStore).getAccountDetails(),
        _loading: context.getStore(ContentDetailsStore).isLoading(),
        _error: context.getStore(ContentDetailsStore).getError(),
        _content: context.getStore(ContentDetailsStore).getContent(),
        _suggestions: context.getStore(ProductSuggestionsStore).getProducts(),
        _suggestionsLoading: context.getStore(ProductSuggestionsStore).isLoading()
    };
});

/**
 * Exports
 */
export default ArticlePage;
