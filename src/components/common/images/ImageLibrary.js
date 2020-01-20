/**
 * Imports
 */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Required components
import Button from '../buttons/Button';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class ImageLibrary extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ImageLibrary.scss');
    }

    //*** View Controllers ***//

    handleViewURLClick = (idx) => {
        alert(this.props.images[idx].url);
    };

    handleRemoveClick = (idx) => {
        let images = this.props.images;
        images.splice(idx, 1);
        this.props.onChange(images);
    };

    //*** Template ***//

    render() {
        return (
            <div className="image-library">
                {this.props.images.map((img, idx) => {
                    return (
                        <div key={idx} className="image-library__placeholder">
                            <img src={`//${img.url}`} />
                            <div className="image-library__placeholder-overlay">
                                <div className="image-library__placeholder-overlay-content">
                                    <div className="image-library__button">
                                        <Button type="default" onClick={this.handleViewURLClick.bind(null, idx)}>
                                            <FormattedMessage id="viewURL" />
                                        </Button>
                                    </div>
                                    <div className="image-library__button">
                                        <Button type="primary" onClick={this.handleRemoveClick.bind(null, idx)}>
                                            <FormattedMessage id="deleteButton" />
                                        </Button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

/**
 * Default Props
 */
ImageLibrary.defaultProps = {
    onChange: function (images) { debug('onChange not defined.', images); }
};

/**
 * Exports
 */
export default ImageLibrary;