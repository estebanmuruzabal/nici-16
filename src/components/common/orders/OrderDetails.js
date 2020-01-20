/**
 * Imports
 */
import React from 'react';
import moment from 'moment';
import { FormattedMessage, FormattedNumber, injectIntl, intlShape } from 'react-intl';

import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

// Required components
import AddressPreview from '../forms/AddressPreview';
import Breakpoint from '../../core/Breakpoint';
import Heading from '../typography/Heading';
import Table from '../tables/Table';
import Text from '../typography/Text';

import OrderStatus from './OrderStatus';

/**
 * Component
 */
class OrderDetails extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {
        // Component styles
        require('./OrderDetails.scss');
    }

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //
        let locale = this.context.intl.locale;

        // Order products list table
        let headings = [
            <FormattedMessage id="nameHeading" />,
            <FormattedMessage id="id" />,
            <FormattedMessage id="skuHeading" />,
            <FormattedMessage id="quantityHeading" />,
            <FormattedMessage id="priceHeading" />
        ];
        let rows = this.props.order.checkout.cart.products.map((product) => {
            return {
                data: [
                    <Text size="medium">
                        {product.details.name[locale]}
                    </Text>,
                    <span className="order-details__link">
                        <Link to={`/${locale}/products/${product.id}`}>
                            <Text size="small">{product.id}</Text>
                        </Link>
                    </span>,
                    <Text size="medium">{product.details.sku}</Text>,
                    <Text size="medium">{product.quantity}</Text>,
                    <Text size="medium">
                        <FormattedNumber value={product.details.pricing.retail}
                                     style="currency"
                                     currency={this.props.order.checkout.currency} />
                    </Text>
                ]
            };
        });

        //
        // Return
        //
        return (
            <div className="order-details">
                <div className="order-details__overview">
                    {this.props.customerDetails !== false ?
                        <div className="order-details__overview-item">
                            <div className="order-details__overview-item-label">
                                <Text size="medium" weight="bold">
                                    <FormattedMessage id="customer" />:
                                </Text>
                            </div>
                            <div className="order-details__overview-item-value">
                                <Text size="medium">
                                    {this.props.order.customer.name} ({this.props.order.customer.email})
                                    {this.props.order.customer.userId ?
                                        <span className="order-details__user-icon">
                                        <i className="fa fa-user" aria-hidden="true" />
                                    </span>
                                        :
                                        null
                                    }
                                </Text>
                            </div>
                        </div>
                        :
                        null
                    }
                    <div className="order-details__overview-item">
                        <div className="order-details__overview-item-label">
                            <Text size="medium" weight="bold">
                                <FormattedMessage id="createdAt" />:
                            </Text>
                        </div>
                        <div className="order-details__overview-item-value">
                            <Text size="medium">
                                {moment(this.props.order.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                            </Text>
                        </div>
                    </div>
                    <div className="order-details__overview-item">
                        <div className="order-details__overview-item-label">
                            <Text size="medium" weight="bold">
                                <FormattedMessage id="id" />:
                            </Text>
                        </div>
                        <div className="order-details__overview-item-value">
                            <Text size="small">
                                {this.props.order.id}
                            </Text>
                        </div>
                    </div>
                    <div className="order-details__overview-item">
                        <div className="order-details__overview-item-label">
                            <Text size="medium" weight="bold">
                                <FormattedMessage id="status" />:
                            </Text>
                        </div>
                        <div className="order-details__overview-item-value">
                            <OrderStatus status={this.props.order.status} />
                        </div>
                    </div>
                </div>
                <div className="order-details__detail">
                    <Heading size="medium">
                        <FormattedMessage id="billingDetails" />
                    </Heading>
                    <div className="order-details__detail-content">
                        <div>
                            <AddressPreview address={this.props.order.checkout.billingAddress} />
                        </div>
                        <div>
                            <Text size="medium" weight="bold">
                                <FormattedMessage id="paymentMethod" />:
                            </Text>
                            <br />
                            <Text size="medium">{this.props.order.checkout.paymentMethod}</Text>
                        </div>
                    </div>
                </div>
                <div className="order-details__detail">
                    <Heading size="medium">
                        <FormattedMessage id="shippingDetails" />
                    </Heading>
                    <div className="order-details__detail-content">
                        <div>
                            <AddressPreview address={this.props.order.checkout.shippingAddress} />
                        </div>
                        <div>
                            <Text size="medium" weight="bold">
                                <FormattedMessage id="shippingMethod" />:
                            </Text>
                            <br />
                            <Text size="medium">{this.props.order.checkout.shippingMethod}</Text>
                            <br />
                            <br />
                            <Text size="medium" weight="bold">
                                <FormattedMessage id="shippingCost" />:
                            </Text>
                            <br />
                            <Text size="medium">
                                <FormattedNumber value={this.props.order.checkout.shippingCost}
                                                 style="currency"
                                                 currency={this.props.order.checkout.currency} />
                            </Text>
                        </div>
                    </div>
                </div>
                <div className="order-details__detail">
                    <Heading size="medium">
                        <FormattedMessage id="products" />
                    </Heading>
                    <div className="order-details__detail-content">
                        <Breakpoint point="handhelds">
                            {rows.map(function (row, idx) {
                                return (
                                    <div key={idx} className="order-details__product-block">
                                        <div className="order-details__product-name">
                                            {row.data[0]}
                                        </div>
                                        <div className="order-details__product-quantity">
                                            {row.data[3]}&nbsp;x&nbsp;{row.data[4]}
                                        </div>
                                    </div>
                                );
                            })}
                        </Breakpoint>
                        <Breakpoint point="medium-screens">
                            <Table headings={headings} rows={rows} />
                        </Breakpoint>
                        <Breakpoint point="wide-screens">
                            <Table headings={headings} rows={rows} />
                        </Breakpoint>
                    </div>
                    <div className="order-details__detail-content order-details__detail-content--column">
                        <div>
                            <Text size="medium" weight="bold">
                                <FormattedMessage id="subTotal" />:
                            </Text>
                            <br />
                            <FormattedNumber value={this.props.order.checkout.subTotal}
                                             style="currency"
                                             currency={this.props.order.checkout.currency} />
                        </div>
                        <div>
                            <Text size="medium" weight="bold">
                                <FormattedMessage id="shipping" />:
                            </Text>
                            <br />
                            <FormattedNumber value={this.props.order.checkout.shippingCost}
                                             style="currency"
                                             currency={this.props.order.checkout.currency} />
                        </div>
                        <div>
                            <Text size="medium" weight="bold">
                                <FormattedMessage id="vat" />:
                            </Text>
                            <br />
                            <FormattedNumber value={this.props.order.checkout.vatTotal}
                                             style="currency"
                                             currency={this.props.order.checkout.currency} />
                        </div>
                        <div>
                            <Text size="medium" weight="bold">
                                <FormattedMessage id="total" />:
                            </Text>
                            <br />
                            <FormattedNumber value={this.props.order.checkout.total}
                                             style="currency"
                                             currency={this.props.order.checkout.currency} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Exports
 */
export default OrderDetails;
