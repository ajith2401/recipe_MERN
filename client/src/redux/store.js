import { combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from "./user/userSlice.js";
import storage from 'redux-persist/lib/storage';
import {persistReducer,persistStore,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER} from "redux-persist";
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
      serializableCheck: {
        ignoredActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER],
      } 
    });
  }
});   

export const persistor = persistStore(store )
