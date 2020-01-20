/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import config from '../../../config';

// Flux
import IntlStore from '../../../stores/Application/IntlStore';
import ResetStore from '../../../stores/Account/ResetStore';

import resetConfirm from '../../../actions/Account/resetConfirm';

// Required components
import Button from '../../common/buttons/Button';
import Heading from '../../common/typography/Heading';
import InputField from '../../common/forms/InputField';
import Modal from '../../common/modals/Modal';
import Text from '../../common/typography/Text';

// Translation data for this component
import intlData from './ResetConfirm.intl';

/**
 * Component
 */
class ResetConfirm extends React.Component {

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
        loading: this.context.getStore(ResetStore).isLoading(),
        error: this.context.getStore(ResetStore).getError(),

        password: '',
        passwordConfirm: '',
        fieldErrors: {},
        errorMessage: undefined,
        showSuccessModal: false
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./ResetConfirm.scss');
    }

    componentWillReceiveProps(nextProps) {

        // Find field error descriptions in request response
        let fieldErrors = {};
        if (this.state.loading && !nextProps._loading && nextProps._error) {
            if (nextProps._error.validation && nextProps._error.validation.keys) {
                nextProps._error.validation.keys.forEach((field) => {
                    fieldErrors[field] = nextProps._error.validation.details[field];
                    if (field === 'token') {
                        this.setState({errorMessage: nextProps._error.validation.details[field]});
                    }
                });
            } else if (nextProps._error.hasOwnProperty('message')) {
                this.setState({errorMessage: nextProps._error.message});
            } else {
                this.setState({
                    errorMessage: this.context.intl.formatMessage({id: 'unknownError'})
                });
            }
        }

        // Check for a successful reset request
        if (this.state.loading && !nextProps._loading && !nextProps._error) {
            this.setState({showSuccessModal: true});
        }

        // Update state
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

        this.setState({errorMessage: null});
        this.setState({fieldErrors: {}});
        let fieldErrors = {};
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
            this.context.executeAction(resetConfirm, {
                token: this.props.match.params.token,
                password: this.state.password
            });
        }
    };

    handleModalContinueClick = () => {
        this.props.history.push(`/${this.context.intl.locale}/login`);
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let successModal = () => {
            if (this.state.showSuccessModal) {
                return (
                    <Modal title={this.context.intl.formatMessage({id: 'resetConfirmSuccessModalTitle'})}>
                        <div className="reset-confirm__modal-body">
                            <Text size="medium">
                                <FormattedMessage id="resetConfirmSuccessModalBody" />
                            </Text>
                        </div>
                        <div className="reset-confirm__modal-footer">
                            <Button type="primary" onClick={this.handleModalContinueClick}>
                                <FormattedMessage id="resetConfirmSuccessModalContinue" />
                            </Button>
                        </div>
                    </Modal>
                );
            }
        };

        //
        // Return
        //
        return (
            <div className="reset-confirm">
                {successModal()}
                <div className="reset-confirm__container">
                    <div className="reset-confirm__header">
                        <Heading>
                            <FormattedMessage id="resetConfirmHeader" />
                        </Heading>
                    </div>
                    {this.state.errorMessage ?
                        <div className="reset-confirm__error-message">
                            <Text size="small">{this.state.errorMessage}</Text>
                        </div>
                        :
                        null
                    }
                    <div className="reset-confirm__form">
                        <div className="reset-confirm__form-item">
                            <InputField type="password"
                                        label={this.context.intl.formatMessage({id: 'password'})}
                                        onChange={this.handleFieldChange.bind(null, 'password')}
                                        value={this.state.password}
                                        onEnterPress={this.handleSubmitClick}
                                        error={this.state.fieldErrors['password']} />
                        </div>
                        <div className="reset-confirm__form-item">
                            <InputField type="password"
                                        label={this.context.intl.formatMessage({id: 'passwordConfirm'})}
                                        onChange={this.handleFieldChange.bind(null, 'passwordConfirm')}
                                        value={this.state.passwordConfirm}
                                        onEnterPress={this.handleSubmitClick}
                                        error={this.state.fieldErrors['passwordConfirm']} />
                        </div>
                        <div className="reset-confirm__form-actions">
                            <Button type="primary" onClick={this.handleSubmitClick} disabled={this.state.loading}>
                                <FormattedMessage id="resetButton" />
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
ResetConfirm = connectToStores(ResetConfirm, [ResetStore], (context) => {
    return {
        _error: context.getStore(ResetStore).getError(),
        _loading: context.getStore(ResetStore).isLoading()
    };
});

/**
 * Exports
 */
export default ResetConfirm;
