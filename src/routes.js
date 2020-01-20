/**
 * Imports
 */
import React from 'react';

// Required components
import Application from './components/pages/Application/Application';
import NotFound from './components/pages/NotFound/NotFound';

import Homepage from './components/pages/Homepage/Homepage';
import Checkout from './components/pages/Checkout/Checkout';
import CollectionProductsPage from './components/pages/Collections/CollectionProductsPage';
import ProductListingPage from './components/pages/Products/ProductListingPage';
import ProductPage from './components/pages/Products/ProductPage';

import AccountBase from './components/pages/Account/AccountBase';
import Account from './components/pages/Account/Account';
import AccountOrderDetailsPage from './components/pages/Account/AccountOrderDetailsPage';

import Login from './components/pages/Account/Login';
import Logout from './components/pages/Account/Logout';
import Register from './components/pages/Account/Register';
import RegisterConfirm from './components/pages/Account/RegisterConfirm';
import Reset from './components/pages/Account/Reset';
import ResetConfirm from './components/pages/Account/ResetConfirm';

import DeliveryPage from './components/pages/StaticContent/DeliveryPage';
import InfoPage from './components/pages/StaticContent/InfoPage';

import ArticlesListingPage from './components/pages/Articles/ArticlesListingPage';
import ArticlePage from './components/pages/Articles/ArticlePage';

import Admin from './components/pages/Admin/Admin';

import AdminCollections from './components/pages/Admin/Collections/AdminCollections';
import AdminCollectionsEdit from './components/pages/Admin/Collections/AdminCollectionsEdit';
import AdminContents from './components/pages/Admin/Contents/AdminContents';
import AdminContentsEdit from './components/pages/Admin/Contents/AdminContentsEdit';
import AdminCustomers from './components/pages/Admin/Customers/AdminCustomers';
import AdminDashboard from './components/pages/Admin/Dashboard/AdminDashboard';
import AdminOrders from './components/pages/Admin/Orders/AdminOrders';
import AdminOrdersEdit from './components/pages/Admin/Orders/AdminOrdersEdit';
import AdminProducts from './components/pages/Admin/Products/AdminProducts';
import AdminProductsEdit from './components/pages/Admin/Products/AdminProductsEdit';

/**
 * Application's Routes
 */

const routesConfig = [
    {
        component: Application,
        routes: [
            {
                path: '/:locale',
                exact: true,
                component: Homepage
            },
            {
                path: '/:locale/login',
                exact: true,
                component: Login
            },
            {
                path: '/:locale/logout',
                exact: true,
                component: Logout
            },
            {
                path: '/:locale/register',
                exact: true,
                component: Register
            },
            {
                path: '/:locale/register/confirm/:token',
                exact: true,
                component: RegisterConfirm
            },
            {
                path: '/:locale/reset',
                exact: true,
                component: Reset
            },
            {
                path: '/:locale/reset/confirm/:token',
                exact: true,
                component: ResetConfirm
            },
            {
                path: '/:locale/account',
                component: AccountBase,
                routes: [
                    {
                        path: '/:locale/account',
                        exact: true,
                        component: Account
                    },
                    {
                        path: '/:locale/account/orders/:orderId',
                        exact: true,
                        component: AccountOrderDetailsPage
                    },
                ]
            },
            {
                path: '/:locale/collections/:collectionId/:collectionSlug?',
                exact: true,
                component: CollectionProductsPage,
            },
            {
                path: '/:locale/products',
                exact: true,
                component: ProductListingPage,
            },
            {
                path: '/:locale/products/:productId/:productSlug?',
                exact: true,
                component: ProductPage,
            },
            {
                path: '/:locale/checkout',
                exact: true,
                component: Checkout,
            },
            {
                path: '/:locale/delivery',
                exact: true,
                component: DeliveryPage,
            },
            {
                path: '/:locale/info',
                exact: true,
                component: InfoPage,
            },
            {
                path: '/:locale/articles',
                exact: true,
                component: ArticlesListingPage,
            },
            {
                path: '/:locale/articles/:contentId/:contentSlug?',
                exact: true,
                component: ArticlePage,
            },
            {
                path: '/:locale/adm',
                component: Admin,
                routes: [
                    {
                        path: '/:locale/adm',
                        exact: true,
                        component: AdminDashboard,
                    },
                    {
                        path: '/:locale/adm/collections',
                        exact: true,
                        component: AdminCollections,
                    },
                    {
                        path: '/:locale/adm/collections/:collectionId',
                        exact: true,
                        component: AdminCollectionsEdit,
                    },
                    {
                        path: '/:locale/adm/contents',
                        exact: true,
                        component: AdminContents,
                    },
                    {
                        path: '/:locale/adm/contents/:contentId',
                        exact: true,
                        component: AdminContentsEdit,
                    },
                    {
                        path: '/:locale/adm/customers',
                        exact: true,
                        component: AdminCustomers,
                    },
                    {
                        path: '/:locale/adm/orders',
                        exact: true,
                        component: AdminOrders,
                    },
                    {
                        path: '/:locale/adm/orders/:orderId',
                        exact: true,
                        component: AdminOrdersEdit,
                    },
                    {
                        path: '/:locale/adm/products',
                        exact: true,
                        component: AdminProducts,
                    },
                    {
                        path: '/:locale/adm/products/:productId',
                        exact: true,
                        component: AdminProductsEdit,
                    },
                ]
            },
            {
                path: '*',
                component: NotFound,
            }
        ]
    },
];

/**
 * Exports
 */
export default routesConfig;
