// App config the for development environment.
// Do not require this directly. Use ./src/config instead.
module.exports = {
    app: {
        brand: 'Ringo Motos',
        facebookLink: 'https://m.facebook.com/ringomotosRA',
        instagramLink: 'https://www.instagram.com/ringo_motos_ra', 
        email: 'Ringo_moto_ra@hotmail.com',
        title: {
            uk: 'Ringo Motos',
            ru: 'Ringo Motos',
            en: 'Ringo Motos',
            es: 'Ringo Motos',
        },
        locale: {
            available: ['es'],
            default: 'es'
        },
        currency: 'ARS'
    },
    api: {
        atlas: {
            baseUrl: 'http://localhost:8000/v1'
        }
    },
    googleAnalytics: {
        enabled: false,
        trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID, // Development Property
        options: {
            debug: true
        }
    },
    facebookPixel: {
        enabled: false,
        id: process.env.FACEBOOK_PIXEL_ID
    },
    crisp: {
        enabled: false,
        websiteID: process.env.CRISP_WEBSITE_ID // TODO: This is still hardcoded in the vendor file
    },
    mailChimp: {
        signupFormPostURL: process.env.MAILCHIMP_SIGNUP_FORM_POST_URL
    },
    switchPayments: {
        enabled: false,
        environment: 'https://api-test.switchpayments.com/v2/',
        publicKey: process.env.SWITCH_PUBLIC_KEY
    }
};
