/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

// Flux
import CollectionsAddStore from '../../../../stores/Collections/CollectionsAddStore';
import CollectionsListStore from '../../../../stores/Collections/CollectionsListStore';
import CollectionsStore from '../../../../stores/Collections/CollectionsStore';

import addCollection from '../../../../actions/Admin/addCollection';
import fetchCollections from '../../../../actions/Collections/fetchCollections';

// Required components
import Button from '../../../common/buttons/Button';
import Heading from '../../../common/typography/Heading';
import Label from '../../../common/indicators/Label';
import Modal from '../../../common/modals/Modal';
import StatusIndicator from '../../../common/indicators/StatusIndicator';
import Table from '../../../common/tables/Table';
import Text from '../../../common/typography/Text';

import AdminCollectionsAddForm from './AdminCollectionsAddForm';

/**
 * Component
 */
class AdminCollections extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Required Data ***//

    static fetchData = function (context, params, query, done) {
        return context.executeAction(fetchCollections, {}, done);
    };

    //*** Initial State ***//

    state = {
        addCollection: this.context.getStore(CollectionsAddStore).getState(),
        collections: this.context.getStore(CollectionsListStore).getCollections(),
        showNewCollectionModal: false
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./AdminCollections.scss');
    }

    componentWillReceiveProps(nextProps) {

        // If new collection was being added and was successful, redirect to
        // collection edit page
        if (this.state.addCollection.loading === true
            && nextProps._addCollection.loading === false && !nextProps._addCollection.error) {
            this.props.history.push(`/${this.context.intl.locale}/adm/collections/${nextProps._addCollection.collection.id}`);
        }

        // Update state
        this.setState({
            addCollection: nextProps._addCollection,
            collections: nextProps._collections
        });
    }

    //*** View Controllers ***//

    handleNewCollectionClick = () => {
        this.setState({showNewCollectionModal: true});
    };

    handleNewCollectionCloseClick = () => {
        this.setState({showNewCollectionModal: false});
    };

    handleNewCollectionSubmitClick = (data) => {
        this.context.executeAction(addCollection, data);
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let intl = this.context.intl;
        let locale = intl.locale;

        let headings = [
            <FormattedMessage id="collectionNameHeading" />,
            <FormattedMessage id="collectionParentHeading" />,
            <FormattedMessage id="tagsHeading" />,
            <FormattedMessage id="enabledHeading" />
        ];

        let rows = this.state.collections.map((collection) => {
            return {
                data: [
                    <span className="admin-collections__link">
                        <Link to={`/${locale}/adm/collections/${collection.id}`}>
                            {collection.name[locale]}
                        </Link>
                    </span>,
                    <Text size="medium">
                        {collection.parentId ?
                            <span>
                                {this.context.getStore(CollectionsStore).getCollection(collection.parentId).name[locale]}
                            </span>
                            :
                            <span>-</span>
                        }
                    </Text>,
                    <Text size="medium">
                        <div className="admin-collections__labels">
                            {collection.tags.map(function (section, idx) {
                                return (
                                    <div key={idx} className="admin-collections__label">
                                        <Label>
                                            <FormattedMessage id={section} />
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    </Text>,
                    <StatusIndicator status={(collection.enabled === true) ? 'success' : 'default'} />
                ]
            };
        });

        let newCollectionModal = () => {
            if (this.state.showNewCollectionModal) {
                return (
                    <Modal title={intl.formatMessage({id: 'collectionNewModalTitle'})}
                           onCloseClick={this.handleNewCollectionCloseClick}>
                        <AdminCollectionsAddForm
                            loading={this.state.addCollection.loading}
                            onCancelClick={this.handleNewCollectionCloseClick}
                            onSubmitClick={this.handleNewCollectionSubmitClick} />
                    </Modal>
                );
            }
        };

        //
        // Return
        //
        return (
            <div className="admin-collections">
                {newCollectionModal()}

                <div className="admin-collections__header">
                    <div className="admin-collections__title">
                        <Heading size="medium">
                            <FormattedMessage id="adminCollectionsHeader" />
                        </Heading>
                    </div>
                    <div className="admin-collections__toolbar">
                        <div className="admin-collections__add-button">
                            <Button type="primary" onClick={this.handleNewCollectionClick}>
                                <FormattedMessage id="newButton" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="admin-collections__list">
                    <Table headings={headings} rows={rows} />
                </div>
            </div>
        );
    }
}

/**
 * Flux
 */
AdminCollections = connectToStores(AdminCollections, [CollectionsAddStore, CollectionsListStore], (context) => {
    return {
        _addCollection: context.getStore(CollectionsAddStore).getState(),
        _collections: context.getStore(CollectionsListStore).getCollections()
    };
});

/**
 * Exports
 */
export default AdminCollections;
