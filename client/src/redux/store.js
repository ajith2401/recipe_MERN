import { combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from "./user/userSlice.js";
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const persisCofig = {
    key:"root",
    storage,
    version: 1
}
const rootReducer = combineReducers({user:userReducer})

const persistReducerVal = persistReducer(persisCofig, rootReducer)

export const store = configureStore({
  reducer: persistReducerVal,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    });
  }
});  

export const persistor = persistStore(store )
