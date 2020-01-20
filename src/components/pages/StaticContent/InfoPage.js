/**
 * Imports
 */
import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

import config from '../../../config';

// Flux
import IntlStore from '../../../stores/Application/IntlStore';

// Required components
import Heading from '../../common/typography/Heading';
import Text from '../../common/typography/Text';

// Translation data for this component
import intlData from './InfoPage.intl';

/**
 * Component
 */
class InfoPage extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired
    };

    //*** Page Title and Snippets ***//

    static pageTitleAndSnippets = function (context, params, query) {
        return {
            title: `${context.getStore(IntlStore).getMessage(intlData, 'title')} - ${config.app.title[context.getStore(IntlStore).getCurrentLocale()]}`
        }
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./InfoPage.scss');
    }

    //*** Template ***//

    render() {
        let intlStore = this.context.getStore(IntlStore);

        return (
            <div className="info-page">
                <div className="info-page__title">
                    <Heading size="large">
                        <FormattedMessage id="aboutUsHeader" />
                    </Heading>
                </div>
                <div className="info-page__content">
                    <div className="info-page__block">
                        <div className="info-page__text">
                            <p>
                                <Text size="medium">
                                    <FormattedMessage id="aboutUsDescriptionFirst" />
                                </Text>
                            </p>
                            <p>
                                <Text size="medium">
                                    <FormattedMessage id="aboutUsDescriptionSecond"/>
                                </Text>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

/**
 * Exports
 */
export default InfoPage;
