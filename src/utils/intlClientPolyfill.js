// Contains utils to download the locale data for the current language, eventually
// requiring the `Intl` polyfill for browser not supporting it
// It is used in client.js *before* rendering the root component.
// (code borrowed from Isomorphic5000)

/**
 * Imports.
 */
import Debug from 'debug';
import isIntlLocaleSupported from 'intl-locales-supported';

const debug = Debug('intl');

/**
 * Returns a promise which is resolved when Intl has been polyfilled.
 */
const loadIntlPolyfill = function (locale) {

    if (window.Intl && isIntlLocaleSupported(locale)) {
        // all fine: Intl is in the global scope and the locale data is available
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        debug('Intl or locale data for %s not available, downloading the polyfill...', locale);

        // When building: create a intl chunk with webpack
        // When executing: run the callback once the chunk has been download.
        import(/* webpackChunkName: "intl" */ 'intl')
                .then(module => {
                    debug('Intl polyfill for %s has been loaded', locale);
                    resolve();
                })
                .catch(err => {
                    debug(err);
                });
    });
};

/**
 * Returns a promise which is resolved as the required locale-data chunks
 * has been downloaded with webpack's require.ensure. For each language,
 * we make two different chunks: one for browsers supporting `intl` and one
 * for those who don't.
 * The react-intl locale-data is required, for example, by the FormattedRelative
 * component.
 */
const loadLocaleData = function (locale) {

    const hasIntl = isIntlLocaleSupported(locale);

    // Make sure ReactIntl is in the global scope: this is required for adding locale-data
    // Since ReactIntl needs the `Intl` polyfill to be required (sic) we must place
    // this require here, when loadIntlPolyfill is supposed to be present
    require('expose-loader?ReactIntl!react-intl');

    return new Promise((resolve) => {

        switch (locale) {

            //
            // Ukranian (default)
            //
            case 'uk':
                if (!hasIntl) {
                    import(/* webpackChunkName: "locale-uk" */ 'intl/locale-data/jsonp/uk')
                        .then(module => {
                            import(/* webpackChunkName: "locale-uk" */ 'react-intl/locale-data/uk')
                                .then(module => {
                                    debug('Intl and ReactIntl locale-data for %s has been downloaded', locale);
                                    resolve(module.default);
                                })
                        })
                        .catch(err => {
                            debug(err);
                        });
                }
                else {
                    import(/* webpackChunkName: "locale-uk-no-intl" */ 'react-intl/locale-data/uk')
                        .then(module => {
                            debug('ReactIntl locale-data for %s has been downloaded', locale);
                            resolve(module.default);
                        })
                        .catch(err => {
                            debug(err);
                        });
                }
                break;

            //
            // Russian
            //
            case 'ru':
                if (!hasIntl) {
                    import(/* webpackChunkName: "locale-ru" */ 'intl/locale-data/jsonp/ru')
                        .then(module => {
                            import(/* webpackChunkName: "locale-ru" */ 'react-intl/locale-data/ru')
                                .then(module => {
                                    debug('Intl and ReactIntl locale-data for %s has been downloaded', locale);
                                    resolve(module.default);
                                })
                        })
                        .catch(err => {
                            debug(err);
                        });
                }
                else {
                    import(/* webpackChunkName: "locale-ru-no-intl" */ 'react-intl/locale-data/ru')
                        .then(module => {
                            debug('ReactIntl locale-data for %s has been downloaded', locale);
                            resolve(module.default);
                        })
                        .catch(err => {
                            debug(err);
                        });
                }
                break;
                            //
            // Spanish
            //
            case 'es':
                if (!hasIntl) {
                    import(/* webpackChunkName: "locale-es" */ 'intl/locale-data/jsonp/es')
                        .then(module => {
                            import(/* webpackChunkName: "locale-es" */ 'react-intl/locale-data/es')
                                .then(module => {
                                    debug('Intl and ReactIntl locale-data for %s has been downloaded', locale);
                                    resolve(module.default);
                                })
                        })
                        .catch(err => {
                            debug(err);
                        });
                }
                else {
                    import(/* webpackChunkName: "locale-ru-no-intl" */ 'react-intl/locale-data/es')
                        .then(module => {
                            debug('ReactIntl locale-data for %s has been downloaded', locale);
                            resolve(module.default);
                        })
                        .catch(err => {
                            debug(err);
                        });
                }
                break;
            //
            // English
            //
            default:
                if (!hasIntl) {
                    import(/* webpackChunkName: "locale-en" */ 'intl/locale-data/jsonp/en')
                        .then(module => {
                            debug('Intl locale-data for %s has been downloaded', locale);
                            resolve(module.default);
                        })
                        .catch(err => {
                            debug(err);
                        });
                }
                else {
                    resolve();
                }
        } // EOS (End-of-Switch)
    });
};

/**
 * Export.
 */
export {loadIntlPolyfill, loadLocaleData};
