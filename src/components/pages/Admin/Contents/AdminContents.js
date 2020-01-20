/**
 * Imports
 */
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

// Flux
import ContentsAddStore from '../../../../stores/Contents/ContentsAddStore';
import ContentsListStore from '../../../../stores/Contents/ContentsListStore';

import addContent from '../../../../actions/Admin/addContent';
import fetchContents from '../../../../actions/Contents/fetchContents';

// Required components
import Button from '../../../common/buttons/Button';
import Heading from '../../../common/typography/Heading';
import Label from '../../../common/indicators/Label';
import Modal from '../../../common/modals/Modal';
import Spinner from '../../../common/indicators/Spinner';
import StatusIndicator from '../../../common/indicators/StatusIndicator';
import Table from '../../../common/tables/Table';
import Text from '../../../common/typography/Text';

import AdminContentsAddForm from './AdminContentsAddForm';

/**
 * Component
 */
class AdminContents extends React.Component {

    static contextTypes = {
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        addContent: this.context.getStore(ContentsAddStore).getState(),
        contents: this.context.getStore(ContentsListStore).getContents(),
        loading: this.context.getStore(ContentsListStore).isLoading(),
        showNewContentModal: false
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./AdminContents.scss');

        // Request required data
        this.context.executeAction(fetchContents, {});
    }

    componentWillReceiveProps(nextProps) {

        // If new content was being added and was successful, redirect to
        // content edit page
        if (this.state.addContent.loading === true
            && nextProps._addContent.loading === false && !nextProps._addContent.error) {
            this.props.history.push(`/${this.context.intl.locale}/adm/contents/${nextProps._addContent.content.id}`);

        }

        // Update state
        this.setState({
            addContent: nextProps._addContent,
            contents: nextProps._contents,
            loading: nextProps._loading
        });
    }

    //*** View Controllers ***//

    handleNewContentClick = () => {
        this.setState({showNewContentModal: true});
    };

    handleNewContentCloseClick = () => {
        this.setState({showNewContentModal: false});
    };

    handleNewContentSubmitClick = (data) => {
        this.context.executeAction(addContent, data);
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let locale = this.context.intl.locale;

        let newContentModal = () => {
            if (this.state.showNewContentModal) {
                return (
                    <Modal title={this.context.intl.formatMessage({id: 'newContentModalTitle'})}
                           onCloseClick={this.handleNewContentCloseClick}>
                        <AdminContentsAddForm
                            loading={this.state.addContent.loading}
                            onCancelClick={this.handleNewContentCloseClick}
                            onSubmitClick={this.handleNewContentSubmitClick} />
                    </Modal>
                );
            }
        };

        let headings = [
            <FormattedMessage id="typeHeading" />,
            <FormattedMessage id="nameHeading" />,
            <FormattedMessage id="tagsHeading" />,
            <FormattedMessage id="enabledHeading"/>
        ];

        let rows = this.state.contents.map(function (content) {
            return {
                data: [
                    <Text size="medium">
                        {content.type ?
                            <Label>
                                <FormattedMessage id={content.type} />
                            </Label>
                            :
                            <Label type="error">
                                <FormattedMessage id="noType" />
                            </Label>
                        }
                    </Text>,
                    <span className="admin-contents__link">
                        <Link to={`/${locale}/adm/contents/${content.id}`} >
                            {content.name[locale]}
                        </Link>
                    </span>,
                    <div className="admin-contents__labels">
                        {content.tags.map(function (tag, idx) {
                            return (
                                <div key={idx} className="admin-contents__tag">
                                    <Label>
                                        <FormattedMessage id={tag} />
                                    </Label>
                                </div>
                            );
                        })}
                    </div>,
                    <StatusIndicator status={(content.enabled === true) ? 'success' : 'default'} />
                ]
            };
        });

        //
        // Return
        //
        return (
            <div className="admin-contents">
                {newContentModal()}

                <div className="admin-contents__header">
                    <div className="admin-contents__title">
                        <Heading size="medium">
                            <FormattedMessage id="adminContentsHeader" />
                        </Heading>
                    </div>
                    <div className="admin-contents__toolbar">
                        <div className="admin-contents__add-button">
                            <Button type="primary" onClick={this.handleNewContentClick}>
                                <FormattedMessage id="newButton" />
                            </Button>
                        </div>
                    </div>
                </div>

                {this.state.loading ?
                    <div className="admin-contents__spinner">
                        <Spinner />
                    </div>
                    :
                    <div className="admin-contents__list">
                        <Table headings={headings} rows={rows} />
                    </div>
                }
            </div>
        );
    }
}

/**
 * Flux
 */
AdminContents = connectToStores(AdminContents, [ContentsAddStore, ContentsListStore], (context) => {
    return {
        _addContent: context.getStore(ContentsAddStore).getState(),
        _contents: context.getStore(ContentsListStore).getContents(),
        _loading: context.getStore(ContentsListStore).isLoading()
    };
});

/**
 * Exports
 */
export default AdminContents;
