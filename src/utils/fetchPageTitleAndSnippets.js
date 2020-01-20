/**
 * Go through the route handlers that have page title and snippets definitions
 * and return the last one in the hierarchy
 */
export default function fetchPageTitleAndSnippets(context, branch) {
    let routes = branch.filter(function ({route}) {
        return route.component.pageTitleAndSnippets;
    });

    if (routes.length > 0) {
        return routes[routes.length-1].route.component.pageTitleAndSnippets(context, routes[routes.length-1].match.params, routes[routes.length-1].match.query);
    } else {
        return null;
    }
}
