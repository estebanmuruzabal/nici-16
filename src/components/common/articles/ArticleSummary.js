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
class ArticleSummary extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ArticleSummary.scss');
    }

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let locale = this.context.intl.locale;

        let headingSize = 'medium';
        if (['small', 'large'].indexOf(this.props.size) !== -1) {
            headingSize = this.props.size;
        }

        let showReadMore = this.props.content.body.markdown && this.props.content.body.markdown[locale]
            && this.props.content.body.markdown[locale] !== ''
            && !this.props.hideLink;

        //
        // Return
        //
        return (
            <div className="article-summary">
                <Heading size={headingSize}>
                    {this.props.content.name[locale]}
                </Heading>
                <div className="article-summary__content">
                    <Text size="small">
                        {this.props.content.body.summary[locale]}
                        {showReadMore ?
                            <Link className="article-summary__link"
                                  to={`/${locale}/articles/${this.props.content.id}/${slugify(this.props.content.name[locale])}`}>
                                <FormattedMessage id="readMore" />
                                <i className="fa fa-file-text-o" aria-hidden="true" />
                            </Link>
                            :
                            null
                        }
                    </Text>
                </div>
            </div>
        );
    }
}

/**
 * Exports
 */
export default ArticleSummary;
