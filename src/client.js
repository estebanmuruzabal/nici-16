/**
 * Imports.
 */
/*global document, window */
import Debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import ga from 'react-ga';
import { FluxibleComponent } from 'fluxible-addons-react';
import { addLocaleData, IntlProvider } from 'react-intl';

// Flux
import ApplicationStore from './stores/Application/ApplicationStore';
import CartStore from './stores/Cart/CartStore';

import navigateAction from './actions/Application/navigate';
import pageWidthChanged from './actions/Application/pageWidthChanged';

// Utils
import fetchData from './utils/fetchData';
import {loadIntlPolyfill, loadLocaleData} from './utils/intlClientPolyfill';

import DataLoader from './dataLoader';
import config from './config';
import routes from './routes';
import app from './app';


// Setup and initialize debugging utility.
const debug = Debug('simple-store');

// State sent from the server.
let dehydratedState = window.App;

/**
 * Helper methods
 */

function dispatchPageResize(context) {
    return new Promise(function (resolve, reject) {
        context.executeAction(pageWidthChanged, window.innerWidth, function () { resolve(); });
    });
}

/**
 * Run application.
 * Everything that should be run after certain polyfills are initialized (e.g. Intl in Safari browser) should
 * be encapsulated in this method (e.g. fluxible app require, which needs Intl).
 */
function runApp(locale, messages) {
    // Initialize Google Analytics
    if (config.googleAnalytics.enabled === true) {
        debug('Initialize Google Analytics');
        ga.initialize(config.googleAnalytics.trackingId, config.googleAnalytics.options);
    }

    // Initialize Facebook Pixel
    if (config.facebookPixel.enabled === true) {
        try {
            fbq('init', config.facebookPixel.id);
            debug('Facebook pixel successfully initialized!');
        } catch (err) {
            console.error('Unable to initialize Facebook Pixel', err);
        }
    }

    // Re-hydrate application state.
    debug('rehydrating app');
    app.rehydrate(dehydratedState, async function (err, context) {
        if (err) {
            throw err;
        }
        window.context = context;

        let mountNode = document.getElementById('app');

        // Track Pageviews with Google Analytics
        if (config.googleAnalytics.enabled === true) {
            debug('Track pageview', window.location.pathname);
            ga.pageview(window.location.pathname);
        }

        // Send hit to Facebook Pixel
        try {
            fbq('track', 'PageView');
        } catch (err) {
            debug('Unable to send hit to Facebook Pixel', err);
        }

        debug('React Hydrate');
        await ReactDOM.hydrate(
            (
                <FluxibleComponent context={context.getComponentContext()}>
                    <IntlProvider locale={locale} messages={messages}>
                          <BrowserRouter>
                              <DataLoader routes={routes} context={context.getComponentContext()}>
                                  {renderRoutes(routes)}
                              </DataLoader>
                          </BrowserRouter>
                    </IntlProvider>
                </FluxibleComponent>
            ),
            mountNode,
            function () {
                debug('React Hydrated');
            }
        );

        // Add listener to page size changes and trigger respective action right away
        // so that components that depend on this information for implementing responsive
        // behaviors have this information available now and updated whenever it changes.
        // Note: this should only be triggered after React has finished rendering, to avoid
        // warnings regarding invalid DOM checksums.
        window.addEventListener('resize', dispatchPageResize.bind(null, context), false);
        dispatchPageResize(context);
    });
}

/**
 * If browser does not support Intl, load the polyfill.
 * (Oh... and start the application afterwards!)
 */
const locale = document.documentElement.getAttribute('lang') || 'es'; // Default to spanish

loadIntlPolyfill(locale)
    .then(loadLocaleData.bind(null, locale))
    .then((data) => {
        addLocaleData([...data]);
        import(/* webpackChunkName: "[request]" */ `../static/localizations/${locale}.json`)
            .then(module => {
                runApp(locale, module.default);
            })
            .catch(err => {
                debug(err);
            });
    })
    .catch((err) => {
        console.error('Error loading the Intl polyfill', err);
    });
