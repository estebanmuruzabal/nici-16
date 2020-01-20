/**
 * Imports
 */
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {slugify} from '../../../utils/strings';

// Required components
import Heading from '../typography/Heading';
import Spinner from '../indicators/Spinner';
import Text from '../typography/Text';

/**
 * Component
 */
class ProductSuggestions extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        placeholderImage: undefined
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ProductSuggestions.scss');

        // Load static files
        this.setState({
            placeholderImage: require('../images/image_placeholder.png')
        });
    }

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let locale = this.context.intl.locale;

        //
        // Return
        //
        return (
            <div className="product-suggestions">
                {this.props.children ?
                    <Heading size="small" align="center">{this.props.children}</Heading>
                    :
                    null
                }
                {this.props.loading ?
                    <div className="product-suggestions__loading">
                        <Spinner />
                    </div>
                    :
                    <div className="product-suggestions__list">
                        {this.props.products.map((product, idx) => {
                            let image = (product.images && product.images.length > 0) ? `//${product.images[0].url}` : this.state.placeholderImage;
                            return (
                                <div key={idx} className="product-suggestions__item">
                                    <Link to={`/${locale}/products/${product.id}/${slugify(product.name[locale])}`} >
                                        <div className="product-suggestions__item-image">
                                            <img src={image} />
                                        </div>
                                        <div className="product-suggestions__item-name">
                                            <Text size="small">
                                                {product.name[locale]}
                                            </Text>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                }
            </div>
        );
    }
}

/**
 * Exports
 */
export default ProductSuggestions;
