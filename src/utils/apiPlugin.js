/**
 * Imports
 */
import API from '../api';
import cookie from 'cookie';

// Flux
import LoginStore from '../stores/Account/LoginStore';

/**
 * Plugin that gives actions access to the API wrappers
 */
const apiPlugin = {
    // Required unique name property
    name: 'ApiPlugin',

    /**
     * Called after context creation to dynamically create a context plugin
     * @method plugContext
     * @param {Object} options Options passed into createContext
     * @param {Object} context FluxibleContext instance
     * @param {Object} app Fluxible instance
     */
    plugContext: function (options, context, app) {
        // `options` is the same as what is passed into `Fluxible.createContext(options)`
        let config = options.config && options.config.api;

        let req = options.req;
        let res = options.res;
        let cookies = req ? req.cookies : cookie.parse(document.cookie);

        // Returns a context plugin
        return {
            /**
             * Method called to allow modification of the action context
             * @method plugActionContext
             * @param {Object} actionContext Options passed into createContext
             * @param {Object} context FluxibleContext instance
             * @param {Object} app Fluxible instance
             */
            plugActionContext: function (actionContext, context, app) {
                let getAuthToken = context.getStore(LoginStore).getToken;

                // This should be done on LoginStore, but there is conflict of plugins:
                // we couldn't have access to storeContext plugin method from this plugin method
                if (!getAuthToken()) {
                    getAuthToken = function () {
                        return cookies['authToken'];
                    }
                }

                actionContext.api = new API({
                    options: config,
                    getAuthToken: getAuthToken
                });
            },

            plugStoreContext: function (storeContext, context, app) {
                storeContext.setCookie = function (name, value, options) {
                    let cookieStr = cookie.serialize(name, value, options);
                    if (res) {
                        let header = res.getHeader('Set-Cookie') || [];
                        if (!Array.isArray(header)) {
                            header = [header];
                        }

                        header.push(cookieStr);
                        res.setHeader('Set-Cookie', header);
                    } else {
                        document.cookie = cookieStr;
                    }
                    cookies[name] = value;
                };
                storeContext.clearCookie = function (name, options) {
                    storeContext.setCookie(name, "", {maxAge: -1, path: '/' });
                    delete cookies[name];
                };
                storeContext.getCookie = function (name) {
                    return cookies[name];
                };
            },

            /**
             * Allows context plugin settings to be persisted between server and client. Called on server
             * to send data down to the client
             * @method dehydrate
             */
            dehydrate: function () {
                return {
                    config: config
                };
            },

            /**
             * Called on client to rehydrate the context plugin settings
             * @method rehydrate
             * @param {Object} state Object to rehydrate state
             */
            rehydrate: function (state) {
                config = state.config;
            }
        };
    },

    /**
     * Allows dehydration of application plugin settings
     * @method dehydrate
     */
    dehydrate: function () { return {}; },

    /**
     * Allows rehydration of application plugin settings
     * @method rehydrate
     * @param {Object} state Object to rehydrate state
     */
    rehydrate: function (state) {}
};

/**
 * Export
 */
export default apiPlugin;
