import applicationActions from '../../constants/application';
// TODO: remove all from PageLoading
export default function triggerPageLoading(context, payload, done) {
    context.dispatch(applicationActions.APPLICATION_PAGE_LOADING_TRIGGER, payload);
}
