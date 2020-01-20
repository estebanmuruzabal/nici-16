/**
 * Imports.
 */
import {series} from 'async';

/**
 * Fetch data required for components involved in the given route,
 * according to the respective hierarchy.
 */
export default async function (context, branch, query) {

    // Create the promises hash.
    let promises = branch.filter(function ({route}) {
        return route.component.fetchData;
    }).reduce(function (promises, {route, match}) {
        // Reduce to a hash of `key:promise`.
        promises[route.name] = route.component.fetchData.bind(null, context, match.params, query);
        return promises;
    }, {});


    // Return promise required for this function to be async/await.
    return new Promise(function (resolve, reject) {
        // Series, so that the component hierarchy is respected when fetching data and only start the next
        // after previous was completed.
        series(promises, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
