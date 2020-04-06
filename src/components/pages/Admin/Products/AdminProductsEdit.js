/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

// Flux
import CollectionsStore from '../../../../stores/Collections/CollectionsStore';
import IntlStore from '../../../../stores/Application/IntlStore';
import ProductDetailsStore from '../../../../stores/Products/ProductDetailsStore';

import fetchProductAndCheckIfFound from '../../../../actions/Products/fetchProductAndCheckIfFound';
import updateProduct from '../../../../actions/Admin/updateProduct';

// Delete
import DeleteHandler from '../../../common/deleteHandler/DeleteHandler';
import deleteProduct from '../../../../actions/Admin/deleteProduct';
import Modal from '../../../common/modals/Modal';

// Required components
import Button from '../../../common/buttons/Button';
import Checkbox from '../../../common/forms/Checkbox';
import CollectionPicker from '../../../common/collections/CollectionPicker';
import Heading from '../../../common/typography/Heading';
import ImageLibraryManager from '../../../containers/images/ImageLibraryManager';
import InlineItems from '../../../common/forms/InlineItems';
import InputField from '../../../common/forms/InputField';
import NotFound from '../../NotFound/NotFound';
import Select from '../../../common/forms/Select';
import Spinner from '../../../common/indicators/Spinner';
import Textarea from '../../../common/forms/Textarea';
import ToggleSwitch from '../../../common/buttons/ToggleSwitch';

/**
 * Component
 */
