/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Required components
import Button from '../../../common/buttons/Button';
import Select from '../../../common/forms/Select';
import Text from '../../../common/typography/Text';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class AdminProductsUpload extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        content: undefined,
        file: undefined,
        fieldErrors: {}
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./AdminProductsUpload.scss');
    }

    //*** View Controllers ***//

    handleTypeChange = (value) => {
        this.setState({type: value});
    };

    handleFileChange = (evt) => {
        this.setState({file: evt.target.files[0]});
    };

    handleSubmitClick = () => {
        let intl = this.context.intl;

        this.setState({fieldErrors: {}});
        let fieldErrors = {};
        if (!this.state.type) {
            fieldErrors.type = intl.formatMessage({id: 'fieldRequired'});
        }
        if (!this.state.file) {
            fieldErrors.file = intl.formatMessage({id: 'fieldRequired'});
        }
        this.setState({fieldErrors: fieldErrors});

        if (Object.keys(fieldErrors).length === 0) {
            this.props.onSubmitClick({
                resource: this.state.type,
                file: this.state.file
            });
        }
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //

        let intl = this.context.intl;

        let uploadTypeOptions = [
            {name: intl.formatMessage({id: 'catalogHeading'}), value: 'catalog'},
            {name: intl.formatMessage({id: 'imagesHeading'}), value: 'images'}
        ];

        //
        // Return
        //
        return (
            <div className="admin-products-upload">
                <div className="admin-products-upload__form-item">
                    <Select label={intl.formatMessage({id: 'type'})}
                            placeholder
                            options={uploadTypeOptions}
                            onChange={this.handleTypeChange}
                            error={this.state.fieldErrors.type} />
                </div>
                <div className="admin-products-upload__form-item">
                    <input ref="input" type="file" className="admin-products-upload__input" onChange={this.handleFileChange} />
                    {this.state.fieldErrors.file ?
                        <div className="admin-products-upload__error">
                            <Text size="small">{this.state.fieldErrors.file}</Text>
                        </div>
                        :
                        null
                    }
                </div>
                <div className="admin-products-upload__actions">
                    <div className="admin-products-upload__button">
                        <Button type="default" onClick={this.props.onCancelClick} disabled={this.props.loading}>
                            <FormattedMessage id="cancelButton" />
                        </Button>
                    </div>
                    <div className="admin-products-upload__button">
                        <Button type="primary" onClick={this.handleSubmitClick} disabled={this.props.loading}>
                            <FormattedMessage id="uploadButton" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Default Props
 */
AdminProductsUpload.defaultProps = {
    onCancelClick: function () { debug('onCancelClick not defined'); },
    onSubmitClick: function (data) { debug(`onSubmitClick not defined. Value: ${data}`); }
};

/**
 * Exports
 */
export default AdminProductsUpload;
