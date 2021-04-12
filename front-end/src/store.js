import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import apiMiddleware from './utils/apiMiddleware';

const initialState = {};

const middlewares = [ thunk, apiMiddleware ];


const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middlewares)));
export default store;