class AdminProductsEdit extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        product: this.context.getStore(ProductDetailsStore).getProduct(),
        error: this.context.getStore(ProductDetailsStore).getError(),
        loading: this.context.getStore(ProductDetailsStore).isLoading(),
        availableLocales: this.context.getStore(IntlStore).getAvailableLocales(),
        categories: this.context.getStore(CollectionsStore).getCollections(['category']),
        collections: this.context.getStore(CollectionsStore).getCollections(['collection']),
        fieldErrors: {},
    };

    //*** Component Lifecycle ***//

    componentDidMount() {
        const { product, availableLocales } = this.state;
        if (product) {
            availableLocales.map(locale => {
                product.name[locale] = '';
            });
            this.setState({product});   
        }
        // Component styles
        require('./AdminProductsEdit.scss');

        // Load required data
        this.context.executeAction(fetchProductAndCheckIfFound, this.props.match.params.productId);
    }

    componentWillReceiveProps(nextProps) {

        // Find field error descriptions in request response
        let fieldErrors = {};
        const { availableLocales } = this.state;
        if (nextProps._error && nextProps._error.validation && nextProps._error.validation.keys) {
            nextProps._error.validation.keys.forEach(function (field) {
                if (field.includes('description')) {
                    console.log('field:', field);
                    availableLocales.map(locale => {
                        fieldErrors[`description.${locale}`] = nextProps._error.validation.details[field];
                    });
                } else {
                    fieldErrors[field] = nextProps._error.validation.details[field];
                }
            });
        }

        this.setState({
            product: nextProps._product,
            error: nextProps._error,
            loading: nextProps._loading,
            categories: nextProps._categories,
            collections: nextProps._collections,
            fieldErrors: fieldErrors
        });
    }

    handleDeleteProductClick = () => {
        let product = this.state.product;
        this.context.executeAction(deleteProduct, product.id);
        let intl = this.context.intl;
        let locale = intl.locale;
        this.props.history.push(`/${locale}/adm/products`);
    };

    //*** View Controllers ***//

    handleEnabledChange = () => {
        let product = this.state.product;
        product.enabled = !(product.enabled === true);
        this.setState({product: product});
    };

    handleFieldChange = (field, value) => {
        let product = this.state.product;
        product[field] = value;
        this.setState({product: product});
    };

    handleIntlFieldChange = (field, locale, value) => {
        let product = this.state.product;
        if (!product[field]) {
            product[field] = {};
        }
        product[field][locale] = value;
        this.setState({product: product});
    };

    handleSectionChange = (tag) => {
        let product = this.state.product;
        if (!product.tags) {
            product.tags = [tag];
        } else if (product.tags.indexOf(tag) === -1) {
            product.tags.push(tag);
        } else {
            product.tags.splice(product.tags.indexOf(tag), 1);
        }
        this.setState({product: product});
    };

    handleCollectionPickerChange = (collections) => {
        let product = this.state.product;
        product.collections = collections;
        this.setState({product: product});
    };

    handleMainCategoryChange = (collectionId) => {
        let product = this.state.product;
        product.metadata.mainCategory = collectionId;
        this.setState({product: product});
    };

    handleMainCollectionChange = (collectionId) => {
        let product = this.state.product;
        product.metadata.mainCollection = collectionId;
        this.setState({product: product});
    };

    handleNameChange = (locale, value) => {
        let product = this.state.product;
        product.name[locale] = value;
        this.setState({product: product});
    };

    handlePricingChange = (param, value) => {
        let product = this.state.product;
        product.pricing[param] = value;
        this.setState({product: product});
    };

    handlePricingIntlChange = (field, locale, value) => {
        let product = this.state.product;
        product.pricing[field][locale] = value;
        this.setState({product: product});
    };

    handleImageLibraryChange = (images) => {
        let product = this.state.product;
        product.images = images;
        this.setState({product: product});
    };

    handleSaveClick = () => {

        let intl = this.context.intl;
        const { availableLocales } = this.state;
        // Client-side validations
        this.setState({fieldErrors: {}});
        let fieldErrors = {};
        availableLocales.map(locale => {
            if (!this.state.product.name[locale]) {
                fieldErrors['name.' + locale] = intl.formatMessage({id: 'fieldRequired'});
            }  
        })
        this.setState({fieldErrors: fieldErrors});

        // Client-side validation checked, trigger update request
        if (Object.keys(fieldErrors).length === 0) {
            let product = this.state.product;
            this.context.executeAction(updateProduct, {
                id: product.id,
                data: {
                    enabled: product.enabled,
                    sku: product.sku,
                    name: product.name,
                    description: product.description,
                    images: product.images,
                    pricing: {
                        currency: product.pricing.currency,
                        list: parseFloat(product.pricing.list),
                        retail: parseFloat(product.pricing.retail),
                        vat: parseInt(product.pricing.vat)
                    },
                    stock: parseInt(product.stock),
                    tags: product.tags,
                    collections: product.collections,
                    metadata: product.metadata
                }
            });
        }
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //

        let intl = this.context.intl;
        let locale = intl.locale;
        const { availableLocales } = this.state;
        let getCollectionType = (collectionId) => {
            let collection = this.context.getStore(CollectionsStore).getCollection(collectionId);
            if (collection && collection.tags.indexOf('category') !== -1 && collection.tags.indexOf('collection') === -1) {
                return 'category';
            } else if (collection && collection.tags.indexOf('collection') !== -1 && collection.tags.indexOf('category') === -1) {
                return 'collection';
            } else {
                return null;
            }
        };

        // Stuff that won't work if we are in "404 Not Found", thus, no product object
        let productCategories;
        let productCollections;
        if (this.state.product) {
            productCategories = this.state.product.collections.filter((collectionId) => {
                return getCollectionType(collectionId) === 'category';
            }).map((collectionId) => {
                let category = this.context.getStore(CollectionsStore).getCollection(collectionId);
                return {
                    value: category.id,
                    name: category.name[locale]
                }
            });

            productCollections = this.state.product.collections.filter((collectionId) => {
                return getCollectionType(collectionId) === 'collection';
            }).map((collectionId) => {
                let collection = this.context.getStore(CollectionsStore).getCollection(collectionId);
                return {
                    value: collection.id,
                    name: collection.name[locale]
                }
            });
        }

        let fieldError = (field) => {
            return this.state.fieldErrors[field];
        };

        //
        // Return
        //
        return (
            <div className="admin-products-edit">
                <div className="admin-products-edit__header">
                    <div className="admin-products-edit__title">
                        <Heading size="medium">
                            <FormattedMessage id="adminProductsEditHeader" />
                        </Heading>
                    </div>
                    {this.state.product ?
                        <div className="admin-products-edit__toolbar">
                            <div className="admin-products-edit__toolbar-item">
                                <Link to={`/${locale}/adm/products`}>
                                    <Button type="default" disabled={this.state.loading}>
                                        <FormattedMessage id="backButton" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="admin-products-edit__toolbar-item">
                                <Button type="primary" onClick={this.handleSaveClick} disabled={this.state.loading}>
                                    <FormattedMessage id="saveButton" />
                                </Button>
                            </div>
                            <div className="admin-products-edit__toolbar-item">
                                <Button type="primary" onClick={this.handleDeleteProductClick} disabled={this.state.loading}>
                                    <FormattedMessage id="deleteProduct" />
                                </Button>
                            </div>
                        </div>
                        :
                        null
                    }
                </div>

                {this.state.loading ?
                    <div className="admin-products-edit__spinner">
                        <Spinner />
                    </div>
                    :
                    null
                }
                {!this.state.loading && !this.state.product  ?
                    <NotFound />
                    :
                    null
                }
                {!this.state.loading && this.state.product ?
                    <div className="admin-products-edit__form">
                        <div className="admin-products-edit__left-column">
                            <div className="admin-products-edit__form-item">
                                <ToggleSwitch label={intl.formatMessage({id: 'enabledHeading'})}
                                              enabled={this.state.product.enabled === true}
                                              onChange={this.handleEnabledChange} />
                            </div>
                            <div className="admin-products-edit__form-item">
                                <InlineItems>
                                    <InputField label={intl.formatMessage({id: 'skuHeading'})}
                                                onChange={this.handleFieldChange.bind(null, 'sku')}
                                                value={this.state.product.sku}
                                                error={fieldError('sku')} />
                                    <InputField label={intl.formatMessage({id: 'stockHeading'})}
                                                onChange={this.handleFieldChange.bind(null, 'stock')}
                                                value={this.state.product.stock}
                                                error={fieldError('stock')} />
                                    <Select label={intl.formatMessage({id: 'mainCategory'})}
                                            placeholder
                                            options={productCategories}
                                            value={this.state.product.metadata.mainCategory}
                                            error={fieldError('mainCategory')}
                                            onChange={this.handleMainCategoryChange} />
                                    <Select label={intl.formatMessage({id: 'mainCollection'})}
                                            placeholder
                                            options={productCollections}
                                            value={this.state.product.metadata.mainCollection}
                                            error={fieldError('mainCategory')}
                                            onChange={this.handleMainCollectionChange} />
                                </InlineItems>
                            </div>
                            <div className="admin-products-edit__form-item">
                                <InlineItems label={<FormattedMessage id="sections" />}>
                                    <Checkbox label={intl.formatMessage({id: 'homepage'})}
                                              onChange={this.handleSectionChange.bind(null, 'homepage')}
                                              checked={this.state.product.tags && this.state.product.tags.indexOf('homepage') !== -1} />
                                </InlineItems>
                            </div>
                            {   availableLocales.map((locale, idx) => {
                                return (
                                    <div key={locale + idx + 1} className="admin-products-edit__form-item">
                                        <InputField label={intl.formatMessage({id: 'name'}) + ` (${locale.toUpperCase()})`}   
                                                    onChange={this.handleNameChange.bind(null, `${locale}`)}
                                                    value={this.state.product.name[locale]}
                                                    error={fieldError(`name.${locale}`)} />
                                    </div>
                                );
                            })}
                            {   availableLocales.map((locale, idx) => {
                                return (
                                    <div key={locale + idx} className="admin-products-edit__form-item">
                                        <Textarea label={intl.formatMessage({id: 'description'}) + ` (${locale.toUpperCase()})`}   
                                                rows="5"
                                                onChange={this.handleIntlFieldChange.bind(null, 'description', `${locale}`)}
                                                value={this.state.product.description ? this.state.product.description[locale] : null}
                                                error={fieldError(`description.${locale}`)} />
                                    </div>
                                );
                            })}
                            <div className="admin-products-edit__form-item">
                                <InlineItems label={<FormattedMessage id="pricing" />}>
                                    <InputField label={intl.formatMessage({id: 'currency'})}
                                                labelSize="small" labelWeight="normal"
                                                value={this.state.product.pricing.currency}
                                                disabled
                                                error={fieldError('pricing.currency')} />
                                    <InputField label={intl.formatMessage({id: 'listPrice'})}
                                                labelSize="small" labelWeight="normal"
                                                value={this.state.product.pricing.list}
                                                onChange={this.handlePricingChange.bind(null, 'list')}
                                                error={fieldError('pricing.list')} />
                                    <InputField label={intl.formatMessage({id: 'retailPrice'})}
                                                labelSize="small" labelWeight="normal"
                                                value={this.state.product.pricing.retail}
                                                onChange={this.handlePricingChange.bind(null, 'retail')}
                                                error={fieldError('pricing.retail')} />
                                    <InputField label={intl.formatMessage({id: 'vat'})}
                                                labelSize="small" labelWeight="normal"
                                                value={this.state.product.pricing.vat}
                                                onChange={this.handlePricingChange.bind(null, 'vat')}
                                                error={fieldError('pricing.vat')} />
                                </InlineItems>
                            </div>
                            <div className="admin-products-edit__form-item">
                                <ImageLibraryManager images={this.state.product.images}
                                                     resource="products"
                                                     onChange={this.handleImageLibraryChange} />
                            </div>
                        </div>
                        <div className="admin-products-edit__right-column">
                            <div className="admin-products-edit__form-item">
                                <CollectionPicker collections={this.state.categories}
                                                  checked={this.state.product.collections}
                                                  onChange={this.handleCollectionPickerChange}>
                                    <FormattedMessage id="categories" />
                                </CollectionPicker>
                            </div>
                            <div className="admin-products-edit__form-item">
                                <CollectionPicker collections={this.state.collections}
                                                  checked={this.state.product.collections}
                                                  onChange={this.handleCollectionPickerChange}>
                                    <FormattedMessage id="collections" />
                                </CollectionPicker>
                            </div>
                        </div>
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}

/**
 * Flux
 */
AdminProductsEdit = connectToStores(AdminProductsEdit, [CollectionsStore, ProductDetailsStore], (context) => {
    return {
        _product: context.getStore(ProductDetailsStore).getProduct(),
        _error: context.getStore(ProductDetailsStore).getError(),
        _loading: context.getStore(ProductDetailsStore).isLoading(),
        _categories: context.getStore(CollectionsStore).getCollections(['category']),
        _collections: context.getStore(CollectionsStore).getCollections(['collection'])
    };
});

/**
 * Exports
 */
export default AdminProductsEdit;
