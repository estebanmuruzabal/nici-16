/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';


// Required components
import Button from '../../../common/buttons/Button';
import InputField from '../../../common/forms/InputField';
import Select from '../../../common/forms/Select';
import IntlStore from '../../../../stores/Application/IntlStore';

// Instantiate debugger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class AdminContentsAddForm extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        availableLocales: this.context.getStore(IntlStore).getAvailableLocales(),
        name: {},
        type: undefined,
        fieldErrors: {}
    };

    //*** Component Lifecycle ***//

    componentDidMount() {
        const { name, availableLocales } = this.state;
        availableLocales.map(locale => {
            name[locale] = '';
        });
        this.setState({name});
        // Component styles
        require('./AdminContentsAddForm.scss');
    }

    //*** View Controllers ***//

    handleNameChange = (locale, value) => {
        let name = this.state.name;
        name[locale] = value;
        this.setState({name: name});
    };

    handleSubmitClick = () => {
        const intl = this.context.intl;
        const { availableLocales } = this.state;
        this.setState({fieldErrors: {}});
        let fieldErrors = {};

        if (!this.state.type) {
            fieldErrors.type = intl.formatMessage({id: 'fieldRequired'});
        }
        availableLocales.map(locale => {
            if (!this.state.name[locale]) {
                fieldErrors['name.' + locale] = intl.formatMessage({id: 'fieldRequired'});
            }  
        })
        this.setState({fieldErrors: fieldErrors});

        if (Object.keys(fieldErrors).length === 0) {
            this.props.onSubmitClick({
                type: this.state.type,
                name: this.state.name
            });
        }
    };

    handleTypeChange = (value) => {
        this.setState({type: value});
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //

        const intl = this.context.intl;
        const { availableLocales } = this.state;
        const contentTypeOptions = [
            {name: intl.formatMessage({id: 'article'}), value: 'article'},
            {name: intl.formatMessage({id: 'banner'}), value: 'banner'}
        ];

        const fieldError = (field) => {
            return this.state.fieldErrors[field];
        };

        //
        // Return
        //
        return (
            <div className="admin-contents-add-form">
                <div className="admin-contents-add-form__item">
                    <Select label={intl.formatMessage({id: 'type'})}
                            placeholder
                            options={contentTypeOptions}
                            onChange={this.handleTypeChange}
                            error={fieldError('type')} />
                </div>
                {   availableLocales.map((locale) => {
                    return (
                        <div className="admin-contents-add-form__item">
                            <InputField label={intl.formatMessage({id: 'name'}) + `(${locale.toUpperCase()})`}   
                                        onChange={this.handleNameChange.bind(null, `${locale}`)}
                                        error={fieldError(`name.${locale}`)} />
                        </div>
                    );
                })}
                <div className="admin-contents-add-form__actions">
                    <div className="admin-contents-add-form__button">
                        <Button type="default" onClick={this.props.onCancelClick} disabled={this.props.loading}>
                            <FormattedMessage id="cancelButton" />
                        </Button>
                    </div>
                    <div className="admin-contents-add-form__button">
                        <Button type="primary" onClick={this.handleSubmitClick} disabled={this.props.loading}>
                            <FormattedMessage id="addButton" />
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
AdminContentsAddForm.defaultProps = {
    onCancelClick: function () { debug('onCancelClick not defined'); },
    onSubmitClick: function (data) { debug('onSubmitClick not defined', data); }
};

/**
 * Exports
 */
export default AdminContentsAddForm;
