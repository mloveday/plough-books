import reduxCrud from 'redux-crud';

const testIdentifier = 'test';
const testSyncActionCreators = reduxCrud.actionCreatorsFor(testIdentifier);
const testAsyncActionCreators = {
  fetchStart() {
    return (dispatch: any) => {
      return fetch('http://localhost:8000/')
        .then(r => r.text())
        .then(d => {dispatch(testSyncActionCreators.fetchSuccess([{data: JSON.stringify(d), id: 1}]));})
        .catch(e => {dispatch(testSyncActionCreators.fetchError(e));})
        ;
    }
  }
};
export const testActionCreators = Object.assign(testSyncActionCreators,testAsyncActionCreators);

export const reducers = {
  test: reduxCrud.Map.reducersFor(testIdentifier)
};