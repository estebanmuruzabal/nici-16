/**
 * Imports.
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import config from '../../../config';

// Flux
import AccountStore from '../../../stores/Account/AccountStore';
import IntlStore from '../../../stores/Application/IntlStore';
import RegisterStore from '../../../stores/Account/RegisterStore';

import registerAccount from '../../../actions/Account/registerAccount';

// Required components
import Button from '../../common/buttons/Button';
import Heading from '../../common/typography/Heading';
import InputField from '../../common/forms/InputField';
import Modal from '../../common/modals/Modal';
import Text from '../../common/typography/Text';

// Translation data for this component
import intlData from './Register.intl';

/**
 * Component.
 */
class Register extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Page Title and Snippets ***//

    static pageTitleAndSnippets = function (context) {
        return {
            title: `${context.getStore(IntlStore).getMessage(intlData, 'title')} - ${config.app.title[context.getStore(IntlStore).getCurrentLocale()]}`
        }
    };

    //*** Initial State ***//

    state = {
        name: undefined,
        email: undefined,
        password: undefined,
        passwordConfirm: undefined,
        loading: this.context.getStore(RegisterStore).isLoading(),
        error: this.context.getStore(RegisterStore).getError(),
        fieldErrors: {},
        showSuccessModal: false
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./Register.scss');
    }

    componentWillReceiveProps(nextProps) {

        // Find field error descriptions in request response
        let fieldErrors = {};
        if (nextProps._error && nextProps._error.validation && nextProps._error.validation.keys) {
            nextProps._error.validation.keys.forEach(function (field) {
                fieldErrors[field] = nextProps._error.validation.details[field];
            });
        }

        // Check for a successful register
        if (this.state.loading && !nextProps._loading && !nextProps._error) {
            this.setState({showSuccessModal: true});
        }

        this.setState({
            loading: nextProps._loading,
            error: nextProps._error,
            fieldErrors: fieldErrors
        })
    }

    //*** View Controllers ***//

    handleFieldChange = (param, value) => {
        this.setState({[param]: value});
    };

    handleSubmitClick = () => {
        this.setState({fieldErrors: {}});
        let fieldErrors = {};
        if (!this.state.name) {
            fieldErrors.name = this.context.intl.formatMessage({id: 'fieldRequired'});
        }
        if (!this.state.email) {
            fieldErrors.email = this.context.intl.formatMessage({id: 'fieldRequired'});
        }
        if (!this.state.password) {
            fieldErrors.password = this.context.intl.formatMessage({id: 'fieldRequired'});
        }
        if (!this.state.passwordConfirm) {
            fieldErrors.passwordConfirm = this.context.intl.formatMessage({id: 'fieldRequired'});
        }
        if (this.state.password && this.state.passwordConfirm && this.state.password != this.state.passwordConfirm) {
            fieldErrors.passwordConfirm = this.context.intl.formatMessage({id: 'passwordMismatch'});
        }
        this.setState({fieldErrors: fieldErrors});

        if (Object.keys(fieldErrors).length === 0) {
            this.context.executeAction(registerAccount, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            });
        }
    };

    handleModalContinueClick = () => {
        this.props.history.push(`/${this.context.intl.locale}`);
    };

    //*** Template ***//

    render() {

        let successModal = () => {
            if (this.state.showSuccessModal) {
                return (
                    <Modal title={this.context.intl.formatMessage({id: 'registerSuccessModalTitle'})}>
                        <div className="register__modal-body">
                            <Text size="medium">
                                <FormattedMessage id="registerSuccessModalBody" />
                            </Text>
                        </div>
                        <div className="register__modal-footer">
                            <Button type="primary" onClick={this.handleModalContinueClick}>
                                <FormattedMessage id="registerSuccessModalContinue" />
                            </Button>
                        </div>
                    </Modal>
                );
            }
        };

        return (
            <div className="register">
                {successModal()}

                <div className="register__container">
                    <div className="register__header">
                        <Heading>
                            <FormattedMessage id="registerHeader" />
                        </Heading>
                    </div>
                    <div className="register__form">
                        <div className="register__form-item">
                            <InputField label={this.context.intl.formatMessage({id: 'fullName'})}
                                        onChange={this.handleFieldChange.bind(null, 'name')}
                                        onEnterPress={this.handleSubmitClick}
                                        error={this.state.fieldErrors['name']} />
                        </div>
                        <div className="register__form-item">
                            <InputField label={this.context.intl.formatMessage({id: 'email'})}
                                        onChange={this.handleFieldChange.bind(null, 'email')}
                                        onEnterPress={this.handleSubmitClick}
                                        error={this.state.fieldErrors['email']} />
                        </div>
                        <div className="register__form-item">
                            <InputField type="password"
                                        label={this.context.intl.formatMessage({id: 'password'})}
                                        onChange={this.handleFieldChange.bind(null, 'password')}
                                        onEnterPress={this.handleSubmitClick}
                                        error={this.state.fieldErrors['password']} />
                        </div>
                        <div className="register__form-item">
                            <InputField type="password"
                                        label={this.context.intl.formatMessage({id: 'passwordConfirm'})}
                                        onChange={this.handleFieldChange.bind(null, 'passwordConfirm')}
                                        onEnterPress={this.handleSubmitClick}
                                        error={this.state.fieldErrors['passwordConfirm']} />
                        </div>
                        <div className="register__form-actions">
                            <Button type="primary" onClick={this.handleSubmitClick} disabled={this.state.loading}>
                                <FormattedMessage id="registerButton" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Flux
 */
Register = connectToStores(Register, [RegisterStore], (context) => {
    return {
        _error: context.getStore(RegisterStore).getError(),
        _loading: context.getStore(RegisterStore).isLoading()
    };
});

/**
 * Export
 */
export default Register;
