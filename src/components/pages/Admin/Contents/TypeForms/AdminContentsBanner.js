/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// Required components
import Button from '../../../../common/buttons/Button';
import FormLabel from '../../../../common/forms/FormLabel';
import InputField from '../../../../common/forms/InputField';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class AdminContentsBanner extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./AdminContentsBanner.scss');
    }

    //*** View Controllers ***//

    handleFieldChange = (field, value) => {
        let body = this.props.body;
        body[field] = value;
        this.props.onChange(body);
    };

    handleImageURLChange = (value) => {
        let body = this.props.body;
        body.image = {url: value};
        this.props.onChange(body);
    };

    handleRemoveImageClick = () => {
        let body = this.props.body;
        body.image = null;
        this.props.onChange(body);
    };

    //*** Template ***//

    render() {
        return (
            <div className="admin-contents-banner">
                <div className="admin-contents-banner__form-item">
                    <InputField label={this.context.intl.formatMessage({id: 'link'})}
                                onChange={this.handleFieldChange.bind(null, 'link')}
                                value={this.props.body.link} />
                </div>
                <div className="admin-contents-banner__form-item">
                    <div className="admin-contents-banner__image-label">
                        <FormLabel>
                            <FormattedMessage id="bannerImageLabel" />
                        </FormLabel>
                    </div>
                    {this.props.body.image && this.props.body.image.url ?
                        <div className="admin-contents-banner__image-placeholder">
                            <img src={`//${this.props.body.image.url}`} />
                            <div className="admin-contents-banner__placeholder-overlay">
                                <div>
                                    <Button type="primary" onClick={this.handleRemoveImageClick}>
                                        <FormattedMessage id="deleteButton" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <InputField onChange={this.handleImageURLChange} />
                        </div>
                    }

                </div>
            </div>
        );
    }
}

/**
 * Default Props
 */
AdminContentsBanner.defaultProps = {
    onChange: function (value) { debug('onChange not defined', value); }
};

/**
 * Exports
 */
export default AdminContentsBanner;
