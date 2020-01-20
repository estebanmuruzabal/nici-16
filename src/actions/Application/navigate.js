import applicationActions from '../../constants/application';

export default function (actionContext, payload, done) {
    actionContext.dispatch(applicationActions.APPLICATION_CHANGE_ROUTE, payload);
    done();
};
