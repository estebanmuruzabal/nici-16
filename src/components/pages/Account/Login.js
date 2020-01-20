/**
 * Imports.
 */
import React from 'react';
import queryString from 'query-string';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import config from '../../../config';

// Flux
import AccountStore from '../../../stores/Account/AccountStore';
import CartStore from '../../../stores/Cart/CartStore';
import IntlStore from '../../../stores/Application/IntlStore';
import LoginStore from '../../../stores/Account/LoginStore';

import archiveCart from '../../../actions/Cart/archiveCart';
import loadUserCart from '../../../actions/Cart/loadUserCart';
import login from '../../../actions/Account/login';
import mergeCart from '../../../actions/Cart/mergeCart';

// Required components
import Button from '../../common/buttons/Button';
import Heading from '../../common/typography/Heading';
import InputField from '../../common/forms/InputField';
import Modal from '../../common/modals/Modal';
import Text from '../../common/typography/Text';

// Translation data for this component
import intlData from './Login.intl';

/**
 * Component.
 */
class Login extends React.Component {

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
        loading: this.context.getStore(LoginStore).isLoading(),
        loadingAccountDetails: this.context.getStore(AccountStore).isLoading(),
        loadingCart: this.context.getStore(CartStore).isLoading(),
        error: this.context.getStore(LoginStore).getError(),

