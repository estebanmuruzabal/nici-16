/**
 * Imports.
 */
import createStore from 'fluxible/addons/createStore';

import accountActions from '../../constants/account';

/**
 * Create Store.
 */
const LoginStore = createStore({

    storeName: 'LoginStore',

    handlers: {
        [accountActions.ACCOUNT_LOGIN]: 'handleLoginRequest',
        [accountActions.ACCOUNT_LOGIN_SUCCESS]: 'handleLoginSuccess',
        [accountActions.ACCOUNT_LOGIN_ERROR]: 'handleLoginError',

        [accountActions.ACCOUNT_LOGOUT_SUCCESS]: 'handleLogoutSuccess'
    },

    initialize: function () {
        this.loading = false;
        this.error = undefined;
    },

    getState: function () {
        return {
            loading: this.loading,
            error: this.error
        };
    },

    //
    // Isomorphic stuff.
    //

    dehydrate: function () {
        return this.getState();
    },

    rehydrate: function (state) {
        this.loading = state.loading;
        this.error = state.error;
    },

    //
    // Getters.
    //

    isLoading: function () {
        return this.loading;
    },

    isLoggedIn: function () {
        return !!this.getToken();
    },

    getError: function () {
        return this.error;
    },

    getToken: function () {
        if (this && this.getContext && this.getContext().getCookie) {
            return this.getContext().getCookie('authToken');
        } else {
            return null;
        }
    },

    //
    // Handlers.
    //

    handleLoginRequest: function () {
        this.loading = true;
        this.emitChange();
    },

    handleLoginSuccess: function (payload) {
        this.loading = false;
        this.error = null;
        this.getContext().setCookie('authToken', payload.authToken, {maxAge: 5 * 24 * 60 * 60, path: '/'});
        this.emitChange();
    },

    handleLoginError: function (payload) {
        this.loading = false;
        this.error = payload;
        this.getContext().clearCookie('authToken');
        this.emitChange();
    },

    handleLogoutSuccess: function () {
        this.loading = false;
        this.error = null;
        this.getContext().clearCookie('authToken');
        this.emitChange();
    }
});

/**
 * Export Store.
 */
export default LoginStore;
