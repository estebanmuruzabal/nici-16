/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';


// Required components
import Button from '../buttons/Button';
import Heading from '../typography/Heading';
import Text from '../typography/Text';
import Textarea from '../forms/Textarea';

import UserComment from './UserComment';

// Instantiate debugger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class CommentBox extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Initial State ***//

    state = {
        message: undefined,
        fieldErrors: {}
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./CommentBox.scss');
    }

    //*** View Controllers ***//

    handleTextareaChange = (value) => {
        this.setState({message: value});
    };

    handleButtonClick = () => {

        this.setState({fieldErrors: {}});
        let fieldErrors = {};
        if (!this.state.message) {
            fieldErrors.message = this.context.intl.formatMessage({id: 'fieldRequired'});
        }
        this.setState({fieldErrors: fieldErrors});

        if (Object.keys(fieldErrors).length === 0) {
            this.props.onSubmitClick(this.state.message);
        }
    };

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let locale = this.context.intl.locale;

        // Return the list UI block, according to whether there are comments or not
        let comments = () => {
            if (this.props.comments && this.props.comments.length > 0) {
                return (
                    <div className="comment-box__list">
                        {this.props.comments.map(function (comment, idx) {
                            return (
                                <div key={idx} className="comment-box__comment-item">
                                    <UserComment author={comment.user.name} date={comment.createdAt}>
                                        {comment.message}
                                    </UserComment>
                                </div>
                            );
                        })}
                    </div>
                );
            } else {
                return (
                    <div className="comment-box__no-comments">
                        <Text>
                            <FormattedMessage id="noComments" />!
                        </Text>
                    </div>
                );
            }
        };

        let loginTranslation = (
            <Link className="comment-box__link" to={`/${locale}/login`} >
                <Text>
                    <FormattedMessage id="commentLogin" />
                </Text>
            </Link>
        );

        let registerTranslation = (
            <Link className="comment-box__link" to={`/${locale}/register`} >
                <Text>
                    <FormattedMessage id="commentRegister" />
                </Text>
            </Link>
        );

        //
        // Return
        //
        return (
            <div className="comment-box">
                <div className="comment-box__comments" itemScope itemType="http://schema.org/UserComments">
                    <Heading size="medium">
                        <FormattedMessage id="commentComments"
                                          values={{
                                            total: (this.props.comments) ? this.props.comments.length : 0
                                          }} />
                    </Heading>
                    {comments()}
                </div>
                {this.props.user ?
                    <div className="comment-box__submit">
                    <Textarea label={this.context.intl.formatMessage({id: 'leaveComment'})}
                              onChange={this.handleTextareaChange}
                              error={this.state.fieldErrors.message}
                              disabled={this.props.disabled || this.props.loading} />
                        <div className="comment-box__submit-actions">
                            <div className="comment-box__button">
                                <Button type="primary" onClick={this.handleButtonClick}
                                        disabled={this.props.disabled} loading={this.props.loading}>
                                    <i className="fa fa-comment-o" aria-hidden="true" />
                                    &nbsp;
                                    <FormattedMessage id="commentSubmit" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="comment-box__no-user">
                        <Text>
                            <FormattedMessage id="noUser"
                                              values={{
                                                'login': loginTranslation,
                                                'register': registerTranslation }} />
                        </Text>
                    </div>
                }
            </div>
        );
    }
}

/**
 * Default Props
 */
CommentBox.defaultProps = {
    onSubmitClick: function (data) { debug(`onSubmitClick not defined. Value: ${data}`); }
};

/**
 * Exports
 */
export default CommentBox;
