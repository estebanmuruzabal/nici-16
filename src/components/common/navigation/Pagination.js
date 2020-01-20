/**
 * Imports
 */
import React from 'react';
import queryString from 'query-string';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component
 */
class Pagination extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./Pagination.scss');
    }

    //*** Template ***//

    render() {

        //
        // Helper methods & variables
        //

        let query = queryString.parse(this.props.location.search);
        let previousPage = (this.props.currentPage > 1) ? this.props.currentPage-1 : 1;
        let nextPage = (this.props.currentPage < this.props.totalPages) ? this.props.currentPage+1 : this.props.totalPages;

        let pageLinks = () => {
            let links = [];
            for (let i=0; i<this.props.totalPages; i++) {
                if ((i+1) === this.props.currentPage) {
                    links.push(
                        <li key={i} className="pagination__item pagination__item--selected">
                            {i+1}
                        </li>
                    );
                } else {
                    links.push(
                        <li key={i} className="pagination__item">
                            <Link className="pagination__link"
                                  to={{
                                    pathname: this.props.to,
                                    search: queryString.stringify(Object.assign({}, query, {page: i+1}))
                                  }}>
                                {i+1}
                            </Link>
                        </li>
                    );
                }
            }
            return links;
        };

        //
        // Return
        //
        return (
            <div className="pagination">
                <ul>
                    <li className="pagination__item">
                        <Link className="pagination__link"
                              to={{
                                pathname: this.props.to,
                                search: queryString.stringify(Object.assign({}, query, {page: previousPage}))
                              }}>
                            <FormattedMessage id="previous"/>
                        </Link>
                    </li>
                    {pageLinks()}
                    <li className="pagination__item">
                        <Link className="pagination__link"
                              to={{
                                pathname: this.props.to,
                                search: queryString.stringify(Object.assign({}, query, {page: nextPage}))
                              }}>
                            <FormattedMessage id="next" />
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

/**
 * Exports
 */
export default Pagination;
