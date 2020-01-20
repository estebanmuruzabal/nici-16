/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {slugify} from '../../../utils/strings';

// Required components
import Heading from '../typography/Heading';
import Text from '../typography/Text';

/**
 * Component
 */
class ArticleSuggestions extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ArticleSuggestions.scss');
    }

    //*** Template ***//

    render() {
        let locale = this.context.intl.locale;
        return (
            <div className="article-suggestions">
                {this.props.children ?
                    <Heading size="small" align="center">{this.props.children}</Heading>
                    :
                    null
                }
                <div className="article-suggestions__list">
                    {this.props.articles.map(function (article) {
                        return (
                            <div className="article-suggestions__item">
                                <div className="article-suggestions__item-icon">
                                    <i className="fa fa-file-text-o fa-2x" aria-hidden="true" />
                                </div>
                                <div className="article-suggestions__title">
                                    <Link className="article-suggestions__link"
                                          to={`/${locale}/articles/${article.id}/${slugify(article.name[locale])}`}>
                                        <Text>
                                            {article.name[locale]}
                                        </Text>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

/**
 * Exports
 */
export default ArticleSuggestions;
