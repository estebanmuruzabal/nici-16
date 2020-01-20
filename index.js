// Don't use it for production instead build the project and run `npm run prod`

if (process.env.NODE_ENV === 'development') {
    require("@babel/register");
}
/**
 * Intl APIs (ECMA-402) Polyfill.
 */
require('./src/utils/intlServerPolyfill');

/**
 * Start application server.
 */
require('./src/server');

/**
 * In development, also start Webpack dev server.
 */
if (process.env.NODE_ENV === 'development') {
    require('./webpack/server');
}
