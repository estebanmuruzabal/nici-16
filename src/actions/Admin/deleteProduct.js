import applicationActions from '../../constants/application';
import productActions from '../../constants/products';

export default function deleteProduct(context, payload, done) {
    context.dispatch(productActions.PRODUCTS_ITEM_DELETE);
    context.api.products.delete(payload).then(function successFn(result) {
        context.dispatch(productActions.PRODUCTS_ITEM_DELETE_SUCCESS, result);
        context.dispatch(applicationActions.APPLICATION_POST_NOTIFICATION, {
            type: 'success',
            message: 'Deleted'
        });
        done && done();
    }, function errorFn(err) {
        context.dispatch(productActions.PRODUCTS_ITEM_DELETE_ERROR, err.result);
        context.dispatch(applicationActions.APPLICATION_POST_NOTIFICATION, {
            type: 'error',
            message: 'Unable to delete'
        });
        done && done();
    });
}