        email: undefined,
        password: undefined,
        fieldErrors: {},
        errorMessage: undefined,
        showMergeCartsModal: false,
        loggingIn: false
    };

    //*** Helper Methods ***//

    isLoading = () => {
        return this.state.loading || this.state.loadingAccountDetails || this.state.loadingCart;
    };

    next = () => {
        let query = queryString.parse(this.props.location.search);
        if (query.next) {
            this.props.history.push(query.next);
        } else {
            this.props.history.push(`/${this.context.intl.locale}`);
        }
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./Login.scss');

        // If user is authenticated, redirect to homepage
        if (this.context.getStore(AccountStore).getAccountDetails()) {
            this.props.history.push(`/${this.context.intl.locale}`);
        }
    }

    componentWillReceiveProps(nextProps) {

        // Find field error descriptions in request response
        let fieldErrors = {};
        if (this.state.loading && !nextProps._loading && nextProps._error) {
            if (nextProps._error.validation && nextProps._error.validation.keys) {
                nextProps._error.validation.keys.forEach(function (field) {
                    fieldErrors[field] = nextProps._error.validation.details[field];
                });
            } else if (!nextProps._error.hasOwnProperty('status')) {
                fieldErrors.email = this.context.intl.formatMessage({id: 'invalidCredentials'});
                fieldErrors.password = this.context.intl.formatMessage({id: 'invalidCredentials'});
            } else if (['pendingConfirmation', 'disabled'].indexOf(nextProps._error.status) !== -1) {
                this.setState({
                    errorMessage: this.context.intl.formatMessage({id: nextProps._error.status})
                });
            } else {
                this.setState({
                    errorMessage: this.context.intl.formatMessage({id: 'unknownStatus'})
                });
            }
        }

        // Check for:
        // - Account Details (i.e. we are successfully logged in)
        // - Successful cart claim
        // Now we need to process the cart state
        if (this.state.loggingIn && this.context.getStore(AccountStore).getAccountDetails() && this.state.loadingCart && !nextProps._loadingCart) {

            this.setState({loggingIn: false});

            //
            // The rule of thumb is that we should always use the most recent, not archived, cart of the user and always
            // archive any anonymously claimed carts. The exception is when they (the anonymously claimed) have products
            // and we should ask whether we should merge them. Remember that, if the user chooses NOT to merge them,
            // the products that prevail are the ones of the anonymous cart (since it's the most "recent" cart).
            //

            let userCarts = this.context.getStore(AccountStore).getAccountDetails().carts;

            // a) User has no previous carts, maintain the currently claimed Cart (on the login action)
            // b) The most recent cart is the active one (on store/localstorage)
            if ((!userCarts || userCarts.length === 0) || userCarts[0].id === this.context.getStore(CartStore).getCartId()) {
                this.next();
            }

            // c) Claimed cart has products
            else if (this.context.getStore(CartStore).getProducts().length > 0) {
                this.setState({showMergeCartsModal: true});
            }

            // d) Set the user's most recent cart as the active one and archive claimed cart
            // --> Same as not merging current cart with the one the user had saved
            else {
                this.handleMergeCartsModalNoClick();
            }
        }

        this.setState({
            loading: nextProps._loading,
            loadingAccountDetails: nextProps._loadingAccountDetails,
            loadingCart: nextProps._loadingCart,
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
        if (!this.state.email) {
            fieldErrors.email = this.context.intl.formatMessage({id: 'fieldRequired'});
        }
        if (!this.state.password) {
            fieldErrors.password =this.context.intl.formatMessage({id: 'fieldRequired'});
        }
        this.setState({fieldErrors: fieldErrors});

        if (Object.keys(fieldErrors).length === 0) {
            this.setState({loggingIn: true});
            this.context.executeAction(login, {
                email: this.state.email,
                password: this.state.password
            });
        }
    };

    handleMergeCartsModalNoClick = () => {
        let userCarts = this.context.getStore(AccountStore).getAccountDetails().carts;
        this.context.executeAction(archiveCart, this.context.getStore(CartStore).getCartId());
        this.context.executeAction(loadUserCart, userCarts[0].id);
        this.next();
    };

    handleMergeCartsModalYesClick = () => {
        let userCarts = this.context.getStore(AccountStore).getAccountDetails().carts;
        this.context.executeAction(mergeCart, {
            cartId: userCarts[0].id,
            mergeId: this.context.getStore(CartStore).getCartId()
        });
        this.next();
    };

    //*** Template ***//

    render() {
        // Return the "merge carts" modal
        let mergeCartsModal = () => {
            if (this.state.showMergeCartsModal === true) {
                return (
                    <Modal title={this.context.intl.formatMessage({id: 'mergeCartsTitle'})}>
                        <div className="login__modal-form-item">
                            <FormattedMessage id="mergeCartsConfirm" />
                        </div>
                        <div className="login__modal-form-actions">
                            <div className="login__modal-form-action-item">
                                <Button type="default"
                                        onClick={this.handleMergeCartsModalNoClick}
                                        disabled={this.isLoading()}>
                                    <FormattedMessage id="no" />
                                </Button>
                            </div>
                            <div className="login__modal-form-action-item">
                                <Button type="primary"
                                        onClick={this.handleMergeCartsModalYesClick}
                                        disabled={this.isLoading()}>
                                    <FormattedMessage id="yes" />
                                </Button>
                            </div>
                        </div>
                    </Modal>
                );
            }
        };

        //
        // Return
        //
        return (
            <div className="login">
                {mergeCartsModal()}
                <div className="login__container">
                    <div className="login__header">
                        <Heading>
                            <FormattedMessage id="loginHeader" />
                        </Heading>
                    </div>
                    {this.state.errorMessage ?
                        <div className="login__error-message">
                            <Text size="small">{this.state.errorMessage}</Text>
                        </div>
                        :
                        null
                    }
                    <div className="login__form">
                        <div className="login__form-item">
                            <InputField label={this.context.intl.formatMessage({id: 'email'})}
                                        onChange={this.handleFieldChange.bind(null, 'email')}
                                        onEnterPress={this.handleSubmitClick}
                                        error={this.state.fieldErrors['email']} />
                        </div>
                        <div className="login__form-item">
                            <InputField type="password"
                                        label={this.context.intl.formatMessage({id: 'password'})}
                                        onChange={this.handleFieldChange.bind(null, 'password')}
                                        onEnterPress={this.handleSubmitClick}
                                        error={this.state.fieldErrors['password']} />
                        </div>
                        <div className="login__form-actions">
                            <Button type="primary" onClick={this.handleSubmitClick} disabled={this.isLoading()}>
                                <FormattedMessage id="loginButton" />
                            </Button>
                        </div>
                        <div className="login__form-reset">
                            <Link className="login__link" to={`/${this.context.intl.locale}/reset`} >
                                <FormattedMessage id="forgotPassword" />
                            </Link>
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
Login = connectToStores(Login, [AccountStore, CartStore, LoginStore], (context) => {
    return {
        _error: context.getStore(LoginStore).getError(),
        _loading: context.getStore(LoginStore).isLoading(),
        _loadingAccountDetails: context.getStore(AccountStore).isLoading(),
        _loadingCart: context.getStore(CartStore).isLoading()
    };
});

/**
 * Export
 */
export default Login;
