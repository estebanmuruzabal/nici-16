/**
 * Imports
 */
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

// Required Components
import Heading from '../../typography/Heading';
import NewsletterSubscription from '../../forms/NewsletterSubscription';
import Text from '../../typography/Text';

/**
 * Component
 */
class Footer extends React.Component {

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./Footer.scss');
    }

    //*** Template ***//

    render() {

        // Info links
        let infoLinks = [
            {name: this.context.intl.formatMessage({id: 'infoLink'}), link: {to: `/${this.context.intl.locale}/info`}},
            {name: this.context.intl.formatMessage({id: 'deliveryLink'}), link: {to: `/${this.context.intl.locale}/delivery`}},
        ];

        // Return a content block's items
        let blockItems = (items) => {
            return items.map(function (item, idx) {
                return (
                    <li key={idx} className="footer__list-item">
                        <Link className="footer__link" to={item.link.to}>
                            <Text size="small">{item.name}</Text>
                        </Link>
                    </li>
                );
            });
        };

        //
        // Return
        //

        return (
            <div className="footer">
                <div className="footer__container">
                    <div className="footer__content">

                        <div className="footer__block">
                            <div className="footer__block-title">
                                <Heading size="small">
                                    <FormattedMessage id="infoTitle" />
                                </Heading>
                            </div>
                            <div className="footer__block-content">
                                <ul>
                                    {blockItems(infoLinks)}
                                </ul>
                            </div>
                        </div>

                        <div className="footer__block">
                            <div className="footer__block-title">
                                <Heading size="small">
                                    <FormattedMessage id="socialTitle" />
                                </Heading>
                            </div>
                            <div className="footer__block-content">
                                <ul>
                                    <li className="footer__social-item">
                                        <div className="footer__social-icon footer__facebook-icon"></div>
                                        <div>
                                            <a className="footer__link footer__social-link" href="//facebook.com" target="_blank">
                                                <Text size="small">Facebook</Text>
                                            </a>
                                        </div>
                                    </li>
                                    <li className="footer__social-item">
                                        <div className="footer__social-icon footer__instagram-icon"></div>
                                        <div>
                                            <a className="footer__link footer__social-link" href="//instagram.com" target="_blank">
                                                <Text size="small">Instagram</Text>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="footer__block">
                            <div className="footer__block-title">
                                <Heading size="small">
                                    <FormattedMessage id="newsletterTitle" />
                                </Heading>
                            </div>
                            <div className="footer__block-content">
                                <NewsletterSubscription />
                            </div>
                        </div>

                    </div>
                    <div className="footer__copyright">
                        <Text size="small">© {new Date().getFullYear()} {this.props.brandName}</Text>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Exports
 */
export default Footer;
