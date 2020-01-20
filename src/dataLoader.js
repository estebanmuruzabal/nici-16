/**
 * Imports
 */
/*global document, window */
import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';

import queryString from 'query-string';

import fetchData from './utils/fetchData';
import fetchPageTitleAndSnippets from './utils/fetchPageTitleAndSnippets';
import triggerPageLoading from './actions/Application/triggerPageLoading';

import config from './config';

/**
 * Data Loader to fetch data for current route
 */

class DataLoader extends React.Component {
    state = {
        previousLocation: null
    }

    componentWillReceiveProps(nextProps) {
        const navigated = nextProps.location !== this.props.location;
        const { routes } = this.props;

        if (navigated) {
            // new navigation - scroll to top
            this.props.context.executeAction(triggerPageLoading, true);
            // save the location so we can render the old screen
            this.setState({
                previousLocation: this.props.location
            });

            const branch = matchRoutes(routes, nextProps.location.pathname);
            const query = queryString.parse(nextProps.location.search);
            fetchData(context, branch, query)
                .then(() => {
                    let pageTitleAndSnippets = fetchPageTitleAndSnippets(context, branch);
                    // set default title to spanish language
                    document.title = pageTitleAndSnippets ? pageTitleAndSnippets.title : config.app.title.es;
                    window.scrollTo(0, 0);

                    this.props.context.executeAction(triggerPageLoading, false);
                    this.setState({
                        previousLocation: null
                    })
                });
        }
    }

    render() {
        const { children, location } = this.props
        const { previousLocation } = this.state

        // use a controlled <Route> to trick all descendants into
        // rendering the old location
        return (
            <Route
                location={previousLocation || location}
                render={() => children}
            />
        )
    }
};

/**
 * Exports
 */
export default withRouter(DataLoader);
