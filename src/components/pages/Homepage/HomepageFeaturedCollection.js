/**
 * Imports.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Required components
import Text from '../../common/typography/Text';

/**
 * Component.
 */
class HomepageFeaturedCollection extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./HomepageFeaturedCollection.scss');
    }

    //*** Template ***//

    render() {

        let locale = this.context.intl.locale;

        if (this.props.feature && this.props.feature.img) {
            return (
                <div className="homepage-featured-collection">
                    <Link to={this.props.feature.link.to} params={this.props.feature.link.params}>
                        <img className="homepage-featured-collection__image" src={this.props.feature.img.src} alt={this.props.feature.img.alt} />
                    </Link>
                </div>
            );
        } else if (this.props.feature) {
            return (
                <div className="homepage-featured-collection homepage-featured-collection__placeholder">
                    <Link to={this.props.feature.link.to} params={this.props.feature.link.params}>
                        <div>
                            <Text size="large">
                                {this.props.feature.name[locale]}
                            </Text>
                        </div>
                    </Link>
                </div>
            );
        } else {
            return (
                <div className="homepage-featured-collection homepage-featured-collection__placeholder"></div>
            );
        }
    }
}

/**
 * Export.
 */
export default HomepageFeaturedCollection;
