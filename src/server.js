/**
 * Imports
 */
import Debug from 'debug';
import Express from 'express';

import expressStaticGzip from 'express-static-gzip';
import cookieParser from 'cookie-parser';

import React from 'react';
import { renderToNodeStream, renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import Serialize from 'serialize-javascript';
import { FluxibleComponent } from 'fluxible-addons-react';
import { addLocaleData, IntlProvider } from 'react-intl';

import fetchData from './utils/fetchData';
import fetchPageTitleAndSnippets from './utils/fetchPageTitleAndSnippets';
import isMobileUA from './utils/isMobileUA';
import webpackStats from '../webpack/stats';

// Flux
import ApplicationStore from './stores/Application/ApplicationStore';
import CartStore from './stores/Cart/CartStore';

import clearRouteErrors from './actions/Application/clearRouteErrors';
import fetchAllCollections from './actions/Collections/fetchAllCollections';
import navigateAction from './actions/Application/navigate';
import setLocale from './actions/Application/setLocale';
import setMobileBreakpoint from './actions/Application/setMobileBreakpoint';
import fetchAccountDetails from './actions/Account/fetchAccountDetails';
import fetchOrCreateCart from './actions/Cart/fetchOrCreateCart';

// Required components
import BaseHtml from './components/core/BaseHtml';
import NotFound from './components/pages/NotFound/NotFound';
import ServerError from './components/pages/ServerError/ServerError';

// Initialize debugging utility
let debug = Debug('simple-store');

// App fluxible wrapper, configurations, base html component and router action
import app from './app';
import DataLoader from './dataLoader';
import config from './config';
import routes from './routes';

import uk from 'react-intl/locale-data/uk';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import es from 'react-intl/locale-data/es';
console.log(es);

addLocaleData([ ...es, ...uk, ...en, ...ru]);

const messages = {};

config.app.locale.available.forEach((locale) => {
    messages[locale] = require(`../static/localizations/${locale}.json`);
});


/**
 * Emitted when an exception bubbles all the way back to the event loop.
 * If a listener is added for this exception, the default action
 * (which is to print a stack trace and exit) will not occur.
 * Node.js Docs: https://nodejs.org/api/process.html#process_event_uncaughtexception
 *
 * This was put here because of a Superagent core limitation which would crash the app
 * from time to time (https://github.com/visionmedia/superagent/issues/741). However,
 * perhaps should be investigated if in production the best way is to let the app
 * crash and let the process monitor handle the restart (http://debuggable.com/posts/node-js-dealing-with-uncaught-exceptions:4c933d54-1428-443c-928d-4e1ecbdd56cb)
 */
/*process.on('uncaughtException', function(err) {
    debug('uncaughtException', err);
});*/

/**
 * Helper methods
 */

function dispatchClearRouteErrors(context) {
    return new Promise(function (resolve, reject) {
        context.executeAction(clearRouteErrors, {}, function () { resolve(); });
    });
}

function dispatchFetchAllCollections(context) {
    return new Promise(function (resolve, reject) {
        context.executeAction(fetchAllCollections, {}, function () { resolve(); });
    });
}

function dispatchSetLocale(context, locale) {
    return new Promise(function (resolve, reject) {
        context.executeAction(setLocale, locale, function () { resolve(); });
    });
}

function dispatchSetMobileBreakpoint(context, isMobile) {
    return new Promise(function (resolve, reject) {
        context.executeAction(setMobileBreakpoint, isMobile, function () { resolve(); });
    });
}

function dispatchGetAccountDetails(context) {
    return new Promise(function (resolve, reject) {
        context.executeAction(fetchAccountDetails, {}, function () { resolve(); });
    });
}

function dispatchFetchOrCreateCart(context) {
    return new Promise(function (resolve, reject) {
        context.executeAction(fetchOrCreateCart, {
            cartId: context.getStore(CartStore).getCartId(),
            cartAccessToken: context.getStore(CartStore).getCartAccessToken()
        }, function () { resolve(); });
    });
}

/**
 * Express server
 */
let server = Express();

server.use(cookieParser());

// 1) Serve static files
server.use('/robots.txt', Express.static(__dirname + '/../static/robots.txt'));
server.use('/static', expressStaticGzip(__dirname + '/../static'));

// 2) If requesting root URL, redirect to default locale
server.get('/', function (req, res, next) {
    let defaultLocale = config.app.locale.default || 'es';
    let userLocale = req.headers['accept-language'] ? req.headers['accept-language'].substring(0,2) : false;
    if(config.app.locale.available.indexOf(userLocale) !== -1) {
        defaultLocale = userLocale;
    }
    debug(`Redirecting to default locale: ${defaultLocale}`);
    return res.redirect(302, `/${defaultLocale}`);
});

// 3) Process requested route and render respective React component
server.use(async function (req, res, next) {

    try {

        let context = app.createContext({req, res, config});

        // Locale:
        // - Fetch locale from URL
        // - Check if locale is available/enabled
        // - Trigger respective action
        let pathArray = req.path.split('/');
        let locale = pathArray[1];
        pathArray.splice(0, 2);
        pathArray.filter(val => !!val);

        if (!config.app.locale.available || config.app.locale.available.indexOf(locale) === -1) {
            let NotFoundComponent = React.createFactory(NotFound);
            let html = renderToStaticMarkup(NotFoundComponent());
            return res.status(404).send(html);
        }
        await dispatchSetLocale(context, locale);

        // Decide initial responsive store state according to User Agent, whether
        // it is a mobile one or not
        let isMobile = req.get('User-Agent') ? isMobileUA(req.get('User-Agent')) : false;
        debug('Is mobile User-Agent?', isMobile);
        await dispatchSetMobileBreakpoint(context, isMobile);

        // Collections
        // Fetch all the collections from the beggining of the application lifecycle.
        // These are required, for example, for the main navigation links and since
        // the data is rather "static" doesn't make much sense to be constantly fetching
        // it with every other route change.
        await dispatchFetchAllCollections(context);

        // When first loading the app on the client, trigger fetching of user account
        // details before proceding so that, if a user is logged in, this information
        // is readily available to the application (e.g. for limiting access to certain pages)
        await dispatchGetAccountDetails(context);

        // Now that we have the account figured out, let's figure out the state of the cart,
        // fetching any one that we currently have or creating a new one if necessary
        await dispatchFetchOrCreateCart(context);

        const branch = matchRoutes(routes, req.path);
        await fetchData(context, branch, req.query);
        let pageTitle = fetchPageTitleAndSnippets(context, branch);

        debug('Executing navigate action');

        // Route Errors (i.e. most likely 404 Not Found)
        // There are are routes that may be valid in the sense that they "exist" but,
        // in reality, are invalid because the underlying resource does not exist (e.g. Product ID not found).
        // We should catch those here and act accordingly, like rendering Not Found page or setting
        // proper HTTP status code.
        //
        // *** IMPORTANT ***
        // Getting and clearing this info must be done BEFORE dehydrating the state or else,
        // on first route change in the client, it will still think there's an error.
        let routeError = context.getStore(ApplicationStore).getRouteError();
        await dispatchClearRouteErrors(context); // Very important!!!
        if (routeError) {
            debug(`(Server) Route Error ${routeError}`);
        }

        // Fire navigate action
        context.executeAction(navigateAction, {url: req.url }, function (err) {

            debug('Exposing context state');
            let exposed = 'window.App=' + Serialize(app.dehydrate(context)) + ';';

            debug('Rendering Application component into html');

            res.setHeader('Content-Type', 'text/html');

            // Figure out appopriate HTTP status code:
            // 1) Not Found component -> 404
            // 2) Route Error -> whichever is returned
            // 3) Business as usual -> 200
            let responseStatus;
            if (routeError) {
                responseStatus = routeError;
            } else {
                responseStatus = 200;
                // responseStatus = state.routes.some(route => route.name == 'not-found') ? 404 : 200;
            }

            res.status(responseStatus);

            const markup = renderToString(
                <FluxibleComponent context={context.getComponentContext()}>
                    <IntlProvider locale={locale} messages={messages[locale]}>
                          <StaticRouter location={req.url} context={context.getComponentContext()}>
                              <DataLoader routes={routes} context={context.getComponentContext()}>
                                  {renderRoutes(routes)}
                              </DataLoader>
                          </StaticRouter>
                    </IntlProvider>
                </FluxibleComponent>
            );

            let BaseHtmlComponent = React.createFactory(BaseHtml);
            const stream = renderToNodeStream(BaseHtmlComponent({
                context: context.getComponentContext(),
                state: exposed,
                markup: markup,
                css: webpackStats.css,
                scripts: webpackStats.scripts,
                locale: locale,
                url: pathArray.length > 0 ? pathArray.join('/') : false,
                title: (pageTitle && pageTitle.title) || config.app.title[locale],
                staticURL: '/static'
            }));

            res.write('<!DOCTYPE html>');

            debug('Sending markup');
            stream.pipe(res, {end: 'false'});

            stream.on('end', () => {
                res.end('');
            })
        });

    } catch (err) {
        debug('Unhandled Server Error (Oops!)', err);
        let ServerErrorComponent = React.createFactory(ServerError);
        let html = renderToStaticMarkup(ServerErrorComponent());
        return res.status(500).send(html);
    }
});

//
// b) Start server
//
const host = 'localhost';
const port = 3030;
server.listen(port, host);
debug('Storefront Isomorphic Server running. Host: %s, Port: %s', host, port);
