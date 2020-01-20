/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Flux
import FileUploadStore from '../../../stores/Files/FileUploadStore';

import uploadFile from '../../../actions/Admin/uploadFile';

// Required components
import FormLabel from '../../common/forms/FormLabel';
import ImageLibrary from '../../common/images/ImageLibrary';
import ImageUpload from '../../common/images/ImageUpload';
import Text from '../../common/typography/Text';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class ImageLibraryManager extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
    };

    //*** Initial State ***//

    state = {
        fileUpload: this.context.getStore(FileUploadStore).getState(),
        fieldErrors: {}
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ImageLibraryManager.scss');
    }

    componentWillReceiveProps(nextProps) {

        let fieldErrors = {};
        if (nextProps._error && nextProps._error.validation && nextProps._error.validation.keys) {
            nextProps._error.validation.keys.forEach(function (field) {
                fieldErrors[field] = nextProps._error.validation.details[field];
            });
        }

        // Check if a file was uploaded
        if (this.state.fileUpload.loading && !nextProps._fileUpload.loading && !nextProps._fileUpload.error) {
            let images = this.props.images;
            images.push(nextProps._fileUpload.file);
            this.props.onChange(images);
        }

        this.setState({
            fileUpload: nextProps._fileUpload,
            fieldErrors: fieldErrors
        });
    }

    //*** View Controllers ***//

    handleImageSubmit = (file) => {
        this.context.executeAction(uploadFile, {
            resource: this.props.resource,
            file: file
        });
    };

    //*** Template ***//

    render() {
        return (
            <div className="image-library-manager">
                <FormLabel>
                    <FormattedMessage id="gallery" />
                </FormLabel>
                <div className="image-library-manager__gallery">
                    <div className="image-library-manager__upload">
                        <ImageUpload onSubmit={this.handleImageSubmit}
                                     disabled={this.state.fileUpload.loading} />
                    </div>
                    <div className="image-library-manager__images">
                        <ImageLibrary images={this.props.images}
                                      onChange={this.props.onChange} />
                    </div>
                </div>
                {this.props.error ?
                    <div className="input-field__error">
                        <Text size="small">{this.props.error}</Text>
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}

/**
 * Default Props
 */
ImageLibraryManager.defaultProps = {
    onChange: function (images) { debug('onChange not defined.', images); }
};

/**
 * Flux
 */
ImageLibraryManager = connectToStores(ImageLibraryManager, [FileUploadStore], (context) => {
    return {
        _fileUpload: context.getStore(FileUploadStore).getState()
    };
});

/**
 * Exports
 */
export default ImageLibraryManager;