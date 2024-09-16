'use client';

import { Provider } from 'react-redux';
import configureStore from './configureStore';

const store = configureStore();

const AppProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default AppProvider;
