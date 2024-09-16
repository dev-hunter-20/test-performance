import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootReducer from '@/redux/reducers';
import rootSaga from '@/redux/saga';

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = applyMiddleware(sagaMiddleware);
  const store = createStore(rootReducer, composeWithDevTools(middlewares));

  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;
