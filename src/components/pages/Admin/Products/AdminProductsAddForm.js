/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

// store imports
import IntlStore from '../../../../stores/Application/IntlStore';

// Required components
import Button from '../../../common/buttons/Button';
import InputField from '../../../common/forms/InputField';
import Select from '../../../common/forms/Select';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class AdminProductsAddForm extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        name: {},
        availableLocales: this.context.getStore(IntlStore).getAvailableLocales(),
        sku: undefined,
        fieldErrors: {}
    };

    //*** Component Lifecycle ***//

    componentDidMount() {
        const { name, availableLocales } = this.state;
        availableLocales.map(locale => {
            name[locale] = '';
        });
        
        this.setState({name, sku: Number(this.props.lastSKU) + 1});
        // Component styles
        require('./AdminProductsAddForm.scss');
    }

    //*** View Controllers ***//

    handleSKUChange = (value) => {
        this.setState({sku: value});
    };

    handleNameChange = (locale, value) => {
        let name = this.state.name;
        name[locale] = value;
        this.setState({name: name});
    };

    handleSubmitClick = () => {
        let intl = this.context.intl;
        const { availableLocales } = this.state;

        this.setState({fieldErrors: {}});
        let fieldErrors = {};
        if (!this.state.sku) {
            fieldErrors.sku = intl.formatMessage({id: 'fieldRequired'});
        }
        availableLocales.map(locale => {
            if (!this.state.name[locale]) {
                fieldErrors['name.' + locale] = intl.formatMessage({id: 'fieldRequired'});
            }  
        })
        this.setState({fieldErrors: fieldErrors});

        if (Object.keys(fieldErrors).length === 0) {
            this.props.onSubmitClick({
                sku: this.state.sku.toString(),
                name: this.state.name
            });
        }
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //

        let intl = this.context.intl;
        const { availableLocales } = this.state;
        let fieldError = (field) => {
            return this.props.error ? this.props.error[field] : this.state.fieldErrors[field];
        };

        //
        // Return
        //
        return (
            <div className="admin-products-add-form">
                <div className="admin-products-add-form__item">
                    <InputField label={intl.formatMessage({id: 'skuHeading'})}
                                onChange={this.handleSKUChange}
                                value={this.state.sku}
                                error={fieldError('sku')} />
                </div>
                {   availableLocales.map((locale) => {
                    return (
                        <div key={locale} className="admin-products-add-form__item">
                            <InputField label={intl.formatMessage({id: 'name'}) + ` (${locale.toUpperCase()})`}   
                                        onChange={this.handleNameChange.bind(null, `${locale}`)}
                                        error={fieldError(`name.${locale}`)} />
                        </div>
                    );
                })}
                <div className="admin-products-add-form__actions">
                    <div className="admin-products-add-form__button">
                        <Button type="default" onClick={this.props.onCancelClick} disabled={this.props.loading}>
                            <FormattedMessage id="cancelButton" />
                        </Button>
                    </div>
                    <div className="admin-products-add-form__button">
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
AdminProductsAddForm.defaultProps = {
    onCancelClick: function () { debug('onCancelClick not defined'); },
    onSubmitClick: function (data) { debug(`onSubmitClick not defined. Value: ${data}`); }
};

/**
 * Exports
 */
export default AdminProductsAddForm;
